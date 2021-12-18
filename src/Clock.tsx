import React, { useEffect } from "react";
import { useState } from "react";
import { useClockContext } from "./ClockContext";
import Hand from "./Hand";
import Hours from "./Hours";
import Svg, { ViewBox } from "./Svg";

const viewBox: ViewBox = {
    minX: 0,
    minY: 0,
    width: 800,
    height: 800
};

const Clock = () => {

    const { canvasSize, radius } = useClockContext();

    const [h, setH] = useState(0);
    const [m, setM] = useState(0);
    const [s, setS] = useState(0);

    // useEffect(() => {
    //     const i = setInterval(() => {
    //         step(0);
    //     }, 15);
    //     return () => clearInterval(i);
    // }, [])

    const step = (timestamp: number) => {
        const d = new Date();
        setH((d.getHours() % 12 + (d.getMinutes() / 60)) * 10)
        setM(d.getMinutes() * 60 + d.getSeconds())
        setS(d.getSeconds() * 1000 + d.getMilliseconds())
    }

    useEffect(() => {
        window.requestAnimationFrame(step)
    }, [s])

    return <Svg viewBox={viewBox} w={400} h={400}>
        <Hours w={700} h={700} />
        <Hand n={120} curr={h} width={23} length={0.6} hang={0.1} color="#666" />
        <Hand n={3600} curr={m} width={15} length={0.95} hang={0.18} color="#666" />
        <Hand n={60000} curr={s} width={9} length={1} hang={0.2} color="#900" />
        {/* <circle cx={canvasSize.w / 2} cy={canvasSize.h / 2} r={radius * 0.04} fill='#900' style={{ filter: 'drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.4))' }} /> */}
    </Svg>
}

export default Clock;