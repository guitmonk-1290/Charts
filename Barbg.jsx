import React, { useState, useCallback, useEffect } from 'react';
import { ReactDOM } from 'react';
import { csv, arc, pie, scaleBand, scaleLinear, max, format } from 'd3';
import { AxisBottom } from './AxisBottom';
import { AxisLeft } from './AxisLeft';
import { Marks } from './Marks';

const width = 2500;
const height = 2000;
const margin = { top: 20, right: 30, bottom: 65, left: 220 };
const xAxisLabelOffset = 50;

const Barbg = () => {
    const [data, setData] = useState([]);

    const url = "https://gist.githubusercontent.com/guitmonk-1290/a570c6b354b4c8e487e236464c73d98b/raw/e2424ddc6a71a9ca536f48b130d4511bf1d33502/json_data.json";
    fetch(url).then(response => response.json()).then(data => setData(data))
    console.log("Bar data: ", data);

    if (!data) {
        return <pre>Loading...</pre>;
    }

    const innerHeight = height - margin.top - margin.bottom;
    const innerWidth = width - margin.left - margin.right - 1800;

    const yValue = d => d.topic;
    const xValue = d => d.relevance;

    const siFormat = format('.2s');
    const xAxisTickFormat = tickValue => siFormat(tickValue).replace('G', 'B');

    const yScale = scaleBand()
        .domain(data.map(yValue))
        .range([0, innerHeight])
        .paddingInner(0.2);

    const xScale = scaleLinear()
        .domain([0, max(data, xValue)])
        .range([0, innerWidth]);

    return (
        <svg width={width} height={height} viewBox="45 700 2500 500">
            <g transform={`translate(${margin.left},${margin.top})`}>
                <AxisBottom
                    xScale={xScale}
                    innerHeight={innerHeight}
                    tickFormat={xAxisTickFormat}
                />
                <AxisLeft yScale={yScale} />
                <text
                    className="axis-label"
                    x={innerWidth / 2}
                    y={innerHeight + xAxisLabelOffset}
                    textAnchor="middle"
                >
                    Relevance
                </text>
                <Marks
                    data={data}
                    xScale={xScale}
                    yScale={yScale}
                    xValue={xValue}
                    yValue={yValue}
                    tooltipFormat={xAxisTickFormat}
                />
            </g>
        </svg>
    );
};

export default Barbg;
