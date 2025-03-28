/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

interface Expense {
  category: string;
  amount: number;
}

interface PieChartProps {
  data: Expense[];
}

export default function PieChart({ data }: PieChartProps) {
  const ref = useRef<SVGSVGElement | null>(null);
  const [size, setSize] = useState(400); // Default width

  useEffect(() => {
    if (!data.length) return;

    // Resize Observer for Dynamic Resizing
    const container = ref.current?.parentElement;
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        setSize(entry.contentRect.width); // Update size dynamically
      }
    });

    if (container) resizeObserver.observe(container);

    return () => {
      if (container) resizeObserver.unobserve(container);
    };
  }, []);

  useEffect(() => {
    if (!data.length || !ref.current) return;

    d3.select(ref.current).selectAll("*").remove(); // Clear previous chart

    const radius = size / 2;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3.pie<Expense>().value(d => d.amount);
    const arc = d3.arc<d3.PieArcDatum<Expense>>()
      .innerRadius(0)
      .outerRadius(radius * 0.9); // Adjust radius to fit

    const svg = d3.select(ref.current)
      .attr("viewBox", `0 0 ${size} ${size}`)
      .attr("width", "100%") // Responsive width
      .attr("height", "auto") // Keeps aspect ratio
      .attr("preserveAspectRatio", "xMidYMid meet")
      .append("g")
      .attr("transform", `translate(${size / 2}, ${size / 2})`);

    const slices = svg.selectAll("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("d", arc as any)
      .attr("fill", d => color(d.data.category))
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .transition()
      .duration(1000)
      .attrTween("d", function (d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function (t) {
          return arc(interpolate(t)) as string;
        };
      });

    // Labels
    svg.selectAll("text")
      .data(pie(data))
      .enter()
      .append("text")
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("font-size", `${Math.max(size / 25, 10)}px`) // Responsive font size
      .attr("fill", "#fff")
      .text(d => d.data.category);

  }, [data, size]);

  return <svg ref={ref}></svg>;
}
