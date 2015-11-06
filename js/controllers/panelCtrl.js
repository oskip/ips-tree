/**
 * Created by Oskar on 2015-10-22.
 */
angular.module("graphEditor")
    .controller("PanelCtrl", PanelCtrl);

function PanelCtrl($scope, data, bus, stateManager) {
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

            case States.nodeDataEdit:
                $scope.activeNode = data.getNode(stateData);
                $scope.activeNode._index = stateData;
                break;
        }
        if (!$scope.$$phase) $scope.$apply()
    });

    $scope.activeNode = {};
    $scope.activeNodeEdges = {};

    $scope.inEditMode = function () {
        return stateManager.getCurrentState() === States.nodeEdit;
    };
    $scope.inEditNodeDataMode = function () {
        return stateManager.getCurrentState() === States.nodeDataEdit;
    };
    $scope.linkingMode = function () {
        return stateManager.getCurrentState() === States.linkingMode;
    };

    $scope.deleteNode = function () {
        data.deleteNode($scope.activeNode._index);
    };

    $scope.addNode = function () {
        data.addNode();
    };

    $scope.deleteEdge = function (edgeIndex) {
        data.deleteEdge(edgeIndex);
    };

    $scope.enterLinkingMode = function () {
        if (!$scope.activeNode) {
            console.error("Trying to start linking mode with no node selected");
            return;
        }
        bus.emit(Events.enterLinkingMode, $scope.activeNode);
    };

    $scope.editNodeData = function () {
        if (!$scope.activeNode || !$scope.inEditMode())
            console.error("Trying to edit node data with no node selected");
        //TODO: Sprawdź czy są zmiany wiszące i wyświetl potwierdzenie
        else
            bus.emit(Events.enterEditNodeDataMode, $scope.activeNode);
    };

    $scope.highlightEdge = function (edgeIndex) {
        bus.emit(Events.highlightEdge, edgeIndex);
    };

    $scope.unhighlightEdges = function () {
        bus.emit(Events.unhighlightEdges);
    };

    $scope.isUndoAvaliable = function () {
        return data.hasHistory();
    };

    $scope.undo = function () {
        data.undoLastChange();
    };

    /*
     Private methods
     */
    function getAdjacentEdgesInfo(node) {
        var edges = data.getEdgesAdjacentToNode(node._index);
        edges.forEach(function (edge) {
            edge.v = data.getNode(edge.v);
            edge.w = data.getNode(edge.w);
        });
        $scope.activeNodeEdges = edges;
    }
}