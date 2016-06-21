(function () {
    'use strict';

    angular
        .module('movies')
        .config(routeConfig);

    routeConfig.$inject = ['$stateProvider'];

    function routeConfig($stateProvider) {
        $stateProvider
            .state('movies', {
                abstract: true,
                url: '/movies',
                template: '<ui-view/>'
            })
            .state('movies.calificar', {
                url: '/:movieId/calificar',
                templateUrl: 'modules/movies/client/views/calificar-movie.client.view.html',
                controller: 'MoviesController',
                controllerAs: 'vm',
                resolve: {
                    movieResolve: getMovie
                },
                data: {
                    roles: ['user', 'admin'],
                    pageTitle: 'Calificar Movie {{ movieResolve.name }}'
                }
            })
            .state('movies.list', {
                url: '',
                templateUrl: 'modules/movies/client/views/list-movies.client.view.html',
                controller: 'MoviesListController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Movies List'
                }
            })
            .state('movies.create', {
                url: '/create',
                templateUrl: 'modules/movies/client/views/form-movie.client.view.html',
                controller: 'MoviesController',
                controllerAs: 'vm',
                resolve: {
                    movieResolve: newMovie
                },
                data: {
                    roles: ['user', 'admin'],
                    pageTitle: 'Movies Create'
                }
            })
            .state('movies.edit', {
                url: '/:movieId/edit',
                templateUrl: 'modules/movies/client/views/form-movie.client.view.html',
                controller: 'MoviesController',
                controllerAs: 'vm',
                resolve: {
                    movieResolve: getMovie
                },
                data: {
                    roles: ['admin'],
                    pageTitle: 'Edit Movie {{ movieResolve.name }}'
                }
            })

            .state('movies.view', {
                url: '/:movieId',
                templateUrl: 'modules/movies/client/views/view-movie.client.view.html',
                controller: 'MoviesController',
                controllerAs: 'vm',
                resolve: {
                    movieResolve: getMovie
                },
                data: {
                    roles: ['user', 'admin'],
                    pageTitle: 'Movie {{ articleResolve.name }}'
                }
            });
    }

    getMovie.$inject = ['$stateParams', 'MoviesService'];

    function getMovie($stateParams, MoviesService) {
        return MoviesService.get({
            movieId: $stateParams.movieId
        }).$promise;
    }

    newMovie.$inject = ['MoviesService'];

    function newMovie(MoviesService) {
        return new MoviesService();
    }
})();
