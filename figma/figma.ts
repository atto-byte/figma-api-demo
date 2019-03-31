import { visitNode } from './utils/visitNode';
import * as fs from 'fs';
import { ComponentMap, Document } from './types';



export const generateComponentSrc = (name: string) => {
  return(`
import * as React from 'react';
import { getComponentFromId } from '../figmaComponents';

export const ${name}: React.SFC<any> = (props) => {
  const [state, setState] = React.useState({})
  const Component = getComponentFromId(props.nodeId);
  return <Component {...props} {...state} />;
}`)
}
export const saveComponent = (path: string,name: string, componentSrc: string) => {
  fs.writeFile(path, componentSrc, (err) => {
    if (err) {
      console.error(`Error Saving ${name} Component`);
      console.log(err);
    }
    console.log(`Saved ${name} Component @ ${path}`);
  });
}

export const createComponentInstance = (component: Document, parent: Document | null, vectorMap, masterComponentsMap: ComponentMap) => {
  const name = 'C' + component.name.replace(/\W+/g, '');
  generateUserComponent(name);
  const instance = name + component.id.replace(';', 'S').replace(':', 'D');

  let componentStr = '';
  componentStr+= `const ${instance}: React.SFC<any> = (props) => {\n`
  componentStr+= `  return(\n`
  componentStr+= `    <div>\n`
  componentStr += visitNode(vectorMap, masterComponentsMap, component, parent, null, 2);
  componentStr+= `    </div>\n`
  componentStr+= '  );\n'
  componentStr+= '}\n'
  masterComponentsMap[component.id] = {instance, name, componentStr};
  return masterComponentsMap
}




function generateUserComponent(name: string) {
  const path = `src/components/${name}.tsx`;
  const fileExists = fs.existsSync(path);
  let componentSrc: string;
  if (!fileExists) {
    componentSrc = generateComponentSrc(name);
    saveComponent(path, name, componentSrc);
  }
}

