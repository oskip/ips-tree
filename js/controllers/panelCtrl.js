/**
 * Created by Oskar on 2015-10-22.
 */
angular.module("graphEditor")
    .controller("PanelCtrl", PanelCtrl);

function PanelCtrl($scope, data, bus) {
    $scope.editMode = false;

    bus.on(Events.nodeSelected, function (id) {
        activateNode(id);
        $scope.$apply();
    });

    bus.on(Events.nodeUnselected, function() {
        deactivateNode();
        $scope.$apply();
    });

    $scope.deleteNode = function () {
        data.deleteNode($scope.activeNode.id);
        deactivateNode();
    };

    var activateNode = function (id) {
        $scope.activeNode = data.getNode(id);
        $scope.activeNode.id = id;
        $scope.editMode = true;
    }

    var deactivateNode = function() {
        $scope.editMode = false;
        $scope.activeNode = {};
    }
}