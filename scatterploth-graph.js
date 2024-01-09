// Fetch the dataset
fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
    .then(response => response.json())
    .then(data => {
        // Parse the dataset
        const dataset = data.map(d => ({
            year: new Date(d.Year, 0, 1),
            time: new Date(d.Seconds * 1000),
            doping: d.Doping,
            name: d.Name,
            nationality: d.Nationality
        }));

        // Create the Scatterplot Graph using D3
        const margin = { top: 20, right: 20, bottom: 60, left: 60 };
        const width = 800 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        const svg = d3
            .select("#graph")
            .append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom])
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // Responsive design
        svg
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet");

        // Add title element
        svg
            .append("text")
            .attr("id", "title")
            .attr("x", width / 2)
            .attr("y", -margin.top / 2)
            .attr("text-anchor", "middle")
            .text("Scatterplot Graph");

        // Add x-axis
        const xScale = d3
            .scaleTime()
            .domain([d3.min(dataset, d => d.year), d3.max(dataset, d => d.year)])
            .range([0, width]);

        const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y"));

        svg
            .append("g")
            .attr("id", "x-axis")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);

        // Add y-axis
        const yScale = d3
            .scaleTime()
            .domain([d3.min(dataset, d => d.time), d3.max(dataset, d => d.time)])
            .range([height, 0]);

        const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

        svg.append("g").attr("id", "y-axis").call(yAxis);

        // Add dots
        svg
            .selectAll(".dot")
            .data(dataset)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("data-xvalue", d => d.year)
            .attr("data-yvalue", d => d.time)
            .attr("cx", d => xScale(d.year))
            .attr("cy", d => yScale(d.time))
            .attr("r", 5)
            .attr("fill", "steelblue");

        // Add legend
        const legend = svg
            .append("g")
            .attr("id", "legend")
            .attr("transform", `translate(${width - 100}, ${height - 100})`);

        legend
            .append("text")
            /* .attr("x", 10)
            .attr("y", 10) */
            .text("Legend");

        // Add tooltip
        const tooltip = d3
            .select("#graph")
            .append("div")
            .attr("id", "tooltip")
            .style("opacity", 0);

        svg
            .selectAll(".dot")
            .on("mouseover", function (d) {
                let x = d3.event.pageX;
                let y = d3.event.pageY;
                tooltip
                    .style("opacity", 1)
                    .style("left", (x + 10) + "px")
                    .style("top", (y + 10) + "px")
                    .attr("data-year", d.year)
                    .html(`Year: ${d.year.getFullYear()}<br>Time: ${d.time.getMinutes()}:${d.time.getSeconds()}<br>Name: ${d.name}<br>Nationality: ${d.nationality}<br>Doping: ${d.doping}`);
            })
            .on("mouseout", () => {
                tooltip.style("opacity", 0);
            });
    });
