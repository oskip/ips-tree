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

    function updateStateData(data) {
        bus.emit(Events.stateChanged, data);
    }

    bus.on(Events.nodeSelected, function (nodeId) {
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
            case States.nodeDataEdit:
                changeCurrentState(States.nodeEdit, nodeId);
                break;
        }
    });

    bus.on(Events.nodeUnselected, function () {
        changeCurrentState(States.noSelection);
    });

    bus.on(Events.dataUpdated, function () {
        changeCurrentState(States.noSelection);
    });

    bus.on(Events.enterLinkingMode, function (activeNode) {
        linkedFromNodeId = activeNode._index;
        changeCurrentState(States.linkingMode, activeNode);
    });

    bus.on(Events.escapePressed, function () {
        // Quit linking mode
        if (currentState === States.linkingMode) {
            linkedFromNodeId = null;
            changeCurrentState(States.noSelection);
        }
        // Quit data edit mode
        if (currentState === States.nodeDataEdit) {
            changeCurrentState(States.noSelection);
        }
    });

    bus.on(Events.enterEditNodeDataMode, function (activeNode) {
        if (!activeNode)
            console.error("No node selected when entering " + States.nodeDataEdit + " mode");
        else if (currentState !== States.nodeEdit)
            console.error("Trying to enter node data edit mode in illegal " + currentState + " state");
        else
            changeCurrentState(States.nodeDataEdit, activeNode._index);
    });

    this.getCurrentState = function () {
        return currentState;
    }

}
