(function () {
    'use strict';

    var underscore = angular.module('underscore', []);
    underscore.factory('_', function() {
        return window._; // assumes underscore has already been loaded on the page
    });

    angular.module('demoApp', ['ui.tree', 'underscore', 'hljs'])
        .controller('MainCtrl', function ($scope, _) {
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
                scope.abstract_source = source(scope.abstract);
                scope.concrete = build_concrete(scope.abstract);

                try{
                    var a = eval('('+ scope.code_abstract + ')');
                    scope.ok_abstract = true;
                    scope.error = undefined;
                }catch (ex){
                    scope.error = ex.message;
                    scope.ok_abstract = false;
                }

            });

            var templateConcrete = _.template('{\n\
    name: "<%= concrete.name %>",\n\
    head: [ ],\n\
    maps: [\n\
    <% _.each(concrete.maps, function(map){ if(map.name) { %>\
        { name: "<%= map.name %>" },\n\
    <% }}); %>\
    ]\n\
}');

            var build_concrete = function(abstract){
                var concrete = {
                    name : abstract.name,
                    maps: [

                    ]
                };

                var insideTree = function(item){
                    if(!_.some(concrete.maps, function(i){ return i.name == item.name; })){
                        concrete.maps.push({
                            name: item.name
                        });
                    }
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

            $scope.podeRemover = function(scope){
                return scope.$parentNodeScope != null;
            };

            $scope.adicionarOnEnter = function(scope, event){
                if(event.which === 13) {
                    if(event.shiftKey){
                        scope.newSubItem(scope);
                    } else {
                        if(scope.$parentNodeScope) {
                            scope.newSubItem(scope.$parentNodeScope);
                        } else {
                            $scope.abstract.widgets.push({
                                name: ""
                            })
                        }
                    }
                }

            };

            $scope.focarNome = function(scope, $element){
                scope.$element.find('input')[0].focus();
            };

            $scope.newSubItem = function (scope) {
                var nodeData = scope.$modelValue;
                nodeData.children = nodeData.children || [];
                nodeData.children.push({
                    name: ""
                });
            };

            $scope.exibirMontador = function(scope){
                $scope.textarea = false;
                $scope.build = true;
            };

            $scope.exibirTextarea = function(scope){
                $scope.textarea = true;
            };

            $scope.limpar = function(scope){
                if(scope.$modelValue.when == ""){
                    delete scope.$modelValue.when;
                }
                if(scope.$modelValue.datasource == ""){
                    delete scope.$modelValue.datasource;
                }
            };

            $scope.carregar = function(scope){
                try{
                    $scope.abstract = eval('('+ scope.code_abstract + ')');

                    $scope.textarea = false;
                    $scope.build = true;
                }catch (ex){

                }

            };
        });



})();