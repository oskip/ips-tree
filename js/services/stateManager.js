/**
 * Created by Oskar on 2015-10-27.
 */
angular.module('graphEditor')
    .service('stateManager', StateManager);

function StateManager(bus, data) {
    var currentState = States.noSelection;
    var linkedFromNodeId;

    function changeCurrentState(state, data) {
        if (States.hasOwnProperty(state)) {
            currentState = state;
            bus.emit(Events.stateChanged, data);
        }
    }

    bus.on(Events.nodeSelected, function(nodeId) {
        switch (currentState) {
            // Add new edge to node
            case States.linkingMode:
                data.addEdge(linkedFromNodeId, nodeId);
                changeCurrentState(States.noSelection);
                break;
            case States.noSelection:
                changeCurrentState(States.nodeEdit, nodeId);
                break;
            case States.nodeEdit:
                updateStateData(nodeId);
                break;
        }
    });

    bus.on(Events.nodeUnselected, function() {
        changeCurrentState(States.noSelection);
    });

    bus.on(Events.dataUpdated, function() {
        changeCurrentState(States.noSelection);
    });

    bus.on(Events.enterLinkingMode, function(activeNode) {
        linkedFromNodeId = activeNode._index;
        changeCurrentState(States.linkingMode, activeNode);
    });

    bus.on(Events.escapePressed, function() {
        // Quit linking mode
        if (currentState === States.linkingMode) {
            linkedFromNodeId = null;
            changeCurrentState(States.noSelection);
        }
    });

    function updateStateData(data) {
        bus.emit(Events.stateChanged, data);
    }

    this.getCurrentState = function() {
        return currentState;
    }

}
