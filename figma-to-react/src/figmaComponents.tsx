import * as React from 'react';
import { CCard } from './components/CCard';
import { CCardCopy } from './components/CCardCopy';

export class MasterCard extends React.PureComponent<any> {
  render() {
    return <div className="master" style={{backgroundColor: "rgba(0, 0, 0, 0)"}}>
      <CCard {...this.props} nodeId="85:461" />
    </div>
  }
}

export class MasterCardCopy extends React.PureComponent<any> {
  render() {
    return <div className="master" style={{backgroundColor: "rgba(0, 0, 0, 0)"}}>
      <CCardCopy {...this.props} nodeId="85:466" />
    </div>
  }
}

export function getComponentFromId(id) {
  if (id === "85:461") return CCard85D461;
  if (id === "85:466") return CCardCopy85D466;
  return null;
}

class CCard85D461 extends React.PureComponent<any> {
  render() {
    return (
      <div>
        <div style={{"zIndex":1}} className="outerDiv">
          <div
            id="85:457"
            style={{"marginLeft":7,"width":243,"minWidth":243,"height":null,"marginTop":43,"marginBottom":227,"minHeight":55}}
            className="innerDiv"
          >
            <div className="vector" dangerouslySetInnerHTML={{__html: `<svg preserveAspectRatio="none" width="259" height="71" viewBox="0 0 259 71" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d)">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8 8C8 5.23857 10.2386 3 13 3H246C248.761 3 251 5.23858 251 8V53C251 55.7614 248.761 58 246 58H13C10.2386 58 8 55.7614 8 53V8Z" fill="url(#paint0_linear)" fill-opacity="0.898039"/>
</g>
<defs>
<filter id="filter0_d" x="0" y="0" width="259" height="71" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
<feOffset dy="5"/>
<feGaussianBlur stdDeviation="4"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
</filter>
<linearGradient id="paint0_linear" x1="251" y1="30.5" x2="8" y2="30.5" gradientUnits="userSpaceOnUse">
<stop offset="0.132597" stop-color="#4A4540" stop-opacity="0.8"/>
<stop offset="1" stop-color="#2A2520"/>
</linearGradient>
</defs>
</svg>
`}} />
          </div>
        </div>
        <div style={{"zIndex":2}} className="outerDiv">
          <div
            id="85:458"
            style={{"marginLeft":61,"width":185,"minWidth":185,"height":null,"marginTop":-267,"marginBottom":243.93548393249512,"minHeight":23.064516067504883,"color":"rgba(255, 255, 255, 1)","fontSize":30,"fontWeight":400,"fontFamily":"Roboto","textAlign":"center","fontStyle":"normal","lineHeight":"142.22222222222223%","letterSpacing":"0px"}}
            className="innerDiv"
          >
            <div>
              {this.props.name && this.props.name.split("\n").map((line, idx) => <div key={idx}>{line}</div>)}
              {!this.props.name && (<div>
                <span style={{}} key="end">Active Trips</span>
              </div>)}
            </div>
          </div>
        </div>
        <div style={{"zIndex":3}} className="outerDiv">
          <div
            id="93:4"
            style={{"marginLeft":19,"width":39,"minWidth":39,"height":null,"marginTop":-265,"marginBottom":244,"minHeight":21}}
            className="innerDiv"
          >
            <div className="vector" dangerouslySetInnerHTML={{__html: `<svg preserveAspectRatio="none" width="39" height="21" viewBox="0 0 39 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M39 3.5C39 5.425 37.4045 7 35.4545 7C35.1355 7 34.8341 6.965 34.5505 6.8775L28.2395 13.09C28.3282 13.37 28.3636 13.685 28.3636 14C28.3636 15.925 26.7682 17.5 24.8182 17.5C22.8682 17.5 21.2727 15.925 21.2727 14C21.2727 13.685 21.3082 13.37 21.3968 13.09L16.8764 8.6275C16.5927 8.715 16.2736 8.75 15.9545 8.75C15.6355 8.75 15.3164 8.715 15.0327 8.6275L6.96682 16.6075C7.05545 16.8875 7.09091 17.185 7.09091 17.5C7.09091 19.425 5.49545 21 3.54545 21C1.59545 21 0 19.425 0 17.5C0 15.575 1.59545 14 3.54545 14C3.86455 14 4.16591 14.035 4.44955 14.1225L12.5332 6.16C12.4445 5.88 12.4091 5.565 12.4091 5.25C12.4091 3.325 14.0045 1.75 15.9545 1.75C17.9045 1.75 19.5 3.325 19.5 5.25C19.5 5.565 19.4645 5.88 19.3759 6.16L23.8964 10.6225C24.18 10.535 24.4991 10.5 24.8182 10.5C25.1373 10.5 25.4564 10.535 25.74 10.6225L32.0332 4.3925C31.9445 4.1125 31.9091 3.815 31.9091 3.5C31.9091 1.575 33.5045 0 35.4545 0C37.4045 0 39 1.575 39 3.5Z" fill="white"/>
</svg>
`}} />
          </div>
        </div>
        <div style={{}} className="outerDiv centerer">
          <div
            id="85:460"
            style={{"marginLeft":0,"marginRight":0,"flexGrow":1,"marginTop":68,"marginBottom":-2,"backgroundColor":"rgba(255, 255, 255, 1)","boxShadow":"0px 2px 6px rgba(0, 0, 0, 0.3686274509803922)","borderRadius":"5px 5px 5px 5px"}}
            className="innerDiv"
          >
            <div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class CCardCopy85D466 extends React.PureComponent<any> {
  render() {
    return (
      <div>
        <div style={{"zIndex":1}} className="outerDiv">
          <div
            id="I85:466;85:457"
            style={{"marginLeft":7,"width":243,"minWidth":243,"height":null,"marginTop":43,"marginBottom":234.76791381835938,"minHeight":55}}
            className="innerDiv"
          >
            <div className="vector" dangerouslySetInnerHTML={{__html: `<svg preserveAspectRatio="none" width="259" height="71" viewBox="0 0 259 71" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d)">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8 8C8 5.23857 10.2386 3 13 3H246C248.761 3 251 5.23858 251 8V53C251 55.7614 248.761 58 246 58H13C10.2386 58 8 55.7614 8 53V8Z" fill="url(#paint0_linear)" fill-opacity="0.898039"/>
</g>
<defs>
<filter id="filter0_d" x="0" y="0" width="259" height="71" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
<feOffset dy="5"/>
<feGaussianBlur stdDeviation="4"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
</filter>
<linearGradient id="paint0_linear" x1="251" y1="30.5" x2="8" y2="30.5" gradientUnits="userSpaceOnUse">
<stop offset="0.132597" stop-color="#4A4540" stop-opacity="0.8"/>
<stop offset="1" stop-color="#2A2520"/>
</linearGradient>
</defs>
</svg>
`}} />
          </div>
        </div>
        <div style={{"zIndex":2}} className="outerDiv">
          <div
            id="I85:466;85:458"
            style={{"marginLeft":61,"width":185,"minWidth":185,"height":null,"marginTop":-274.7679138183594,"marginBottom":251.7033977508545,"minHeight":23.064516067504883,"color":"rgba(255, 255, 255, 1)","fontSize":30,"fontWeight":400,"fontFamily":"Roboto","textAlign":"center","fontStyle":"normal","lineHeight":"142.22222222222223%","letterSpacing":"0px"}}
            className="innerDiv"
          >
            <div>
              {this.props.name && this.props.name.split("\n").map((line, idx) => <div key={idx}>{line}</div>)}
              {!this.props.name && (<div>
                <span style={{}} key="end">Active Trips</span>
              </div>)}
            </div>
          </div>
        </div>
        <div style={{"zIndex":3}} className="outerDiv">
          <div
            id="I85:466;93:4"
            style={{"marginLeft":19,"width":39,"minWidth":39,"height":null,"marginTop":-272.7679138183594,"marginBottom":251.76791381835938,"minHeight":21}}
            className="innerDiv"
          >
            <div className="vector" dangerouslySetInnerHTML={{__html: `<svg preserveAspectRatio="none" width="39" height="21" viewBox="0 0 39 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M39 3.5C39 5.425 37.4045 7 35.4545 7C35.1355 7 34.8341 6.965 34.5505 6.8775L28.2395 13.09C28.3282 13.37 28.3636 13.685 28.3636 14C28.3636 15.925 26.7682 17.5 24.8182 17.5C22.8682 17.5 21.2727 15.925 21.2727 14C21.2727 13.685 21.3082 13.37 21.3968 13.09L16.8764 8.6275C16.5927 8.715 16.2736 8.75 15.9545 8.75C15.6355 8.75 15.3164 8.715 15.0327 8.6275L6.96682 16.6075C7.05545 16.8875 7.09091 17.185 7.09091 17.5C7.09091 19.425 5.49545 21 3.54545 21C1.59545 21 0 19.425 0 17.5C0 15.575 1.59545 14 3.54545 14C3.86455 14 4.16591 14.035 4.44955 14.1225L12.5332 6.16C12.4445 5.88 12.4091 5.565 12.4091 5.25C12.4091 3.325 14.0045 1.75 15.9545 1.75C17.9045 1.75 19.5 3.325 19.5 5.25C19.5 5.565 19.4645 5.88 19.3759 6.16L23.8964 10.6225C24.18 10.535 24.4991 10.5 24.8182 10.5C25.1373 10.5 25.4564 10.535 25.74 10.6225L32.0332 4.3925C31.9445 4.1125 31.9091 3.815 31.9091 3.5C31.9091 1.575 33.5045 0 35.4545 0C37.4045 0 39 1.575 39 3.5Z" fill="white"/>
</svg>
`}} />
          </div>
        </div>
        <div style={{}} className="outerDiv centerer">
          <div
            id="I85:466;85:460"
            style={{"marginLeft":0,"marginRight":0.3624267578125,"flexGrow":1,"marginTop":68,"marginBottom":-2.232086181640625,"backgroundColor":"rgba(255, 255, 255, 1)","boxShadow":"0px 2px 6px rgba(0, 0, 0, 0.3686274509803922)","borderRadius":"5px 5px 5px 5px"}}
            className="innerDiv"
          >
            <div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

