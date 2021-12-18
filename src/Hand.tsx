import * as React from 'react';
import { useClockContext } from './ClockContext';
import Line from './Line';

interface HandProps {
    n: number;
    curr: number;
    width: number;
    length: number;
    color: string;
    hang: number;
}

const Hand = (props: HandProps) => {

    const { radius, canvasSize } = useClockContext();

    const dx = (canvasSize.w - radius * 2) / 2;
    const dy = (canvasSize.w - radius * 2) / 2;

    let offset = 10;

    const a = (props.curr / props.n) * (Math.PI * 2) - Math.PI / 2;

    const r = radius - offset;

    const x1 = canvasSize.w / 2 - Math.cos(a) * r * props.hang;
    const y1 = canvasSize.h / 2 - Math.sin(a) * r * props.hang;

    const x2 = Math.cos(a) * r * props.length + r + offset + dx;
    const y2 = Math.sin(a) * r * props.length + r + offset + dy;

    return <Line x1={x1} y1={y1} x2={x2} y2={y2} width={props.width} stroke={props.color} shadow={true} />
}

export default Hand;