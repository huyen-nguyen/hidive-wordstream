d3.json("data/data.json", function (error, data) {
    console.log(data)
    wordstream(svg, data, config)
});