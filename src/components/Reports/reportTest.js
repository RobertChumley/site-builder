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
    },
    renderScatterWithRegression(controls){

        d3.select(controls.item_id || ".report").select("svg").remove();
        var margin = {top: 5, right: 5, bottom: 20, left: 30},
            width = 450 - margin.left - margin.right,
            height = 450 - margin.top - margin.bottom;

        var svg = d3.select(controls.item_id || ".report").append("svg:svg")
            .attr("width",+controls.width)
            .attr("height",+controls.height)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scaleLinear()
            .range([0,width]);

        var y = d3.scaleLinear()
            .range([height,0]);

        var xAxis = d3.axisBottom()
            .scale(x);

        var yAxis = d3.axisLeft()
            .scale(y);


        var data = create_data(1000);

        data.forEach(function(d) {
            d.x = +d.x;
            d.y = +d.y;
            d.name = +d.yhat;
        });
        y.domain(d3.extent(data, function(d){ return d.y}));
        x.domain(d3.extent(data, function(d){ return d.x}));

        // see below for an explanation of the calcLinear function
        let minX = d3.min(data, function(d){ return d.x});
        let maxX = d3.max(data, function(d){ return d.x});
        let minY = d3.min(data, function(d){ return d.y});
        var lg = calcLinear(data, "x", "y", minX, minY);
        console.log("lg",lg,"minx",minX,"miny",minY,"maxX",maxX);


        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        svg.selectAll(".point")
            .data(data)
            .enter().append("circle")
            .attr("class", "point")
            .attr("r", 2)
            .attr("cy", function(d){ return y(d.y); })
            .attr("cx", function(d){ return x(d.x); });

        /*

         */


        svg.append("line")
            .attr("class", "regression")
            .attr("x1", x(lg.ptA.x))
            .attr("y1", y(lg.ptA.y))
            .attr("x2", x(maxX))
            .attr("y2", y((maxX * lg.m)));


        function types(d){
            d.x = +d.x;
            d.y = +d.y;

            return d;
        }

        // Calculate a linear regression from the data

        // Takes 5 parameters:
        // (1) Your data
        // (2) The column of data plotted on your x-axis
        // (3) The column of data plotted on your y-axis
        // (4) The minimum value of your x-axis
        // (5) The minimum value of your y-axis

        // Returns an object with two points, where each point is an object with an x and y coordinate

        function calcLinear(data, x, y, minX, minY){
            /////////
            //SLOPE//
            /////////

            // Let n = the number of data points
            var n = data.length;

            // Get just the points
            var pts = [];
            data.forEach(function(d,i){
                var obj = {};
                obj.x = d[x];
                obj.y = d[y];
                obj.mult = obj.x*obj.y;
                pts.push(obj);
            });

            // Let a equal n times the summation of all x-values multiplied by their corresponding y-values
            // Let b equal the sum of all x-values times the sum of all y-values
            // Let c equal n times the sum of all squared x-values
            // Let d equal the squared sum of all x-values
            var sum = 0;
            var xSum = 0;
            var ySum = 0;
            var sumSq = 0;
            pts.forEach(function(pt){
                sum = sum + pt.mult;
                xSum = xSum + pt.x;
                ySum = ySum + pt.y;
                sumSq = sumSq + (pt.x * pt.x);
            });

            let my_a = ((ySum * sumSq) - (xSum*sum)) / ((n * sumSq) - (xSum * xSum));
            let my_m = ((n * sum) - (xSum * ySum)) / ((n * sumSq) - (xSum * xSum));

            // Print the equation below the chart
            document.getElementsByClassName("equation")[0].innerHTML = "y = " + my_m + "x + " + my_a;
            document.getElementsByClassName("equation")[1].innerHTML = "x = ( y - " + my_a + " ) / " + my_m;

            // return an object of two points
            // each point is an object with an x and y coordinate
            return {
                ptA : {
                    x: 0,
                    y: my_a
                },
                ptB : {
                    y: minY,
                    x: (minY - my_a) / my_m
                },
                m: my_m
            }
        }

        function create_data(nsamples) {
            var x = [];
            var y = [];
            var n = nsamples;
            var x_mean = 50;
            var y_mean = 50;
            var term1 = 0;
            var term2 = 0;
            var noise_factor = 100;
            var noise = 0;
            // create x and y values
            for (var i = 0; i < n; i++) {
                noise = noise_factor * Math.random();
                noise *= Math.round(Math.random()) == 1 ? 1 : -1;
                y.push(i / 5 + noise);
                x.push(i + 1);
                x_mean += x[i]
                y_mean += y[i]
            }
            // calculate mean x and y
            x_mean /= n;
            y_mean /= n;

            // calculate coefficients
            var xr = 0;
            var yr = 0;
            for (i = 0; i < x.length; i++) {
                xr = x[i] - x_mean;
                yr = y[i] - y_mean;
                term1 += xr * yr;
                term2 += xr * xr;

            }
            var b1 = term1 / term2;
            var b0 = y_mean - (b1 * x_mean);
            // perform regression

            let yhat = [];
            // fit line using coeffs
            for (i = 0; i < x.length; i++) {
                yhat.push(b0 + (x[i] * b1));
            }

            var data = [];
            for (i = 0; i < y.length; i++) {
                data.push({
                    "yhat": yhat[i],
                    "y": y[i],
                    "x": x[i]
                })
            }
            return (data);
        }
    }
};