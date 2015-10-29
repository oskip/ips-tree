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
        data.edges = _.pick(data.edges, function (edge) {
            return edge.v.toString() !== index && edge.w.toString() !== index;
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
    };

    this.getEdgesAdjacentToNode = function(index) {
        var adjacent = [];
        for (var i in data.edges) {
            var edge = data.edges[i];
            if (edge.v.toString() === index || edge.w.toString() === index) {
                adjacent.push(angular.copy(edge));
                adjacent.last()._index = i;
            }
        }
        return adjacent;
    }
}