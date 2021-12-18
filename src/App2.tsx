import * as React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import Line from './Line';
import Svg, { ViewBox } from './Svg';

const App = () => {

    const viewBox: ViewBox = {
        minX: 0,
        minY: 0,
        width: 800,
        height: 600
    };

    const [running, setRunning] = useState(true);
    const [count, setCount] = useState(0);
    const [start, setStart] = useState(0);

    const [coords, setCoords] = useState({
        x1: 0,
        y1: 0,
        x2: viewBox.width,
        y2: viewBox.height
    })

    const step = (timestamp: number) => {
        const c = { ...coords, y1: coords.y1 + 1, y2: coords.y2 - 1 }
        setCoords(c)
        setCount(count + 1);
    }

    useEffect(() => {
        window.requestAnimationFrame(step)
    }, [coords])

    useEffect(() => {
        setStart(Date.now())
    }, [])

    return <>
        <Svg viewBox={viewBox} w={800} h={800}>
            <Line x1={coords.x1} y1={coords.y1} x2={coords.x2} y2={coords.y2} />
        </Svg>
    </>

}
export default App;