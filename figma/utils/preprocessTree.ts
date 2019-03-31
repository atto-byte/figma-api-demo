import { Document, Paint, NodeType, VectorMap } from '../types';

const vectorTypes = ['VECTOR', 'LINE', 'REGULAR_POLYGON', 'ELLIPSE', 'STAR'];
const isVector = (node:Document) => vectorTypes.indexOf(node.type) >= 0;

export function preprocessTree(node: Document) {
  let vectorMap: VectorMap = {};
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

  let visibleChildren = node.children && node.children.filter((child) => child.visible !== false);
  if (visibleChildren) {
    visibleChildren = visibleChildren.map(child => {
      if (isVector(child)) {
        child.type = NodeType.Vector
        vectorMap[child.id] = child;
      }
      return child
    })
    node.children = visibleChildren.map(child =>  {
      const processed = preprocessTree(child)
      const childVectorMap = processed.vectorMap
      vectorMap = {...vectorMap, ...childVectorMap}
      return processed.node
    })
    if (isVector(node)) {
      node.type = NodeType.Vector
      node.constraints = {
        vertical: vectorVConstraint,
        horizontal: vectorHConstraint,
      };
    }
  }

  if (isVector(node)) {
    node.type = NodeType.Vector;
    vectorMap[node.id] = node;
  }

  return {node, vectorMap};
}