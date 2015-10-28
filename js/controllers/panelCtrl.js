/**
 * Created by Oskar on 2015-10-22.
 */
angular.module("graphEditor")
    .controller("PanelCtrl", PanelCtrl);

function PanelCtrl($scope, data, bus, stateManager) {
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
                $scope.activeNode.id = stateData;
                break;

            case States.noSelection:
                $scope.activeNode = {};
                break;

            case States.linkingMode:
                break;
        }
        if (!$scope.$$phase) $scope.$apply()
    });

    $scope.deleteNode = function () {
        data.deleteNode($scope.activeNode.id);
    };

    $scope.addNode = function () {
        data.addNode();
    };

    $scope.enterLinkingMode = function () {
        if ($scope.activeNode)
            bus.emit(Events.enterLinkingMode, $scope.activeNode);
        else
            console.error("Próba uruchomienia trybu łączenia węzłów bez aktywnego węzła");
    };
}