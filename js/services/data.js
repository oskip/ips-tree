/**
 * Created by Oskar on 2015-10-22.
 */
angular.module("graphEditor")
    .service("data", DataService);

function DataService(bus) {
    var data = {};

    bus.on(Events.dataLoaded, function (loadedData) {
        data = loadedData;
    });

    this.deleteNode = function (index) {
        //TODO: Sprawdzanie czy jest
        delete data.nodes[index];
        // Delete edges adjacent to node
        _.without(data.edges, function (edge) {
            return edge.v === index || edge.w === index;
        });
        bus.emit(Events.dataUpdated, data);
    };

    this.getNode = function (index) {
        //TODO: Sprawdzanie czy jest
        return data.nodes[index];
    };

    this.addNode = function () {
        var key = "new_" + newHash(10);
        data.nodes[key] = {name: "Nowy stan"};
        bus.emit(Events.dataUpdated, data);
        return key;
    };

    this.addEdge = function (v, w) {
        var key = "new_" + newHash(10);
        data.edges[key] = {
            v: v,
            w: w
        };
        bus.emit(Events.dataUpdated, data);
        return key;
    }
}