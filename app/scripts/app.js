'use strict';

var restangularProvider;

angular.module('quiverInvoiceApp', [
  'ngSanitize',
  'restangular',
  'ui.router',
  'angular-google-analytics',
  'jmdobry.angular-cache',
  'firebase',
  'notifications'
])
  .run(function (cacheService) {
    cacheService.config(restangularProvider);
  })
  .config(function ($stateProvider, $urlRouterProvider, RestangularProvider) {
    restangularProvider = RestangularProvider;

    RestangularProvider.setBaseUrl(window.env.api);
    $urlRouterProvider.otherwise('/');

    var nav = {
      templateUrl: 'views/nav.html',
      controller: 'NavCtrl',
      resolve: {
        user: function (userService) {
          return userService.get();
        },
        loggedInUser: function (userService) {
          return userService.getLoggedInUser();
        }
      }
    };

    $stateProvider
      .state('root', {
        url: '/',
        views: {
          nav: nav,
          body: {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
          }
        }
      })
      .state('dashboard', {
        url: '/dashboard',
        views: {
          nav: nav,
          body: {
            templateUrl: 'views/dashboard.html',
            controller: 'DashboardCtrl'
          }
        }
      })
      .state('login', {
        url: '/login',
        views: {
          nav: nav,
          body: {
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl'
          }
        }
      })
      .state('settings', {
        url: '/settings',
        views: {
          nav: nav,
          body: {
            templateUrl: 'views/settings.html',
            controller: 'SettingsCtrl'
          }
        }
      })
      .state('devMountain', {
        url: '/devmountain',
        views: {
          nav: nav,
          body: {
            templateUrl: 'views/devmountain.html',
            controller: function($scope, user, name) {
              $scope.user=user;
              $scope.name=name;
            },
            resolve: {
              invoices: function (userService) {
                return userService.get();
              },
              invoice: function ($stateParams) {
                if ($stateParams.name) {
                  return invoiceService.newInvoice();
                } else {
                  return invoiceService.get($stateParams.id);
                }

              }
            }
          }
        }
      });

  });
