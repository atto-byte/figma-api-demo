import { parseRectangleStyles } from './parseStyles';
import { NodeType, Document, ComponentMap, VectorMap } from './../types';
import { parseText, parseBounds, parseBackground, parseEffects, getPaint, colorString } from "./parsers";
import expandChildren from './expandChildren';
import tab from './tab';
import { generateComponentStart, generateComponentEnd } from './generator';
export const visitNode = (vectorMap: VectorMap, masterComponentsMap: ComponentMap, node: Document, parent: Document | null, lastVertical, tabNum: number) => {
  let content = null;
  let img = null;
  let styles: React.CSSProperties = {
    backgroundRepeat: "no-repeat"
  };
  const notRoot = (parent !== null)
  let minChildren = [];
  let maxChildren = [];
  let centerChildren = [];
  let bounds = null;
  let nodeBounds = null;

  if (notRoot) {
    nodeBounds = node.absoluteBoundingBox;
    const nx2 = nodeBounds.x + nodeBounds.width;
    const ny2 = nodeBounds.y + nodeBounds.height;
    const parentBounds = parent.absoluteBoundingBox;
    const px = parentBounds.x;
    const py = parentBounds.y;

    bounds = {
      left: nodeBounds.x - px,
      right: px + parentBounds.width - nx2,
      top: lastVertical == null ? nodeBounds.y - py : nodeBounds.y - lastVertical,
      bottom: py + parentBounds.height - ny2,
      width: nodeBounds.width,
      height: nodeBounds.height,
    }
  }

  const expandedChildren = expandChildren(node, parent, minChildren, maxChildren, centerChildren, 0);
  minChildren= expandedChildren.minChildren
  maxChildren= expandedChildren.maxChildren
  centerChildren= expandedChildren.centerChildren
  node.children = expandedChildren.nodeChildren

  let outerClass = 'outerDiv';
  let innerClass = 'innerDiv';
  const cHorizontal = node.constraints && node.constraints.horizontal;
  const cVertical = node.constraints && node.constraints.vertical;
  let outerStyle: React.CSSProperties = {
    position: 'absolute',
    height: '100%',
    top: 0, left: 0,
    width: '100%'
  };

  if (node.order) outerStyle.zIndex = node.order;
  
  
  

  // if (bounds && bounds.height && cVertical !== 'TOP_BOTTOM') styles.height = bounds.height;
  const parsedBounds = parseBounds(parent, outerClass, outerStyle, cHorizontal, cVertical, bounds, styles)
  styles = parsedBounds.styles
  outerClass = parsedBounds.outerClass
  outerStyle = parsedBounds.outerStyle

  switch (node.type) {
    case NodeType.Rectangle:
      styles = parseRectangleStyles(node, styles)
      break;
    case NodeType.Text:
      const parsedText = parseText(node,styles)
      // TODO Implement
      content = parsedText.content
      styles = parsedText.styles
      break;
    default:
      break;
  }
  if (['FRAME','INSTANCE', 'COMPONENT'].indexOf(node.type) >= 0) {
    styles.backgroundColor = colorString(node.backgroundColor);
    if (node.clipsContent) styles.overflow = 'hidden';
  } 

  let componentStr = ``
  if (notRoot) {
    componentStr = generateComponentStart(styles, outerStyle, outerClass, node, innerClass, tabNum);
  }
  // if (node.id !== component.id && node.name.charAt(0) === '#') {
  const componentExists = Boolean(masterComponentsMap[node.id])
  if (componentExists) {
    componentStr += `    <C${node.name.replace(/\W+/g, '')} {...this.props} nodeId="${node.id}" />\n`
    // masterComponentsMap= createComponent(node, imgMap, masterComponentsMap);
  } else if (vectorMap[node.id]) {
    componentStr += `    <div className="vector" dangerouslySetInnerHTML={{__html: \`${vectorMap[node.id]}\`}} />\n`
  } else {
    const newNodeBounds = node.absoluteBoundingBox;
    const newLastVertical = newNodeBounds && newNodeBounds.y + newNodeBounds.height;
    
    const minChildComponentStr = parseMinChildren(minChildren, vectorMap, masterComponentsMap, node, newLastVertical, tabNum);
    const centerChildComponentStr = parseCenterChildren(centerChildren, vectorMap, masterComponentsMap, node, tabNum);
    const maxChildComponentStr = parseMaxChildren(maxChildren, outerClass, styles, outerStyle, node, innerClass, tabNum, vectorMap, masterComponentsMap, newLastVertical);
    const contentString = parseContent(content, node, tabNum);

    componentStr += contentString + minChildComponentStr + centerChildComponentStr + maxChildComponentStr
  }
  if (notRoot) {
    componentStr+= generateComponentEnd();
  }
  return componentStr
}

function parseContent(content: any, node: Document, tabNum: number) {
  let contentString = ''
  if (content != null) {
    if (node.name.charAt(0) === '$') {
      const varName = node.name.substring(1);
      contentString += `${tab(tabNum + 3)}{props[${varName}] && props[${varName}].split("\\n").map((line, idx) => <div key={idx}>{line}</div>)}\n`;
      contentString += `${tab(tabNum + 3)}{!props[${varName}] && (<div>\n`;
      for (const piece of content) {
        contentString += `${tab(tabNum + 4)}${piece}\n`;
      }
      contentString += `${tab(3)}</div>)}\n`;
    }
    else {
      for (const piece of content) {
        contentString += `${tab(tabNum)}${piece}\n`;
      }
    }
  }
  return contentString;
}

function parseMaxChildren(maxChildren: any[], outerClass: string, styles, outerStyle, node: Document, innerClass: string, tabNum: number, vectorMap: VectorMap, masterComponentsMap: ComponentMap, newLastVertical: number) {
  let maxChildComponentStr = '';
  let first = true
  if (maxChildren.length > 0) {
    outerClass += ' maxer';
    styles.width = '100%';
    styles.pointerEvents = 'none';
    styles.backgroundColor = null;
    maxChildComponentStr += generateComponentStart(styles, outerStyle, outerClass, node, innerClass, tabNum + 3);
    first = true;
    for (const child of maxChildren) {
      maxChildComponentStr += visitNode(vectorMap, masterComponentsMap, child, node, first ? null : newLastVertical, tabNum + 5);
      first = false;
    }
    maxChildComponentStr += generateComponentEnd();
  }
  return maxChildComponentStr;
}

function parseCenterChildren(centerChildren: any[], vectorMap: VectorMap, masterComponentsMap: ComponentMap, node: Document, tabNum: number) {
  let centerChildComponentStr = '';
  for (const child of centerChildren) {
    centerChildComponentStr += visitNode(vectorMap, masterComponentsMap, child, node, null, tabNum + 3);
  }
  ;
  return centerChildComponentStr;
}

function parseMinChildren(minChildren: any[], vectorMap: VectorMap, masterComponentsMap: ComponentMap, node: Document, newLastVertical: number, tabNum: number) {
  let first = true;
  let minChildComponentStr = '';
  for (const child of minChildren) {
    minChildComponentStr += visitNode(vectorMap, masterComponentsMap, child, node, first ? null : newLastVertical, tabNum + 3);
    first = false;
  }
  return minChildComponentStr;
}
