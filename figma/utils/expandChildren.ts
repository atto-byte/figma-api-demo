import { Document, Horizontal, NodeType, Vertical } from '../types';
import { nodeSort } from "../utils/parsers";

const GROUP_TYPES = ['GROUP', 'BOOLEAN_OPERATION'];

export default function expandChildren(node: Document, parent: Document | null, minChildren, maxChildren, centerChildren, offset) {
  let nodeChildren =  node.children || [];
  const numChildren = nodeChildren.length;
  let added = offset;
  nodeChildren = nodeChildren.reduce((acc, child, i) => {
    if(!child) return acc
    const notCanvas = child.type !== 'CANVAS'
    const notRoot = parent != null
    if(notCanvas && notRoot && (node.type === 'COMPONENT' || node.type === 'INSTANCE')){
      child.constraints = {vertical: Vertical.TopBottom, horizontal: Horizontal.LeftRight};
    }
    if (GROUP_TYPES.indexOf(child.type) >= 0) {
      let expandedChildren
      switch (child.type) {
        case NodeType.Group:
          expandedChildren = expandChildren(child, node, minChildren, maxChildren, centerChildren, added+i);
          break;
        case NodeType.Boolean:
          break;
        default:
          expandedChildren = expandChildren(child, node, minChildren, maxChildren, centerChildren, added+i);
          
          break;
      }
      added += expandedChildren.addedId
      minChildren= expandedChildren.minChildren
      maxChildren= expandedChildren.maxChildren
      centerChildren= expandedChildren.centerChildren
      child.children = expandedChildren.nodeChildren
    } else {
      centerChildren.push(child);
    }

    child.order = i + added;
    return [...acc, child]
  }, [])
  
  minChildren.sort(nodeSort);
  maxChildren.sort(nodeSort);
  const addedId = added + numChildren - offset
  return {addedId, minChildren, maxChildren, centerChildren, nodeChildren };
}