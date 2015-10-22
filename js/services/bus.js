/**
 * Created by Oskar on 2015-10-22.
 */
angular.module("graphEditor")
    .service("bus", BusService);

function BusService() {
    this.subscribers = {};

    this.on = function(event, callback) {
        if (!this.subscribers[event])
            this.subscribers[event] = [];

        this.subscribers[event].push(callback);
        return true;
    };

    this.emit = function(event, parameters) {
        if (!this.subscribers[event])
            return false;

        this.subscribers[event].forEach(function(callback) {
            callback(parameters);
        })
        return true;
    };
}