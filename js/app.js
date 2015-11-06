/**
 * Created by Oskar on 2015-10-22.
 */
angular.module("graphEditor", []);

angular.module("graphEditor", ['ui.bootstrap', 'ngMaterial'])
    .run(function ($q, $http, bus) {
        var timeout = function (wait) {
            var q = $q.defer();
            setTimeout(function () {
                q.resolve();
            }, wait);
            return q.promise;
        };

        //TODO: do serwisu
        $http.get("data.json").success(function(data) {
            bus.emit(Events.dataLoaded, data);
        });
    })
    .constant("graphConfig", {
        "historyMax" : 30
    });

//TODO: Ochrona przed kliknięciem nieistniejącego węzła (np. szybko klikając cofnij po wielu dodaniach węzła)
//TODO: W trybie łączenia - informacja jak wyjść i jak używać
//TODO: W trybie kliknięcia węzła przycisk edytuj