// IncomeExpenseChart.tsx
import * as d3 from "d3";
import { useEffect, useRef } from "react";

interface DataPoint {
  month: string;
  income: number;
  expense: number;
}

interface Props {
  data: DataPoint[];
}

export default function IncomeExpenseChart({ data }: Props) {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data.length) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const margin = { top: 30, right: 30, bottom: 50, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const g = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const parseMonth = d3.timeParse("%Y-%m-%d");

    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => parseMonth(d.month)) as [Date, Date])
      .range([0, width]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => Math.max(d.income, d.expense)) || 1000])
      .nice()
      .range([height, 0]);

    const xAxis = d3
      .axisBottom<Date>(x)
      .tickFormat((d) => d3.timeFormat("%b %Y")(d as Date));
    const yAxis = d3.axisLeft(y);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    g.append("g").call(yAxis);

    const incomeLine = d3
      .line<DataPoint>()
      .x((d) => x(parseMonth(d.month) as Date))
      .y((d) => y(d.income))
      .curve(d3.curveMonotoneX);

    const expenseLine = d3
      .line<DataPoint>()
      .x((d) => x(parseMonth(d.month) as Date))
      .y((d) => y(d.expense))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(data)
      .attr("fill", "black")
      .attr("stroke", "#007bff")
      .attr("stroke-width", 3)
      .attr("d", incomeLine);

    g.append("path")
      .datum(data)
      .attr("fill", "black")
      .attr("stroke", "#dc3545")
      .attr("stroke-width", 3)
      .attr("d", expenseLine);

    // Add legend
    svg.append("circle").attr("cx", 50).attr("cy", 20).attr("r", 5).style("fill", "#007bff");
    svg.append("text").attr("x", 60).attr("y", 25).text("Income").style("font-size", "12px");

    svg.append("circle").attr("cx", 150).attr("cy", 20).attr("r", 5).style("fill", "#dc3545");
    svg.append("text").attr("x", 160).attr("y", 25).text("Expense").style("font-size", "12px");
  }, [data]);

  return <svg ref={ref}></svg>;
}
