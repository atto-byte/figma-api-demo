import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { MasterLoboloRack1, MasterLoboloRack2 } from './figmaComponents';
const Page: React.SFC = () => {
  return(
    <div>
      <MasterLoboloRack2 />

    </div>
  )
}


ReactDOM.render(<Page/>,document.body);
registerServiceWorker();
