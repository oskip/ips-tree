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

            container.on(Events.nodeSelected, function(data) {
                //Obsługa tutaj lub na bus.emit
                console.log("hura, to element "+JSON.stringify(data.detail));
            });

            bus.on(Events.dataLoaded, function(data) {
                d3.dataGraph().setData(data);
            });
        }

    }
}