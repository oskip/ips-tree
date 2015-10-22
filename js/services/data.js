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
        bus.emit(Events.dataUpdated, data);
    };
    this.getNode = function(index) {
        //TODO: Sprawdzanie czy jest
        return data.nodes[index];
    }
}