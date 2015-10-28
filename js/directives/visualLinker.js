/**
 * Created by Oskar on 2015-10-23.
 */
angular.module("graphEditor")
    .directive("visualLinker", VisualLinker);

function VisualLinker() {

    return {
        restrict: "A",
        replace: false,
        link: function (scope, element) {

            angular.element(element).append('<line id="linker-line" ' +
                'x1="'+scope.arrowStartX+'" ' +
                'y1="'+scope.arrowStartY+'" ' +
                'x2="'+scope.arrowStartX+'" ' +
                'y2="'+scope.arrowStartY+'" ' + //TODO: Grot strzałki
                '/>');

            // http://stackoverflow.com/questions/3642035/jquerys-append-not-working-with-svg-element
            var svgEl = document.getElementById('linker-overlay');
            angular.element(svgEl).html(angular.element(svgEl).html());

            var line = document.getElementById('linker-line');
            var editor = document.getElementById('graph-container');

            angular.element(editor).on('mousemove', function(event) {
                angular.element(line).attr('x2', event.clientX);
                angular.element(line).attr('y2', event.clientY);
            })
        }
    }
}