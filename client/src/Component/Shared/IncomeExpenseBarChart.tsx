import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface IncomeExpenseBarChartProps {
  data: { month: string; income: number; expense: number }[];
}

const IncomeExpenseBarChart = ({ data }: IncomeExpenseBarChartProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = svg.node()?.getBoundingClientRect().width || 800;
    const height = 400;

    // Margin setup for padding around the chart
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Scaling functions
    const x = d3.scaleBand()
      .domain(data.map(d => d.month))  // x-axis: months
      .range([0, chartWidth])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => Math.max(d.income, d.expense)) || 0])  // y-axis: max income/expense
      .nice()
      .range([chartHeight, 0]);

    // Append the SVG container
    svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Define the width of each bar
    const barWidth = x.bandwidth() / 2; // Make each bar thinner

    // Bars for income (blue)
    svg.selectAll(".income-bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "income-bar")
      .attr("x", d => x(d.month)!)  // Start at the beginning of the x position
      .attr("y", d => y(d.income))
      .attr("width", barWidth)
      .attr("height", d => chartHeight - y(d.income))
      .attr("fill", "blue");

    // Bars for expenses (red)
    svg.selectAll(".expense-bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "expense-bar")
      .attr("x", d => x(d.month)! + barWidth)  // Shift expense bars right by half of bar width
      .attr("y", d => y(d.expense))
      .attr("width", barWidth)
      .attr("height", d => chartHeight - y(d.expense))
      .attr("fill", "red");

    // Add x-axis
    svg.append("g")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x));

    // Add y-axis with ticks and amount range
    svg.append("g")
      .call(d3.axisLeft(y).ticks(6)) // Adjust the number of ticks
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("x", -chartHeight / 2)
      .attr("dy", ".71em")
      .attr("text-anchor", "middle")
      .text("Amount");

  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default IncomeExpenseBarChart;
