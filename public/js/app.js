angular.module('RegistroApp', ['ngRoute', 'ngMaterial', 'ngMessages', 'AppControllers', 'AppServices'])
  .config(['$routeProvider', '$mdThemingProvider', function ($routeProvider, $mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('teal');
    $routeProvider
      .when('/home', {
        controller: 'HomeCtrl',
        templateUrl: 'views/home.html'
      })
      .when('/talleres/:workshop', {
        controller: 'WorkshopsCtrl',
        templateUrl: 'views/workshops.html'
      })
      .otherwise({
        redirectTo: '/home'
      });
  }]);
