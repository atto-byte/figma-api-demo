import * as React from 'react';
import { getComponentFromId } from '../figmaComponents';

export class CLoboloRack3 extends React.PureComponent<any> {
  state = {};

  render() {
    const Component = getComponentFromId(this.props.nodeId);
    return <Component {...this.props} {...this.state} />;
  }
}
