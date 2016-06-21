(function () {
    'use strict';
    // Movies controller
    angular
        .module('movies')
        .controller('MoviesController', MoviesController)

        .directive('starRating', starRating);

    MoviesController.$inject = ['$scope', '$state', 'Authentication', 'movieResolve', '$http'];

    function MoviesController($scope, $state, Authentication, movie, $http) {
        var vm = this;
        vm.authentication = Authentication;
        vm.movie = movie;
        vm.error = null;
        vm.form = {};
        vm.remove = remove;
        vm.save = save;
        $scope.$watch('search', function () {
            fetch();
        });
        $scope.select = function () {
            this.setSelectionRange(0, this.value.length);
        };

        vm.load = function () {
            if (vm.movie._id !== undefined)
                $http({
                    method: 'GET',
                    url: './api/movies/relacionadas/' + vm.movie._id
                }).then(function successCallback(response) {
                    $scope.relacionadas = response.data;
                    console.log($scope.relacionadas);
                }, function errorCallback(response) {
                    console.log("error al obetener relacionadas");
                });
        };
        this.load();

        function fetch() {
            if ($scope.search !== undefined) {
                $http.get("http://www.omdbapi.com/?t=" + $scope.search + "&tomatoes=true&plot=full")
                    .then(function (response) {
                        $scope.details = response.data;
                        vm.movie.name = response.data.Title;
                        vm.movie.sinopsis = response.data.Plot;
                        vm.movie.director = response.data.Director;
                        vm.movie.actores = response.data.Actors;
                        vm.movie.duracion = response.data.Runtime;
                        vm.movie.fecha = response.data.Year;
                        vm.movie.tags = $scope.tag;
                        vm.movie.poster = response.data.Poster;
                        vm.movie.imdbId = response.data.imdbID;
                        vm.movie.genero = response.data.Genre;
                        vm.movie.imdbRating = response.data.imdbRating;
                        vm.movie.tomatoRating = response.data.tomatoRating;
                        // vm.movie.referencias=$scope.referencias;

                    });
            }
            $http.get("http://www.omdbapi.com/?s=" + vm.movie.name)
                .then(function (response) {
                    vm.movie.related = response.data;
                });
        }

        $scope.update = function (movie) {
            vm.movie.name = $scope.title;
        };
        // Remove existing Movie
        function remove() {
            if (confirm('Are you sure you want to delete?')) {
                vm.movie.$remove($state.go('movies.list'));
            }
        }

        // Save Movie
        function save(isValid) {
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.form.movieForm');
                return false;
            }
            // TODO: move create/update logic to service
            if (vm.movie._id) {
                vm.movie.$update(successCallback, errorCallback);
            } else {
                vm.movie.$save(successCallback, errorCallback);
            }
            function successCallback(res) {
                $state.go('movies.view', {
                    movieId: res._id
                });
            }

            function errorCallback(res) {
                vm.error = res.data.message;
            }
        }
    }

    function starRating() {
        return {
            restrict: 'EA',
            template: '<ul class="star-rating" ng-class="{readonly: readonly}">' +
            '  <li ng-repeat="star in stars" class="star" ng-class="{filled: star.filled}" ng-click="toggle($index)">' +
            '    <i class="fa fa-star"></i>' + // or &#9733
            '  </li>' +
            '</ul>',
            scope: {
                ratingValue: '=ngModel',
                max: '=?', // optional (default is 5)
                onRatingSelect: '&?',
                readonly: '=?'
            },
            link: function (scope, element, attributes) {
                if (scope.max === undefined) {
                    scope.max = 5;
                }
                function updateStars() {
                    scope.stars = [];
                    for (var i = 0; i < scope.max; i++) {
                        scope.stars.push({
                            filled: i < scope.ratingValue
                        });
                    }
                }

                scope.toggle = function (index) {
                    if (scope.readonly === undefined || scope.readonly === false) {
                        scope.ratingValue = index + 1;
                        scope.onRatingSelect({
                            rating: index + 1
                        });
                    }
                };
                scope.$watch('ratingValue', function (oldValue, newValue) {
                    if (newValue) {
                        updateStars();
                    }
                });
            }
        };
    }

})();
