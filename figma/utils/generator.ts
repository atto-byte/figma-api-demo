import { Document } from './../types';
import tab from './tab';
export function generateComponentStart(styles: React.CSSProperties, outerStyle: React.CSSProperties, outerClass: string, node: Document, innerClass: string, tabNum: number) {
  let componentStr = ''
  componentStr += `${tab(tabNum)}<div style={${JSON.stringify(outerStyle)}} className="${outerClass}">\n`;
  componentStr += `${tab(tabNum + 1)}<div\n`;
  componentStr += `${tab(tabNum + 2)}id="${node.id}"\n`;
  componentStr += `${tab(tabNum + 2)}style={${JSON.stringify(styles)}}\n`;
  componentStr += `${tab(tabNum + 2)}className="${innerClass}"\n`;
  componentStr += `${tab(tabNum + 1)}>\n`;
  return componentStr
}
export function generateComponentEnd() {
  let end = `${tab(4)}</div>\n`
  end += `${tab(3)}</div>\n`
  return end
}
export function addLineToDoc(msg, indent: string, doc: string) {
  doc += `${indent}${msg}\n`;
  return doc
}