/**
 * Created by Oskar on 2015-10-27.
 */
angular.module('graphEditor')
    .controller('GraphCtrl', GraphController);

function GraphController($scope, bus, stateManager) {
    var graph = d3.dataGraph();
    var container = angular.element(document.getElementById("graph-editor"));

    $scope.linkingMode = function () {
        return stateManager.getCurrentState() === States.linkingMode;
    };

    // Pass events to Angular's bus
    container.on(Events.nodeSelected, function (evData) {
        bus.emit(Events.nodeSelected, evData.detail);
    });

    container.on(Events.nodeUnselected, function () {
        bus.emit(Events.nodeUnselected);
    });

    document.onkeyup = (function(evData) {
        if (evData.keyCode !== 27) return; //ESC
        bus.emit(Events.escapePressed, {});
    });

    // Pass events from Angular's bus
    bus.on(Events.dataLoaded, function (data) {
        graph.setData(data);
    });

    bus.on(Events.dataUpdated, function (data) {
        graph.setData(data);
    });

    bus.on(Events.highlightEdge, function(edgeIndex) {
        graph.unHighlightEdges();
        graph.highlightEdge(edgeIndex);
    });

    bus.on(Events.unhighlightEdges, function() {
        graph.unHighlightEdges();
    });

    // Manage state changes
    bus.on(Events.stateChanged, function (stateData) {
        switch (stateManager.getCurrentState()) {
            case States.nodeEdit:
                graph.selectNode(stateData);
                break;

            case States.noSelection:
                graph.unselectNode();
                setZoomAndSelect(true);
                break;

            case States.linkingMode:
                var rect = graph.getRectOfNode(stateData._index);
                if (rect) {
                    $scope.arrowStartX = rect.left + (rect.right - rect.left) / 2;
                    $scope.arrowStartY = rect.top + (rect.bottom - rect.top) / 2;
                }
                else {
                    //TODO: Obsługa błędu
                }
                setZoomAndSelect(false);
                break;
        }
        if (!$scope.$$phase) $scope.$apply();
    });

    function setZoomAndSelect(value) {
        graph.setSelectingNodes(value);
        graph.setZoom(value);
    }
}