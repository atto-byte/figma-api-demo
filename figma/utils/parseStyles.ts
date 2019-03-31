import { Document } from './../types';
import { parseBackground, parseEffects, getPaint, colorString } from './parsers';

export const parseRectangleStyles = (node: Document, styles: React.CSSProperties) => {
  styles = parseBackground(node, styles);
  styles = parseEffects(node, styles);

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
  return styles
}

