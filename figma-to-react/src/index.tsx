import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { CCard } from './components/CCard';

ReactDOM.render(<div style={{margin: 10,
  position: "relative",}}><CCard nodeId="85:461" name="Trips"/></div>,document.body);
registerServiceWorker();
