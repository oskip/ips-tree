/**
 * Created by Oskar on 2015-10-22.
 */
"use strict";

angular.module("graphEditor")
    .service("data", DataService);

function DataService(bus, graphConfig) {
    var data = {};
    var history = [];

    bus.on(Events.dataLoaded, function (loadedData) {
        data = loadedData;
    });

    this.getNode = function (index) {
        //TODO: Sprawdzanie czy jest
        return data.nodes[index];
    };

    this.addNode = function () {
        saveToHistory();

        var key = "new_" + newHash(10);
        data.nodes[key] = {name: "Nowy stan"};
        bus.emit(Events.dataUpdated, data);
        return key;
    };

    this.deleteNode = function (index) {
        //TODO: Sprawdzanie czy jest
        saveToHistory();

        delete data.nodes[index];
        // Delete edges adjacent to node
        data.edges = _.pick(data.edges, function (edge) {
            return edge.v.toString() !== index && edge.w.toString() !== index;
        });
        bus.emit(Events.dataUpdated, data);
    };

    this.addEdge = function (v, w) {
        saveToHistory();

        var key = "new_" + newHash(10);
        data.edges[key] = {
            v: v,
            w: w
        };
        bus.emit(Events.dataUpdated, data);
        return key;
    };

    this.deleteEdge = function (edgeIndex) {
        saveToHistory();

        delete data.edges[edgeIndex];
        bus.emit(Events.dataUpdated, data);
    };

    this.getEdgesAdjacentToNode = function (index) {
        var adjacent = [];
        for (var i in data.edges) {
            var edge = data.edges[i];
            if (edge.v.toString() === index || edge.w.toString() === index) {
                adjacent.push(angular.copy(edge));
                adjacent.last()._index = i;
            }
        }
        return adjacent;
    };

    this.hasHistory = function () {
        return history.length > 0;
    };

    this.undoLastChange = function () {
        if (this.hasHistory) {
            data = history.pop();
            bus.emit(Events.dataUpdated, data);
        }
        else
            console.error("No history for undo action")
    };

    function saveToHistory() {
        if (history.length > graphConfig.historyMax) {
            console.warn("Max history stack exceeded")
            history.shift();
        }
        history.push(angular.copy(data));
    }
}