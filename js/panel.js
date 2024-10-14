window.onresize = updateWindowSize;
panelForUpdate()

function visualize(){
    d3.select("#mainSVG").selectAll("*").remove()
    wordstream(svg, restructured, config);
}

function panelForUpdate() {
    const vis_container = document.getElementById('vis-container');
    const distanceFromTop = vis_container.offsetTop;

    d3.select("#floating-box").style("top", distanceFromTop + "px")
    const panel1 = d3.select("#floating-box")
    panel1.append("div0")
        .attr("class", "mb-3")
        .html('<h5>Control Panel</h5>')

    const div1 = panel1.append("div").attr("class", "mb-3 pt-2"), div2 = panel1.append("div").attr("class", "mb-3"),
        div3 = panel1.append("div").attr("class", "mb-3")

    div1.append("text")
        .html("Minimum font-size: ");

    div1
        .append("input")
        .style("width", "50px")
        .attr("id", "minFontValue")
        .attr("type", "number")
        .attr("value", config.minFont)
        .attr("step", "1")
        .on("change", function () {
            config.minFont = this.value;
            visualize()
        });

    div2.append("text")
        .html("Maximum font-size: ");

    div2
        .append("input")
        .style("width", "50px")
        .attr("id", "maxFontValue")
        .attr("type", "number")
        .attr("value", config.maxFont)
        .attr("step", "1")
        .on("change", function () {
            config.maxFont = this.value;
            visualize()
        });

    div3.append("text")
        .html("Top # words: ");

    div3
        .append("input")
        .style("width", "50px")
        .attr("id", "topWordValue")
        .attr("type", "number")
        .attr("value", config.topWord)
        .attr("step", "5")
        .on("change", function () {
            config.topWord = this.value;
            visualize()
        });


    // width and height
    const div4 = panel1.append("div").attr("class", "mb-3"), div5 = panel1.append("div").attr("class", "mb-3")

    div4.append("text")
        .html("Canvas width: ");

    div4
        .append("input")
        .style("width", "80px")
        .attr("id", "widthValue")
        .attr("type", "number")
        .attr("value", +svg.attr("width"))
        .attr("step", "50")
        .on("change", function () {
            svg.attr("width", this.value)
            visualize()
        });

    div4.append("text")
        .html(" px");

    div5.append("text")
        .html("Canvas height: ");

    div5
        .append("input")
        .style("width", "80px")
        .attr("id", "heightValue")
        .attr("type", "number")
        .attr("value", +svg.attr("height"))
        .attr("step", "50")
        .on("change", function () {
            svg.attr("height", this.value)
            visualize()
        });

    div5.append("text")
        .html(" px");

    // background
    const div6 = panel1.append("div").attr("class", "mb-3 check-bg")

    div6.append("input")
        .attr("id", "backgroundCheck")
        .attr("type", "checkbox")
        .attr("value", "background")
        .attr("checked", true)
        .on("change", function () {
            d3.selectAll('.curve')
                .attr('fill-opacity', this.checked ? 0.05 : 0)
        });

    div6.append("label")
        .attr("for", "background")
        .html('&nbsp;Show background')

    const div7 = panel1.append("button")
        .attr("class", "refresh-btn")
        .html("Refresh")
        .on("click", function () {
            visualize()
        });
}