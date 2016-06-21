(function () {
  'use strict';

  describe('Movies Route Tests', function () {
    // Initialize global variables
    var $scope,
      MoviesService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _MoviesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      MoviesService = _MoviesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('movies');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/movies');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          MoviesController,
          mockMovie;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('movies.view');
          $templateCache.put('modules/movies/client/views/view-movie.client.view.html', '');

          // create mock Movie
          mockMovie = new MoviesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Movie Name'
          });

          //Initialize Controller
          MoviesController = $controller('MoviesController as vm', {
            $scope: $scope,
            movieResolve: mockMovie
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:movieId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.movieResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            movieId: 1
          })).toEqual('/movies/1');
        }));

        it('should attach an Movie to the controller scope', function () {
          expect($scope.vm.movie._id).toBe(mockMovie._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/movies/client/views/view-movie.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          MoviesController,
          mockMovie;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('movies.create');
          $templateCache.put('modules/movies/client/views/form-movie.client.view.html', '');

          // create mock Movie
          mockMovie = new MoviesService();

          //Initialize Controller
          MoviesController = $controller('MoviesController as vm', {
            $scope: $scope,
            movieResolve: mockMovie
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.movieResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/movies/create');
        }));

        it('should attach an Movie to the controller scope', function () {
          expect($scope.vm.movie._id).toBe(mockMovie._id);
          expect($scope.vm.movie._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/movies/client/views/form-movie.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          MoviesController,
          mockMovie;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('movies.edit');
          $templateCache.put('modules/movies/client/views/form-movie.client.view.html', '');

          // create mock Movie
          mockMovie = new MoviesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Movie Name'
          });

          //Initialize Controller
          MoviesController = $controller('MoviesController as vm', {
            $scope: $scope,
            movieResolve: mockMovie
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:movieId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.movieResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            movieId: 1
          })).toEqual('/movies/1/edit');
        }));

        it('should attach an Movie to the controller scope', function () {
          expect($scope.vm.movie._id).toBe(mockMovie._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/movies/client/views/form-movie.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
