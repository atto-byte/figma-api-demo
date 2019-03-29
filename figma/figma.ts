import { Document, Horizontal, Vertical, NodeType, TypeStyle, TextAlignHorizontal, Pattern } from './types';
import { nodeSort, colorString, getPaint, imageURL, backgroundSize, paintToLinearGradient, paintToRadialGradient, dropShadow, innerShadow, parseRectangle, parseEffects } from "./utils/parsers";

const fs = require('fs');

const VECTOR_TYPES = ['VECTOR', 'LINE', 'REGULAR_POLYGON', 'ELLIPSE'];
const GROUP_TYPES = ['GROUP', 'BOOLEAN_OPERATION'];

interface CustomDocument extends Document {
  order?: number
}
function expandChildren(node: CustomDocument, parent: CustomDocument | null, minChildren, maxChildren, centerChildren, offset) {
  const children = node.type !== 'VECTOR' ?  node.children : null;
  let added = offset;

  if (children) {
    for (let i=0; i<children.length; i++) {
      const child = children[i];
      const notCanvas = child.type !== 'CANVAS'
      const notRoot = parent != null
      if(notCanvas && notRoot && (node.type === 'COMPONENT' || node.type === 'INSTANCE')){

        child.constraints = {vertical: Vertical.TopBottom, horizontal: Horizontal.LeftRight};
      }
      if (GROUP_TYPES.indexOf(child.type) >= 0) {
        console.log(child.type , child);
        switch (child.type) {
          case NodeType.Group:
          added += expandChildren(child, parent, minChildren, maxChildren, centerChildren, added+i);
            break;
          case NodeType.Boolean:
            
            break;
        
        
          default:
            added += expandChildren(child, parent, minChildren, maxChildren, centerChildren, added+i);
            break;
        }
        continue;
      } else {
        centerChildren.push(child);
      }

      child.order = i + added;

    }

    minChildren.sort(nodeSort);
    maxChildren.sort(nodeSort);

    return added + children.length - offset;
  }

  return added - offset;
}

