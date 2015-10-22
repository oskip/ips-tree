/**
 * Created by Oskar on 2015-10-22.
 */
angular.module("graphEditor")
    .directive("graph", GraphDirective);

function GraphDirective(bus) {
    return {
        restrict: 'E',
        replace: true,
        link: function(scope, element) {
            var graph = d3.dataGraph();
            var container = angular.element(document.getElementById("graph-editor"));

            // Pass events to Angular's bus
            container.on(Events.nodeSelected, function(data) {
                bus.emit(Events.nodeSelected, data.detail);
            });

            container.on(Events.nodeUnselected, function(data) {
                bus.emit(Events.nodeUnselected);
            });

            // Pass events from Angular's bus
            bus.on(Events.dataLoaded, function(data) {
                graph.setData(data);
            });

            bus.on(Events.dataUpdated, function(data) {
                graph.setData(data);
            });

            bus.on(Events.unselectNode, function() {
                graph.unselectNode();
            })
        }

    }
}