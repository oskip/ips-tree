/**
 * Created by Oskar on 2015-10-22.
 */
angular.module("graphEditor")
    .controller("PanelCtrl", PanelCtrl);

function PanelCtrl($scope, data, bus) {
    $scope.editMode = false;
    $scope.linkingMode = false;
    //TODO: Tryby do enuma

    bus.on(Events.nodeSelected, function (id) {
        activateNode(id);
        //TODO: $scope.watch ?
        $scope.$apply();
    });

    bus.on(Events.nodeUnselected, function() {
        if ($scope.activeNode) {
            deactivateNode();
            $scope.$apply();
        }
    });

    $scope.deleteNode = function () {
        data.deleteNode($scope.activeNode.id);
        deactivateNode();
    };

    $scope.addNode = function () {
        data.addNode();
    };

    $scope.enterLinkingMode = function () {
        //TODO: jeżeli nie ma aktywnego elementu to wyjdź
        $scope.linkingMode = true;
        bus.emit(Events.enterLinkingMode, $scope.activeNode);
    };

    var activateNode = function (id) {
        $scope.activeNode = data.getNode(id);
        $scope.activeNode.id = id;
        $scope.editMode = true;
    };

    var deactivateNode = function() {
        $scope.editMode = false;
        $scope.activeNode = {};
    };

    var afterAnimation = function(callback) {
        setTimeout(callback, 500);
    };

    //TODO: state manager
}