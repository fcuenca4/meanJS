(function () {
    'use strict';

    angular
        .module('movies')
        .controller('MoviesListController', MoviesListController);

    MoviesListController.$inject = ['MoviesService'];
    function MoviesListController(MoviesService) {
        var vm = this;
        vm.movies = MoviesService.query();
    }
})();
