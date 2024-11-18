d3.csv("sets.csv").then(data => {

    const themeCounts = d3.rollup(
        data,
        v => v.length,
        d => d.Theme
    );

    const themeData = Array.from(themeCounts, ([name, value]) => ({ name, value }));

    // Create the Pie Chart
    const width = 1000;
    const height = 1000;
    const radius = Math.min(width, height) / 3;

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const svg = d3.select("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const pie = d3.pie()
        .value(d => d.value);

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    const arcs = svg.selectAll(".arc")
        .data(pie(themeData))
        .enter().append("g")
        .attr("class", "arc")
        .on("click", function (event, d) {
            //Onclick Event Handler when clicking a pie slice.

            //We transform previously selected slices back to normal
            svg.selectAll(".label").remove();
            d3.selectAll(".arc path")
                .transition()
                .duration(200)
                .attr("transform", "scale(1)"); 
            
            //Transform the selected slice to 130% size.
            d3.select(this).select("path")
                .transition()
                .duration(200)
                .attr("transform", "scale(1.3)"); 

            // Calculate Percentage of all LEGO Sets which are part of the selected Theme
            const total = d3.sum(themeData, d => d.value);
            const percentage = ((d.data.value / total) * 100).toFixed(1);

            // Add label with theme and percentage to the selected slice
            const [x, y] = arc.centroid(d); 
            svg.append("text")
                .attr("x", x)
                .attr("y", y)
                .attr("text-anchor", "middle")
                .attr("class", "label")
                .text(`${d.data.name}: ${percentage}%`)
                .style("font-size", "14px")
                .style("fill", "#000");
        });

    arcs.append("path")
        .attr("d", arc)
        .style("fill", d => color(d.data.name));
});
