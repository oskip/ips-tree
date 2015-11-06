/**
 * Created by Oskar on 2015-11-06.
 */
angular.module("graphEditor")
    .controller("NodeDataCtrl", NodeDataCtrl);

// Child of panelCtrl, toggled with ng-if when in "nodeDataEdit" state
function NodeDataCtrl($scope, data, bus, stateManager) {
    $scope.$watch('$parent.activeNode', function() {
        $scope.node = angular.copy($scope.$parent.activeNode);
    });

    $scope.save = function() {
        data.updateNode($scope.node, $scope.node._index);
    };

    $scope.cancel = function() {
        bus.emit(Events.cancelNodeDataEdit, $scope.node._index);
    }
}