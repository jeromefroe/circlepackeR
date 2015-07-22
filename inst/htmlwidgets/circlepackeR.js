HTMLWidgets.widget({

  name: 'circlepackeR',

  type: 'output',

  initialize: function(el, width, height) {

    return {

    }

  },

  renderValue: function(el, params, instance) {

    var w = 650,
        h = 565,
        r = 500,
        x = d3.scale.linear().range([0, r]),
        y = d3.scale.linear().range([0, r]),
        node,
        root;

    var pack = d3.layout.pack()
        .size([r, r])
        .value(function(d) { return d.size; });

    var vis = d3.select(el).insert("svg:svg", "h2")
        .attr("width", w)
        .attr("height", h)
        .append("svg:g")
        .attr("transform", "translate(" + (w - r) / 2 + "," + (h - r) / 2 + ")");

    function update(data) {
        node = root = data;

        var nodes = pack.nodes(root);

        vis.selectAll("circle")
            .data(nodes)
            .enter().append("svg:circle")
            .attr("class", function(d) { return d.children ? "parent" : "child"; })
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .attr("r", function(d) { return d.r; })
            .on("click", function(d) { return zoom(node == d ? root : d); });

        vis.selectAll("text")
            .data(nodes)
            .enter().append("svg:text")
            .attr("class", function(d) { return d.children ? "parent" : "child"; })
            .attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y; })
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .style("opacity", function(d) { return d.r > 20 ? 1 : 0; })
            .text(function(d) {
                return d.name;
            });

        d3.select(window).on("click", function() { zoom(root); });
    }


    function zoom(d, i) {
        var k = r / d.r / 2;
        x.domain([d.x - d.r, d.x + d.r]);
        y.domain([d.y - d.r, d.y + d.r]);

        var t = vis.transition()
            .duration(d3.event.altKey ? 7500 : 750);

        t.selectAll("circle")
            .attr("cx", function(d) { return x(d.x);  })
            .attr("cy", function(d) { return y(d.y);  })
            .attr("r", function(d)  { return k * d.r; });

        // updateCounter is a hacky way to determine when transition is finished
        var updateCounter = 0;

        t.selectAll("text")
            .style("opacity", 0)
            .attr("x", function(d) { return x(d.x); })
            .attr("y", function(d) { return y(d.y); })
            .each(function(d, i) {
                updateCounter++;
            })
            .each("end", function(d, i) {
                updateCounter--;
                if (updateCounter == 0) {
                    adjustLabels(k);
                }
            });

        node = d;
        d3.event.stopPropagation();
    }


    function adjustLabels(k) {
        vis.selectAll("text")
            .style("opacity", function(d) {
                return k * d.r > 20 ? 1 : 0;
            })
            .text(function(d) {
                return d.name;
            })
            .filter(function(d) {
                d.tw = this.getComputedTextLength();
                return (Math.PI*(k*d.r)/2) < d.tw;
            })
            .each(function(d) {
                var proposedLabel = d.name;
                var proposedLabelArray = proposedLabel.split('');
                while ((d.tw > (Math.PI*(k*d.r)/2) && proposedLabelArray.length)) {
                    // pull out 3 chars at a time to speed things up (one at a time is too slow)
                    proposedLabelArray.pop();proposedLabelArray.pop(); proposedLabelArray.pop();
                    if (proposedLabelArray.length===0) {
                        proposedLabel = "";
                    } else {
                        proposedLabel = proposedLabelArray.join('') + "..."; // manually truncate with ellipsis
                    }
                    d3.select(this).text(proposedLabel);
                    d.tw = this.getComputedTextLength();
                }
            });
    }

    var data = params.data;

    update(data);

  },

  resize: function(el, width, height, instance) {

  }

});
