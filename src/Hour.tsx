import * as React from 'react';
import { useClockContext } from './ClockContext';
import Line from './Line';

interface HourProps {
    n: number;
    curr: number;
    ww: number;
    l: number;
    stroke: string
}

const Hour = (props: HourProps) => {

    const { radius, canvasSize } = useClockContext();

    const dx = (canvasSize.w - radius * 2) / 2;
    const dy = (canvasSize.w - radius * 2) / 2;

    let offset = 10;
    const a = (props.curr / props.n) * (Math.PI * 2);
    const r = radius - offset;

    const x1 = Math.cos(a) * r * (1 - props.l) + r + offset + dx;
    const y1 = Math.sin(a) * r * (1 - props.l) + r + offset + dy;

    const x2 = Math.cos(a) * r + r + offset + dx;
    const y2 = Math.sin(a) * r + r + offset + dy;

    return <Line x1={x1} y1={y1} x2={x2} y2={y2} width={props.ww} stroke={props.stroke} />
}

export default Hour;