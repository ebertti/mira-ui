(function () {
    'use strict';

    var underscore = angular.module('underscore', []);
    underscore.factory('_', function() {
        return window._; // assumes underscore has already been loaded on the page
    });

    angular.module('demoApp', ['ui.tree', 'underscore'])
        .controller('MainCtrl', function ($scope, _) {
            $scope.build = true;
            $scope.abstract = {};
            $scope.abstract.name = '';
            $scope.abstract.widgets = [
                {
                    name: ''
                }
            ];

            $scope.selectedItem = {};

            $scope.options = {};

            $scope.$watch(function(scope){
                scope.concrete = build_concrete(scope.abstract)
            });

            var templateConcrete = _.template('{\n\
    name: "<%= concrete.name %>",\n\
    head: [ ],\n\
    maps: [\n\
    <% _.each(concrete.maps, function(map){ %>\
        { name: "<%= map.name %>"},\n\
    <% }); %>\
    ]\n\
}');

            var build_concrete = function(abstract){
                var concrete = {
                    name : abstract.name,
                    maps: [

                    ]
                };

                var insideTree = function(item){
                    concrete.maps.push({
                        name: item.name
                    });
                    if(item.children){
                        _.each(item.children, insideTree);
                    }
                };

                _.each(abstract.widgets, insideTree);
                return templateConcrete({concrete:concrete});
            };

            $scope.remove = function (scope) {
                scope.remove();
            };

            $scope.toggle = function (scope) {
                scope.toggle();
            };

            $scope.newSubItem = function (scope) {
                var nodeData = scope.$modelValue;
                nodeData.children = nodeData.children || [];
                nodeData.children.push({
                    name: ""
                });
            };

            $scope.exibirMontador = function(scope){
                $scope.build = true;
            };

            $scope.exibirTextarea = function(scope){

            };
        });



})();