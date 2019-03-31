import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { MasterLoboloRack1, MasterLoboloRack2 } from './figmaComponents';
const Page: React.SFC = () => {
  return(
    <div style={{backgroundColor: 'rgb(224, 218, 186)', width: "100vw"}}>
      <div style={{maxWidth: 900, margin: 'auto', position:'relative', minHeight: '100vh'}}>
        <MasterLoboloRack2 />
      </div>
    </div>
  )
}


ReactDOM.render(<Page/>,document.body);
registerServiceWorker();
