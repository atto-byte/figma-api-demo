require('dotenv').config()
import fetch from 'node-fetch';
import * as figma from './figma';
import { ComponentMap, Document, VectorMap, NodeType } from './types';
import fetchData from './utils/fetchData';
import { preprocessTree } from './utils/preprocessTree';
import { colorString } from './utils/parsers';
import tab from './utils/tab';
const fs = require('fs');
let devToken = process.env.DEV_TOKEN;


const headers = {
  'X-Figma-Token': devToken
}

const fileKey = process.env.FILE_KEY
const baseUrl = 'https://api.figma.com';





async function main() {
  const { canvas, data } = await fetchData();
  let html = '';
  let processed = preprocessTree(canvas)
  const processedChildren = processed.node.children



  let vectorIdsStr = Object.keys(processed.vectorMap).join(',')
  const vectorsResponse = await fetch(`${baseUrl}/v1/images/${fileKey}?ids=${vectorIdsStr}&format=svg`, {headers});
  const vectorsJSON = await vectorsResponse.json();

  const vectorUrls = vectorsJSON.images || {};
  // const splitVectorUrls =  Object.keys(vectorUrls).reduce((acc, vectorId) => {
  //   const Ids = vectorId.split(';')
  //   Ids.forEach(id => {
  //     acc = {...acc, [id]: vectorUrls[vectorId], }
  //   });
  //   return acc
  // }, {})
  const vectorMap: VectorMap = await Object.keys(vectorUrls).reduce(async (accumP, vectorId) => {
    if(vectorUrls[vectorId]){
      let accum = await accumP
      const response = await fetch(vectorUrls[vectorId])
      const text = await response.text();
      if(text){
        accum = {...accum, [vectorId]: text.replace('<svg ', '<svg preserveAspectRatio="1" ')};
      }
      return accum
    } else {
      return accumP
    }
  }, Promise.resolve({}))
  const {masterComponentsMap, masterComponents} = generateMasterComponents(processedChildren, vectorMap)
  const imports = generateImports(masterComponentsMap);
  const {funStr, componentsStrs} = generateComponents(masterComponentsMap);

  const figmaComponentsDocStr = imports + masterComponents + funStr + componentsStrs

  saveFigmaComponents(figmaComponentsDocStr);
}

main().catch((err) => {
  console.error(err);
  console.error(err.stack);
});

function generateMasterComponents(children: Document[],vectors: VectorMap){
  let masterComponents = `\n`;
  let masterComponentsMap: ComponentMap = {};
  children.forEach(child => {
    switch (child.type) {
      case NodeType.Component:
        const masterComponentStr = createMasterComponent(child);
        masterComponents += masterComponentStr
        break;
      case NodeType.Instance:
        masterComponentsMap = figma.createComponentInstance(child, null, vectors, masterComponentsMap);
      default:
        break;
    }
  })
  return {masterComponentsMap, masterComponents};
}
function createMasterComponent(child: Document) {
  let masterComponentStr = '';
  masterComponentStr += `export const Master${child.name.replace(/\W+/g, "")}: React.SFC<any> = (props) => {\n`;
  masterComponentStr += `${tab(1)}return(\n`;
  masterComponentStr += `${tab(2)}<div\n`;
  masterComponentStr += `${tab(3)}className="master"\n`;
  masterComponentStr += `${tab(3)}style={{backgroundColor: "${colorString(child.backgroundColor)}"}}\n`;
  masterComponentStr += `${tab(2)}>\n`;
  masterComponentStr += `${tab(3)}<C${child.name.replace(/\W+/g, "")} {...props} nodeId="${child.id}" />\n`;
  masterComponentStr += `${tab(2)}</div>\n`;
  masterComponentStr += `${tab(1)})\n`;
  masterComponentStr += "}\n\n";
  return masterComponentStr;
}

function generateComponents(componentMap: ComponentMap) {
  let funStr = `export function getComponentFromId(id) {\n`;
  let componentsStrs = `\n`
  for (const componentKey in componentMap) {
    funStr += `  if (id === "${componentKey}") return ${componentMap[componentKey].instance};\n`;
    // This adds the component to the document
    componentsStrs += componentMap[componentKey].componentStr + "\n";
  }
  funStr += "  return null;\n}\n\n";
  return {funStr, componentsStrs};
}

function saveFigmaComponents(data: string) {
  const path = "src/figmaComponents.tsx";
  fs.writeFile(path, data, function (err) {
    if (err)
      console.log(err);
    console.log(`wrote ${path}`);
  });
}

function generateImports(componentMap: ComponentMap) {
  const imported = {};
  let imports = `import * as React from 'react';\n`;
  for (const key in componentMap) {
    const component = componentMap[key];
    const name = component.name;
    if (!imported[name]) {
      imports += `import { ${name} } from './components/${name}';\n`;
    }
    imported[name] = true;
  }
  return imports;
}

