//Movies service used to communicate Movies REST endpoints
(function () {
    'use strict';
    var mov = angular
        .module('movies');

    mov.factory('MoviesService', MoviesService);
    MoviesService.$inject = ['$resource'];

    function MoviesService($resource) {
        return $resource('api/movies/:movieId', {
            movieId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
})();
