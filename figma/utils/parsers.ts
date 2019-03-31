import { TypeStyle, Pattern, Document, Paint } from './../types';
import { TextAlignHorizontal } from "../types";
import { TextAlignProperty } from "csstype";

export function colorString(color) {
  return `rgba(${Math.round(color.r*255)}, ${Math.round(color.g*255)}, ${Math.round(color.b*255)}, ${color.a})`;
}

export function dropShadow(effect) {
  return `${effect.offset.x}px ${effect.offset.y}px ${effect.radius}px ${colorString(effect.color)}`;
}

export function innerShadow(effect) {
  return `inset ${effect.offset.x}px ${effect.offset.y}px ${effect.radius}px ${colorString(effect.color)}`;
}

export function imageURL(hash) {
  const squash = hash.split('-').join('');
  return `url(./images/${hash}.png)`;
}

export const genTextAlign = (textAlignHorizontal: TextAlignHorizontal): TextAlignProperty => {
  if(!textAlignHorizontal) return 'center'
  switch (textAlignHorizontal) {
    case TextAlignHorizontal.Center:
      return "center"
    case TextAlignHorizontal.Left:
      return "left"
    case TextAlignHorizontal.Right:
      return "right" 
    case TextAlignHorizontal.Justified:
      return "center"
    default:
      return "center"
  }
}
export const applyFontStyle = (_styles: React.CSSProperties, fontStyle: TypeStyle): React.CSSProperties => {
  if (fontStyle) {
    _styles.fontSize = fontStyle.fontSize;
    _styles.fontWeight = fontStyle.fontWeight;
    _styles.fontFamily = fontStyle.fontFamily;
    _styles.textAlign = genTextAlign(fontStyle.textAlignHorizontal);
    _styles.fontStyle = fontStyle.italic ? 'italic' : 'normal';
    _styles.lineHeight = `${fontStyle.lineHeightPercent * 1.25}%`;
    _styles.letterSpacing = `${fontStyle.letterSpacing}px`;
  }
  return _styles
}
export function backgroundSize(scaleMode) {
  if (scaleMode === 'FILL') {
    return 'cover';
  } else {
    return 'contain'
  }
}

export function nodeSort(a, b) {
  if (a.absoluteBoundingBox.y < b.absoluteBoundingBox.y) return -1;
  else if (a.absoluteBoundingBox.y === b.absoluteBoundingBox.y) return 0;
  else return 1;
}

export function getPaint(paintList: Paint[]) {
  if (paintList && paintList.length > 0) {
    return paintList[paintList.length - 1];
  }

  return null;
}

export function paintToLinearGradient(paint) {
  const handles = paint.gradientHandlePositions;
  const handle0 = handles[0];
  const handle1 = handles[1];

  const yDiff = handle1.y - handle0.y;
  const xDiff = handle0.x - handle1.x;

  const angle = Math.atan2(-xDiff, -yDiff);
  const stops = paint.gradientStops.map((stop) => {
    return `${colorString(stop.color)} ${Math.round(stop.position * 100)}%`;
  }).join(', ');
  return `linear-gradient(${angle}rad, ${stops})`;
}

export function paintToRadialGradient(paint) {
  const stops = paint.gradientStops.map((stop) => {
    return `${colorString(stop.color)} ${Math.round(stop.position * 60)}%`;
  }).join(', ');

  return `radial-gradient(${stops})`;
}

export function parseEffects(node: Document, styles: React.CSSProperties) {
  if (node.effects) {
    for (let i = 0; i < node.effects.length; i++) {
      const effect = node.effects[i];
      if (effect.type === 'DROP_SHADOW') {
        styles.boxShadow = dropShadow(effect);
      }
      else if (effect.type === 'INNER_SHADOW') {
        styles.boxShadow = innerShadow(effect);
      }
      else if (effect.type === 'LAYER_BLUR') {
        styles.filter = `blur(${effect.radius}px)`;
      }
    }
  }
  return styles
}