const createComponent = (component, imgMap, componentMap) => {
  const name = 'C' + component.name.replace(/\W+/g, '');
  const instance = name + component.id.replace(';', 'S').replace(':', 'D');

  let doc = '';
  print(`class ${instance} extends React.PureComponent<any> {`, '');
  print(`  render() {`, '');
  print(`    return (`, '');

  const path = `src/components/${name}.tsx`;
  let componentSrc;
  if (!fs.existsSync(path)) {
    componentSrc = `import * as React from 'react';
import { getComponentFromId } from '../figmaComponents';

export class ${name} extends React.PureComponent<any> {
  state = {};

  render() {
    const Component = getComponentFromId(this.props.nodeId);
    return <Component {...this.props} {...this.state} />;
  }
}
`;
    fs.writeFile(path, componentSrc, function(err) {
      if (err) console.log(err);
      console.log(componentSrc)
      console.log(`wrote ${path}`);
    });
  }

  function print(msg, indent) {
    doc += `${indent}${msg}\n`;
  }

  const visitNode = (node: Document, parent: Document | null, lastVertical, indent) => {
    let content = null;
    let img = null;
    let styles: React.CSSProperties = {
      backgroundRepeat: "no-repeat"
    };
    const isRoot = (parent != null)
    let minChildren = [];
    const maxChildren = [];
    const centerChildren = [];
    let bounds = null;
    let nodeBounds = null;

    if (isRoot) {
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

    expandChildren(node, parent, minChildren, maxChildren, centerChildren, 0);

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

    if (node.order) {
      outerStyle.zIndex = node.order;
    }
    if (bounds != null){
      switch (cHorizontal) {
        case 'LEFT_RIGHT':
          if(parent.layoutGrids){
            const keyPoints = node.layoutGrids.reduce((acc, grid) => {
              if(grid.pattern ===  Pattern.Columns){
                const margin = grid.offset;
                for (let i = 0; i < grid.count; i++) {
                  const start = i === 0 ? margin : margin + i * (grid.sectionSize + grid.gutterSize)                 
                  const end = i === 0 ? margin + grid.sectionSize : margin + grid.sectionSize + i * (grid.sectionSize + grid.gutterSize)
                  acc.xKeyPoints = [...acc.xKeyPoints, start, end]
                }
                return acc
              }
              else if(grid.pattern ===  Pattern.Rows){
                const margin = grid.offset;
                for (let i = 0; i < grid.count; i++) {
                  const start = i === 0 ? margin : margin + i * (grid.sectionSize + grid.gutterSize)                 
                  const end = i === 0 ? margin + grid.sectionSize : margin + grid.sectionSize + i * (grid.sectionSize + grid.gutterSize)
                  acc.yKeyPoints = [...acc.yKeyPoints, start, end]
                }
                return acc
              }
            }, {xKeyPoints: [], yKeyPoints: [] , grid: []})

            const parentWidth = bounds.left + bounds.width + bounds.right;
          } else {
            styles.marginLeft = bounds.left;
            styles.marginRight = bounds.right;
            styles.flexGrow = 1;
          }
          break;
        case 'RIGHT':
          styles.marginRight = bounds.right;
          styles.marginLeft = 'auto';
          styles.width = bounds.width;
          styles.minWidth = bounds.width;
          break;
        case 'LEFT':
          styles.marginLeft = bounds.left;
          styles.marginRight = 'auto';
          styles.width = bounds.width;
          styles.minWidth = bounds.width;
          break;
        case 'CENTER':
          styles.width = bounds.width;
          styles.marginLeft = 'auto';
          styles.marginRight = 'auto';
          break;
        case 'SCALE':
          const parentWidth = bounds.left + bounds.width + bounds.right;
          styles.width = `${bounds.width*100/parentWidth}%`;
          styles.marginLeft = `${bounds.left*100/parentWidth}%`;
          break;
      
        default:
          styles.marginLeft = bounds.left;
          styles.width = bounds.width;
          styles.minWidth = bounds.width;
          break;
      }

      switch (cVertical) {
        case 'TOP_BOTTOM':
          outerClass += ' centerer';
          styles.marginTop = bounds.top;
          styles.marginBottom = bounds.bottom;
          break;
          
          case 'BOTTOM':
          outerStyle.justifyContent = 'flex-end';
          styles.marginTop = 'auto';
          styles.height = bounds.height;
          styles.marginBottom = bounds.bottom;
          styles.minHeight = bounds.height;
          break;
          
          case 'CENTER':
          outerClass += ' centerer';
          outerStyle.alignItems = 'center';
          styles.margin = 'auto'
          break;
          
          case 'TOP':
          styles.marginTop = bounds.top;
          outerStyle.justifyContent = 'center';
          styles.height = bounds.height;
          styles.marginBottom = 'auto';
          break;

        case 'SCALE':
          outerClass += ' centerer';
          const parentHeight = bounds.top + bounds.height + bounds.bottom;
          styles.height = `${bounds.height*100/parentHeight}%`;
          styles.top = `${bounds.top*100/parentHeight}%`;
          break;
      
        default:
          styles.marginTop = bounds.top;
          styles.marginBottom = bounds.bottom;
          styles.minHeight = styles.height;
          styles.height = null;
          break;
      }
    }
    

    // if (bounds && bounds.height && cVertical !== 'TOP_BOTTOM') styles.height = bounds.height;
   

    if (['FRAME', 'RECTANGLE', 'INSTANCE', 'COMPONENT'].indexOf(node.type) >= 0) {
      if (['FRAME', 'COMPONENT', 'INSTANCE'].indexOf(node.type) >= 0) {
        styles.backgroundColor = colorString(node.backgroundColor);
        if (node.clipsContent) styles.overflow = 'hidden';
      } else if (node.type === 'RECTANGLE') {
        parseRectangle(node, styles);
        parseEffects(node, styles);

        const lastStroke = getPaint(node.strokes);
        if (lastStroke) {
          if (lastStroke.type === 'SOLID') {
            const weight = node.strokeWeight || 1;
            styles.border = `${weight}px solid ${colorString(lastStroke.color)}`;
          }
        }

        const cornerRadii = node.rectangleCornerRadii;
        if (cornerRadii && cornerRadii.length === 4 && cornerRadii[0] + cornerRadii[1] + cornerRadii[2] + cornerRadii[3] > 0) {
          styles.borderRadius = `${cornerRadii[0]}px ${cornerRadii[1]}px ${cornerRadii[2]}px ${cornerRadii[3]}px`;
        }
      }
    } else if (node.type === 'TEXT') {
      const lastFill = getPaint(node.fills);
      if (lastFill) {
        styles.color = colorString(lastFill.color);
      }

      const lastStroke = getPaint(node.strokes);
      if (lastStroke) {
        const weight = node.strokeWeight || 1;
        styles.WebkitTextStroke = `${weight}px ${colorString(lastStroke.color)}`;
      }

      const fontStyle = node.style;
      const genTextAlign = (textAlignHorizontal: TextAlignHorizontal) => {
        console.log(textAlignHorizontal);
        if(!textAlignHorizontal) return 'center'

        if(textAlignHorizontal === TextAlignHorizontal.Justified){
          return "center"
        } else {
          return fontStyle.textAlignHorizontal && fontStyle.textAlignHorizontal.toLowerCase()
        }
      }
      // TODO Does this do anything
      const applyFontStyle = (_styles, fontStyle: TypeStyle) => {
        if (fontStyle) {
          _styles.fontSize = fontStyle.fontSize;
          _styles.fontWeight = fontStyle.fontWeight;
          _styles.fontFamily = fontStyle.fontFamily;
          _styles.textAlign = genTextAlign(fontStyle.textAlignHorizontal);
          _styles.fontStyle = fontStyle.italic ? 'italic' : 'normal';
          _styles.lineHeight = `${fontStyle.lineHeightPercent * 1.25}%`;
          _styles.letterSpacing = `${fontStyle.letterSpacing}px`;
        }
      }
      applyFontStyle(styles, fontStyle);

      if (node.name.substring(0, 6) === 'input:') {
        content = [`<input key="${node.id}" type="text" placeholder="${node.characters}" name="${node.name.substring(7)}" />`];
      } else if (node.characterStyleOverrides) {
        let para = '';
        const ps = [];
        const styleCache = {};
        let currStyle = 0;

        const commitParagraph = (key) => {
          if (para !== '') {
            if (styleCache[currStyle] == null && currStyle !== 0) {
              styleCache[currStyle] = {};
              applyFontStyle(styleCache[currStyle], node.styleOverrideTable[currStyle]);
            }

            const styleOverride = styleCache[currStyle] ? JSON.stringify(styleCache[currStyle]) : '{}';

            ps.push(`<span style={${styleOverride}} key="${key}">${para}</span>`);
            para = '';
          }
        }


        for (const i in node.characters) {
          let idx = node.characterStyleOverrides[i];

          if (node.characters[i] === '\n') {
            commitParagraph(i);
            ps.push(`<br key="${`br${i}`}" />`);
            continue;
          }

          if (idx == null) idx = 0;
          if (idx !== currStyle) {
            commitParagraph(i);
            currStyle = idx;
          }

          para += node.characters[i];
        }
        commitParagraph('end');

        content = ps;
      } else {
        content = node.characters.split("\n").map((line, idx) => `<div key="${idx}">${line}</div>`);
      }
    }

    function printDiv(styles, outerStyle, indent) {
      print(`<div style={${JSON.stringify(outerStyle)}} className="${outerClass}">`, indent);
      print(`  <div`, indent);
      print(`    id="${node.id}"`, indent);
      print(`    style={${JSON.stringify(styles)}}`, indent);
      print(`    className="${innerClass}"`, indent);
      print(`  >`, indent);
    }
    if (parent != null) {
      printDiv(styles, outerStyle, indent);
    }

    if (node.id !== component.id && node.name.charAt(0) === '#') {
      print(`    <C${node.name.replace(/\W+/g, '')} {...this.props} nodeId="${node.id}" />`, indent);
      createComponent(node, imgMap, componentMap);
    } else if (node.type === 'VECTOR') {
      print(`    <div className="vector" dangerouslySetInnerHTML={{__html: \`${imgMap[node.id]}\`}} />`, indent);
    } else {
      const newNodeBounds = node.absoluteBoundingBox;
      const newLastVertical = newNodeBounds && newNodeBounds.y + newNodeBounds.height;
      print(`    <div>`, indent);
      let first = true;
      for (const child of minChildren) {
        visitNode(child, node, first ? null : newLastVertical, indent + '      ');
        first = false;
      }
      for (const child of centerChildren) visitNode(child, node, null, indent + '      ');
      if (maxChildren.length > 0) {
        outerClass += ' maxer';
        styles.width = '100%';
        styles.pointerEvents = 'none';
        styles.backgroundColor = null;
        printDiv(styles, outerStyle, indent + '      ');
        first = true;
        for (const child of maxChildren) {
          visitNode(child, node, first ? null : newLastVertical, indent + '          ');
          first = false;
        }
        print(`        </div>`, indent);
        print(`      </div>`, indent);
      }
      if (content != null) {
        if (node.name.charAt(0) === '$') {
          const varName = node.name.substring(1);
          print(`      {this.props[${varName}] && this.props[${varName}].split("\\n").map((line, idx) => <div key={idx}>{line}</div>)}`, indent);
          print(`      {!this.props[${varName}] && (<div>`, indent);
          for (const piece of content) {
            print(piece, indent + '        ');
          }
          print(`      </div>)}`, indent);
        } else {
          for (const piece of content) {
            print(piece, indent + '      ');
          }
        }
      }
      print(`    </div>`, indent);
    }

    if (parent != null) {
      print(`  </div>`, indent);
      print(`</div>`, indent);
    }
  }

  visitNode(component, null, null, '  ');
  print('    );', '');
  print('  }', '');
  print('}', '');
  componentMap[component.id] = {instance, name, doc};
}

export { createComponent, colorString };



