/**
 * Created by Oskar on 2015-10-22.
 */
angular.module("graphEditor")
    .controller("PanelCtrl", PanelCtrl);

function PanelCtrl($scope, data, bus, stateManager) {
    $scope.activeNode = {};
    $scope.activeNodeEdges = {};

    $scope.editMode = function() {
        return stateManager.getCurrentState() === States.nodeEdit;
    };
    $scope.linkingMode = function() {
        return stateManager.getCurrentState() === States.linkingMode;
    };

    bus.on(Events.stateChanged, function (stateData) {
        switch (stateManager.getCurrentState()) {
            case States.nodeEdit:
                $scope.activeNode = data.getNode(stateData);
                $scope.activeNode._index = stateData;
                getAdjacentEdgesInfo($scope.activeNode);
                break;

            case States.noSelection:
                $scope.activeNode = {};
                $scope.activeNodeEdges = {};
                break;

            case States.linkingMode:
                break;
        }
        if (!$scope.$$phase) $scope.$apply()
    });

    $scope.deleteNode = function () {
        data.deleteNode($scope.activeNode._index);
    };

    $scope.addNode = function () {
        data.addNode();
    };

    $scope.deleteEdge = function(edgeIndex) {
      data.deleteEdge(edgeIndex);
    };

    $scope.enterLinkingMode = function () {
        if ($scope.activeNode)
            bus.emit(Events.enterLinkingMode, $scope.activeNode);
        else
            console.error("Trying to start linking mode with no node selected");
    };

    $scope.highlightEdge = function(edgeIndex) {
        bus.emit(Events.highlightEdge, edgeIndex);
    };

    $scope.unhighlightEdges = function() {
        bus.emit(Events.unhighlightEdges);
    };

    function getAdjacentEdgesInfo(node) {
        var edges = data.getEdgesAdjacentToNode(node._index);
        edges.forEach(function(edge) {
            edge.v = data.getNode(edge.v);
            edge.w = data.getNode(edge.w);
        });
        $scope.activeNodeEdges = edges;
    }

    $scope.undoAvaliable = function() {
        return data.hasHistory();
    };

    $scope.undo = function() {
        data.undoLastChange();
    }
}