export function parseBackground(node: Document, styles: React.CSSProperties) {
  const lastFill = getPaint(node.fills);
  if (lastFill) {
    if (lastFill.type === 'SOLID') {
      styles.backgroundColor = colorString(lastFill.color);
      styles.opacity = lastFill.opacity;
    }
    else if (lastFill.type === 'IMAGE') {
      styles.backgroundImage = imageURL(lastFill.imageRef);
      styles.backgroundSize = backgroundSize(lastFill.scaleMode);
    }
    else if (lastFill.type === 'GRADIENT_LINEAR') {
      styles.background = paintToLinearGradient(lastFill);
    }
    else if (lastFill.type === 'GRADIENT_RADIAL') {
      styles.background = paintToRadialGradient(lastFill);
    }
  }
  return styles
}
export function parseBounds(parent,outerClass,outerStyle, cHorizontal, cVertical, bounds, styles){
  if (bounds != null){
    switch (cHorizontal) {
      case 'LEFT_RIGHT':
        outerClass += ' h_left_right';
        styles.marginLeft = bounds.left;
        styles.marginRight = bounds.right;
        styles.width = bounds.width;
        styles.minWidth = bounds.width;
        styles.flexGrow = 1;
        break;

      case 'RIGHT':
      outerClass += ' h_right';
        styles.marginRight = bounds.right;
        styles.marginLeft = 'auto';
        styles.width = bounds.width;
        styles.minWidth = bounds.width;
        break;
      case 'LEFT':
        outerClass += ' h_left';
        styles.marginLeft = bounds.left;
        styles.marginRight = 'auto';
        styles.width = bounds.width;
        styles.minWidth = bounds.width;
        break;
      case 'CENTER':
        outerClass += ' h_center';
        styles.width = bounds.width;
        styles.marginLeft = 'auto';
        styles.marginRight = 'auto';
        break;
      case 'SCALE':
        outerClass += ' h_scale';
        const parentWidth = bounds.left + bounds.width + bounds.right;
        styles.width = `${bounds.width*100/parentWidth}%`;
        styles.marginLeft = `${bounds.left*100/parentWidth}%`;
        break;
    
      default:
        outerClass += ' h_default';
        styles.marginLeft = bounds.left;
        styles.width = bounds.width;
        styles.minWidth = bounds.width;
        break;
    }

    switch (cVertical) {
      case 'TOP_BOTTOM':
        outerClass += ' v_top_bottom';
        styles.marginTop = bounds.top;
        styles.marginBottom = bounds.bottom;
        break;
        
        case 'BOTTOM':
        outerClass += ' v_bottom';
        outerStyle.justifyContent = 'flex-end';
        styles.marginTop = 'auto';
        styles.height = bounds.height;
        styles.marginBottom = bounds.bottom;
        styles.minHeight = bounds.height;
        break;
        
        case 'CENTER':
        outerClass += ' v_center';
        outerStyle.alignItems = 'center';
        styles.margin = 'auto'
        break;
        
        case 'TOP':
        outerClass += ' v_top';
        styles.marginTop = bounds.top;
        outerStyle.justifyContent = 'center';
        styles.height = bounds.height;
        styles.marginBottom = 'auto';
        break;
        
        case 'SCALE':
        outerClass += ' v_scale';
        const parentHeight = bounds.top + bounds.height + bounds.bottom;
        styles.height = `${bounds.height*100/parentHeight}%`;
        styles.top = `${bounds.top*100/parentHeight}%`;
        break;
        
        default:
        outerClass += ' v_default';
        styles.marginTop = bounds.top;
        styles.marginBottom = bounds.bottom;
        styles.minHeight = styles.height;
        styles.height = null;
        break;
    }
  }
  return {styles, outerClass, outerStyle}
}

export function parseText(node: Document, styles: React.CSSProperties){
  let content;
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

  // TODO Does this do anything
  
  styles = applyFontStyle(styles, fontStyle);

  if (node.name.substring(0, 6) === 'input:') {
    content = [`<input key="${node.id}" type="text" placeholder="${node.characters}" name="${node.name.substring(7)}" />`];
  } else if (node.characterStyleOverrides) {
    let para = '';
    const ps = [];
    const styleCache = {};
    let currStyle = 0;

    const commitParagraph = (key: string) => {
      if (para !== '') {
        if (styleCache[currStyle] == null && currStyle !== 0) {
          styleCache[currStyle] = {};
          styleCache[currStyle] = applyFontStyle(styleCache[currStyle], node.styleOverrideTable[currStyle]);
        }

        const styleOverride = styleCache[currStyle] ? JSON.stringify(styleCache[currStyle]) : '{}';
        if(styleOverride)
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
    content = node.characters.split("\n").map((line: any, idx: any) => `<div key="${idx}">${line}</div>`);
  }
  return {content, styles}
}