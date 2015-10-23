/**
 * Created by Oskar on 2015-10-22.
 */

d3 = d3 || {};

d3.dataGraph = function () {
    var data = {};

    var svg = d3.select("svg"), inner = svg.select("g"),
    // Zoom support
        zoom = d3.behavior.zoom().on("zoom", function () {
            inner.attr("transform", "translate(" + d3.event.translate + ")" +
                "scale(" + d3.event.scale + ")");
        });
    svg.call(zoom);

    // Graph setup
    var render = new dagreD3.render();
    var graph = new dagreD3.graphlib.Graph({multigraph: true});
    graph.setGraph({
        rankdir: 'lr'
    });
    graph.graph().transition = function(selection) {
        return selection.transition().duration(500);
    };

    var selectedElementId;

    function updateGraph() {
        if (!graph) return;
        // Deleting nodes not in data
        graph.nodes().forEach(function (index) {
            if (!data.nodes.hasOwnProperty(index)) {
                graph.removeNode(index);
                console.log("deleting node " + index + " form graph");
            }
        });

        // Deleting edges not in data
        graph.edges().forEach(function (edge) {
            if (!data.edges.hasOwnProperty(edge.name)) {
                graph.removeEdge(edge);
                console.log("deleting edge " + edge.name + " from graph");
            }
        });
    }

    function draw() {
        // Add or update nodes
        for (var index in data.nodes) {
            if (data.nodes.hasOwnProperty(index)) {
                var node = data.nodes[index];

                var html = "<div class=\"node-body\" data-id=\"" + index + "\">";
                html += "<span class=\"title\">" + node.name + "</span>";
                html += "</div>";

                graph.setNode(index, {
                    rx: 4,
                    ry: 4,
                    labelType: "html",
                    label: html
                });
            }
        }

        // Add or update edges
        for (var index in data.edges) {
            if (data.edges.hasOwnProperty(index)) {
                var edge = data.edges[index];

                if (graph.hasNode(edge.v) && graph.hasNode(edge.w)) {
                    graph.setEdge(edge.v, edge.w, {
                        width: 40,
                        lineInterpolate: 'basis'
                    }, index);
                }
            }
        }
        // Remove edges and nodes not in data
        updateGraph();

        inner.call(render, graph);
        appendEvents();
    }

    function appendEvents() {
        svg.selectAll(".node")
            .on("click", function (id) {
                if (selectedElementId === id)
                    unselectNode(true);
                else
                    selectNode(id);
            });
    }

    function selectNode(id) {
        selectedElementId = id;
        // Fade in and fade out
        svg.selectAll(".node")
            .each(function (elId) {
                if (id != elId) {
                    d3.select(this)
                        .transition()
                        .duration(300)
                        .style("opacity", 0.1);
                }
                else {
                    d3.select(this)
                        .transition()
                        .duration(300)
                        .style("opacity", 1);
                }
            });
        // Emit event
        document.getElementById("graph-editor").dispatchEvent(
            new CustomEvent(Events.nodeSelected, {"detail": id})
        );
    }

    function unselectNode(dispatch) {
        selectedElementId = null;

        svg.selectAll(".node")
            .each(function () {
                d3.select(this)
                    .transition()
                    .duration(300)
                    .style("opacity", 1);
            });
        if (dispatch) {
            // Emit event
            document.getElementById("graph-editor").dispatchEvent(
                new CustomEvent(Events.nodeUnselected, {})
            );
        }
    }

    var dataGraph = {};

    dataGraph.setData = function (d) {
        data = d;
        draw();
        // No node selected after redraw
        selectedElementId = null;
        return dataGraph;
    };

    // Called from outside, don't dispatch
    dataGraph.unselectNode = function() {
        unselectNode(false);
    };

    return dataGraph;
};