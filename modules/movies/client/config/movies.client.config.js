(function () {
  'use strict';

  angular
    .module('movies')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Peliculas',
      state: 'movies',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'movies', {
      title: 'Listar Peliculas',
      state: 'movies.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'movies', {
      title: 'Crear Pelicula',
      state: 'movies.create',
      roles: ['admin']
    });
  }
})();
