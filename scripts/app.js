'use strict';

var app = angular.module('TaskShooterApp', ['ngAnimate', 'ngResource', 'ngRoute', 'firebase', 'toaster', 'angularMoment'])

  .constant('FURL', 'https://task-shooter.firebaseio.com/')

  .run(function($rootScope, $location) 
  {
    $rootScope.$on("$routeChangeError", function(event, next, previous, error) 
    {
      if (error === "AUTH_REQUIRED") 
      {
        $location.path("/login");
      }
        
    });
  })

  .config(function ($routeProvider)
  {
      $routeProvider
          .when('/', {
            templateUrl: 'views/browse.html',
            controller: 'BrowseController'
          })
          .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'AuthenticationController'
          })
          .when('/register', {
            templateUrl: 'views/register.html',
            controller: 'AuthenticationController'
          })
          .when('/browse/:taskId', {
            templateUrl: 'views/browse.html',
            controller: 'BrowseController'
          })
          .when('/dashboard', {
            templateUrl: 'views/dashboard.html',
            controller: 'DashboardController',
            resolve: {
                currentAuth: function(Auth) {
                    return Auth.requireAuth();
                }
            }     
          })
          .otherwise({
            redirectTo: '/'
          });
  });