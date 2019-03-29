require('dotenv').config()
import fetch from 'node-fetch';
import * as figma from './figma';
import fetchData from './utils/fetchData';
import { Document, NodeType, Paint } from './types';
const fs = require('fs');
const componentList = [];
let devToken = process.env.DEV_TOKEN;


const headers = {
  'X-Figma-Token': devToken
}

const fileKey = process.env.FILE_KEY
const baseUrl = 'https://api.figma.com';

const vectorMap = {};
const vectorList = [];
const vectorTypes = ['VECTOR', 'LINE', 'REGULAR_POLYGON', 'ELLIPSE', 'STAR'];


function preprocessTree(node: Document) {
  let vectorsOnly = node.name.charAt(0) !== '#';
  let vectorVConstraint = null;
  let vectorHConstraint = null;

  function paintsRequireRender(paints: Paint[]) {
    if (!paints) return false;

    let numPaints = 0;
    for (const paint of paints) {
      if (paint.visible === false) continue;

      numPaints++;
      if (paint.type === 'EMOJI') return true;
    }

    return numPaints > 1;
  }

  
  if (paintsRequireRender(node.fills) ||
      paintsRequireRender(node.strokes) ||
      (node.blendMode != null && ['PASS_THROUGH', 'NORMAL'].indexOf(node.blendMode) < 0)) {
    node.type = NodeType.Vector;
  }

  const children = node.children && node.children.filter((child) => child.visible !== false);
  if (children) {
    for (let j=0; j<children.length; j++) {
      if (vectorTypes.indexOf(children[j].type) < 0) vectorsOnly = false;
      else {
        if (vectorVConstraint != null && children[j].constraints.vertical != vectorVConstraint) vectorsOnly = false;
        if (vectorHConstraint != null && children[j].constraints.horizontal != vectorHConstraint) vectorsOnly = false;
        vectorVConstraint = children[j].constraints.vertical;
        vectorHConstraint = children[j].constraints.horizontal;
      }
    }
  }
  node.children = children;

  if (children && children.length > 0 && vectorsOnly) {
    node.type = NodeType.Vector;
    node.constraints = {
      vertical: vectorVConstraint,
      horizontal: vectorHConstraint,
    };
  }

  if (vectorTypes.indexOf(node.type) >= 0) {
    node.type = NodeType.Vector;
    vectorMap[node.id] = node;
    vectorList.push(node.id);
    node.children = [];
  }

  if (node.children) {
    node.children = node.children.map(child =>  preprocessTree(child))
  }
  return node;
}

async function main() {
  const { canvas, data } = await fetchData();
  let html = '';

  let children = canvas.children.reduce((acc, child) => {
    if (child.visible !== false) {
      child = preprocessTree(child);
      return [...acc, child]
    }
    return acc
  }, [])
  



  let guids = vectorList.join(',');
  const imagesResponse = await fetch(`${baseUrl}/v1/images/${fileKey}?ids=${guids}&format=svg`, {headers});
  const imageJSON = await imagesResponse.json();

  const images = imageJSON.images || {};
  if (images) {
    let promises = [];
    let guids = [];
    for (const guid in images) {
      if (images[guid] == null) continue;
      guids.push(guid);
      promises.push(fetch(images[guid]));
    }

    let responses = await Promise.all(promises);
    promises = [];
    for (const resp of responses) {
      promises.push(resp.text());
    }

    responses = await Promise.all(promises);
    for (let i=0; i<responses.length; i++) {
      images[guids[i]] = responses[i].replace('<svg ', '<svg preserveAspectRatio="1" ');
    }
  }

  const componentMap = {};
  let contents = `import * as React from 'react';\n`;
  let nextSection = '';

  for (let i=0; i<canvas.children.length; i++) {
    const child = canvas.children[i]
    if (child.visible !== false) {
      const child = canvas.children[i];
      figma.createComponent(child, images, componentMap);
      nextSection += `export class Master${child.name.replace(/\W+/g, "")} extends React.PureComponent<any> {\n`;
      nextSection += "  render() {\n";
      nextSection += `    return <div className="master" style={{backgroundColor: "${figma.colorString(child.backgroundColor)}"}}>\n`;
      nextSection += `      <C${child.name.replace(/\W+/g, "")} {...this.props} nodeId="${child.id}" />\n`;
      nextSection += "    </div>\n";
      nextSection += "  }\n";
      nextSection += "}\n\n";
    }
  }

  const imported = {};
  for (const key in componentMap) {
    const component = componentMap[key];
    const name = component.name;
    if (!imported[name]) {
      contents += `import { ${name} } from './components/${name}';\n`;
    }
    imported[name] = true;
  }
  contents += "\n";
  contents += nextSection;
  nextSection = '';

  contents += `export function getComponentFromId(id) {\n`;

  for (const key in componentMap) {
    contents += `  if (id === "${key}") return ${componentMap[key].instance};\n`;
    nextSection += componentMap[key].doc + "\n";
  }

  contents += "  return null;\n}\n\n";
  contents += nextSection;

  const path = "src/figmaComponents.tsx";
  fs.writeFile(path, contents, function(err) {
    if (err) console.log(err);
    console.log(`wrote ${path}`);
  });
}

main().catch((err) => {
  console.error(err);
  console.error(err.stack);
});


