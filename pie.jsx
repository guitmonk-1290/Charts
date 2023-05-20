import React, { useState } from 'react'
import {
    select,
    pie,
    arc,
    scaleOrdinal,
    schemeCategory10,
    json,
} from "d3"

export default class Pie extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        var svg = d3.select('#pie');
        const width = svg.attr('width');
        const height = svg.attr('height');

        // dollors 
        const numberFormat = number =>
            (Math.abs(Number(number))) + " $";

        const csvUrl =
            'https://gist.githubusercontent.com/guitmonk-1290/a570c6b354b4c8e487e236464c73d98b/raw/e2424ddc6a71a9ca536f48b130d4511bf1d33502/json_data.json';

        fetch(csvUrl).then(response => response.json()).then((data) => {
            let topic = 'oil';

            let _pieData = [];
            let i = 0;

            let pestles = ["Economic", "Environmental", "Healthcare", "Industries", "Political", "Social", "Technological"];
            let nPestles = 7;

            data.map(d => {
                if (d.topic === topic) {
                    _pieData[d.pestle] = (_pieData[d.pestle] == null ? 0 : _pieData[d.pestle] + 1);
                }
            })
            console.log(_pieData);
            pestles.map(d => {
                data[i].pieValue = '' + _pieData[d];
                data[i].piePestle = d;
                i++;
            })
            const DATA = data.slice(0, i);
            console.log(DATA)
            var data_ready = pie().sort(null).value(d => d.pieValue)(DATA)
            console.log(data_ready)

            const colors = scaleOrdinal(schemeCategory10);
            const segments = arc()
                .innerRadius(0)
                .outerRadius(100)
                .padAngle(0)
                .padRadius(0);

            const sections = svg.append("g")
                .attr("transform", `translate(170,140)`)
                .selectAll("path").data(data_ready);
            sections.enter().append("path").attr("d", segments)
                .attr("fill", d => colors(d.data.pieValue))
                .on("mouseover", d => console.log(d.data.pieValue));
            //piechart is created 
            const legends = svg.append("g")
                .attr("transform", "translate(420,10)")
                .selectAll(".legends").data(data_ready);
            const legend = legends.enter().append("g").classed(".legends", true)
                .attr("transform", (d, i) => {
                    return `translate(0,${(i + 1) * 30})`;
                });

            // list of each country as labels and its styles

            legend.append("rect").attr("width", 22).attr("height", 25)
                .attr("fill", d => colors(d.data.pieValue));
            legend.append("text")
                .attr("x", 28)
                .attr("y", 18)
                .attr("class", "legend_text")
                .text(d => d.data.piePestle);
            legend.append("text")
                .attr("x", 260)
                .attr("y", 20)
                .attr("class", "legend_value")
        })

    }

    render() {
        return (
            <svg id="pie" width="900" height="400"></svg>
        )
    }
}
