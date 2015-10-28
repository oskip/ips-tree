/**
 * Created by Oskar on 2015-10-27.
 */
angular.module('graphEditor')
    .controller('GraphCtrl', GraphController);

function GraphController($scope, bus, data) {
    var graph = d3.dataGraph();
    var container = angular.element(document.getElementById("graph-editor"));
    $scope.linkingMode = false;
    $scope.linkedFromNodeId = undefined;

    // Pass events to Angular's bus
    container.on(Events.nodeSelected, function (evData) {
        if ($scope.linkingMode) {
            graph.setZoom(true);
            graph.setSelectingNodes(true);
            graph.unselectNode();

            data.addEdge($scope.linkedFromNodeId, evData.detail);
            $scope.linkingMode = false;
        }
        else bus.emit(Events.nodeSelected, evData.detail);
    });

    container.on(Events.nodeUnselected, function (data) {
        bus.emit(Events.nodeUnselected);
    });

    // Pass events from Angular's bus
    bus.on(Events.dataLoaded, function (data) {
        graph.setData(data);
    });

    bus.on(Events.dataUpdated, function (data) {
        graph.setData(data);
    });

    bus.on(Events.unselectNode, function () {
        graph.unselectNode();
    });

    bus.on(Events.selectNode, function (id) {
        graph.selectNode(id);
    });

    // Showing linker svg on event
    bus.on(Events.enterLinkingMode, function(node) {
        var rect = graph.getXYofNode(node.id);
        if (rect) {
            $scope.arrowStartX = rect.left + (rect.right - rect.left) / 2;
            $scope.arrowStartY = rect.top + (rect.bottom - rect.top) / 2;
        }
        else {
            //TODO: Obsługa błędu
        }
        graph.setSelectingNodes(false);
        graph.setZoom(false);
        $scope.linkingMode = true;
        $scope.linkedFromNodeId = node.id;
    });
}