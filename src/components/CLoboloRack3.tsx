
import * as React from 'react';
import { getComponentFromId } from '../figmaComponents';

export const CLoboloRack3: React.SFC<any> = (props) => {
  const [state, setState] = React.useState({})
  const Component = getComponentFromId(props.nodeId);
  return <Component {...props} {...state} />;
}