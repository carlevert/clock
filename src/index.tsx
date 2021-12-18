import React from 'react';
import ReactDOM from 'react-dom';
import Clock from './Clock';
import { ClockContextProvider } from './ClockContext';
import './default.css';
import Hours from './Hours';
import Svg, { ViewBox } from './Svg';


ReactDOM.render(<div className='container'>
    <ClockContextProvider>
        <Clock />
    </ClockContextProvider>
</div>, document.getElementById('app'));