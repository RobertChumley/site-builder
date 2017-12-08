let d3 = require('d3');

let d3tooltip = require('d3-tooltip');

var tooltip = d3tooltip(d3)

/*
age,population
<5,2704659
5-13,4499890
14-17,2159981
18-24,3853788
25-44,14106543
45-64,8819342
≥65,612463
 */
module.exports = {
    render: function (controls) {

        d3.select(controls.item_id || ".report").select("svg").remove();
        var svg = d3.select(controls.item_id || ".report").append("svg:svg").attr("width",+controls.width).attr("height",+controls.height),
            width = +svg.attr("width"),
            height = +svg.attr("height"),
            radius = Math.min(width, height) / 2,
            g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var color = d3.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

        var pie = d3.pie()
            .sort(null)
            .value(function(d) { return +d[controls.params["numeric_field"]]; });

        var path = d3.arc()
            .outerRadius(radius - 10)
            .innerRadius(0);

        var label = d3.arc()
            .outerRadius(radius - 40)
            .innerRadius(radius - 40);

        var arc = g.selectAll(".arc")
            .data(pie(controls.data))
            .enter().append("g")
            .attr("class", "arc");

        arc.append("path")
            .attr("d", path)
            .attr("fill", function (d) {
                return color(d.data[controls.params["label_field"]]);
            });

        arc.append("text")
            .attr("transform", function (d) {
                return "translate(" + label.centroid(d) + ")";
            })
            .attr("dy", "0.35em")
            .text(function (d) {
                return d.data[controls.params["label_field"]];
            }).on("mouseover", function(d) {
                var html = "<div class='tooltip-inner'><label>" +
                    controls.params["label_field"] +": </label> " +
                    d.data[controls.params["label_field"]] + "<br/><label>" +
                    controls.params["numeric_field"] +": </label> " +
                    d.data[controls.params["numeric_field"]] + "</div>";
                tooltip.html(html)
                tooltip.show()
            }).on("mouseout", function(d) {
                tooltip.html('');
                tooltip.hide();
            });
    },renderHistogram: function(controls){

        d3.select(controls.item_id || ".report").select("svg").remove();


        var data = d3.range(1000).map(d3.randomBates(10));

        var formatCount = d3.format(",.0f");

        var svg = d3.select(controls.item_id || ".report").append("svg:svg").attr("width",+controls.width).attr("height",+controls.height),
            margin = {top: 10, right: 30, bottom: 30, left: 30},
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom,
            g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        var x = d3.scaleLinear()
            .rangeRound([0, width]);

        var bins = d3.histogram()
            .domain(x.domain())
            .thresholds(x.ticks(20))
            (data);

        var y = d3.scaleLinear()
            .domain([0, d3.max(bins, function(d) { return d.length; })])
            .range([height, 0]);

        var bar = g.selectAll(".bar")
            .data(bins)
            .enter().append("g")
            .attr("class", "bar")
            .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });

        bar.append("rect")
            .attr("x", 1)
            .attr("width", x(bins[0].x1) - x(bins[0].x0) - 1)
            .attr("height", function(d) { return height - y(d.length); });

        bar.append("text")
            .attr("dy", ".75em")
            .attr("y", 6)
            .attr("x", (x(bins[0].x1) - x(bins[0].x0)) / 2)
            .attr("text-anchor", "middle")
            .text(function(d) { return formatCount(d.length); });

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
    }
}