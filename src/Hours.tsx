import * as React from 'react';
import { useClockContext } from './ClockContext';
import Hour from './Hour';

interface HoursProps {
    w: number;
    h: number;
}

const Hours = (props: HoursProps) => {

    const { radius, canvasSize } = useClockContext();

    return <>
        <circle cx={canvasSize.w / 2} cy={canvasSize.h / 2} r={radius} fill='white' />
        {Array(12).fill(1).map((v, i) => <Hour key={i} curr={i} n={12} ww={5} l={0.18} stroke='#ccc'/>)}
        {Array(60).fill(1).map((v, i) => <Hour key={i} curr={i} n={60} ww={1} l={0.12} stroke='#ccc' />)}
    </>
}
export default Hours;