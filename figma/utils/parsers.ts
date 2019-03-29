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
export function downloadImages(){
  
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

export function getPaint(paintList) {
  if (paintList && paintList.length > 0) {
    return paintList[paintList.length - 1];
  }

  return null;
}

export function paintToLinearGradient(paint) {
  const handles = paint.gradientHandlePositions;
  const handle0 = handles[0];
  const handle1 = handles[1];

  const ydiff = handle1.y - handle0.y;
  const xdiff = handle0.x - handle1.x;

  const angle = Math.atan2(-xdiff, -ydiff);
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

export function parseEffects(node: any, styles) {
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
}

export function parseRectangle(node: any, styles) {
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
}