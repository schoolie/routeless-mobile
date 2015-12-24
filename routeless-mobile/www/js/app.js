// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('routeless', ['ionic', 
                           'ngStorage',
                           'leaflet-directive', 
                           'ngCordova', 
                           'igTruncate', 
                           'routelessServices',
                           'routelessControllers'])

  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        window.cordova.plugins.Keyboard.disableScroll(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })

  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('signin', {
        url: '/sign-in',
        templateUrl: 'templates/sign-in.html',
        controller: 'SignInCtrl'
      })
      .state('forgotpassword', {
        url: '/forgot-password',
        templateUrl: 'templates/forgot-password.html'
      })
      .state('tabs', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html',
        controller: 'TabCtrl'
      })
      .state('tabs.courses', {
        url: '/courses',
        views: {
          'home-tab': {
            templateUrl: 'templates/courses.html',
            controller: 'CourseListCtrl'
          }
        }
      })
      .state('tabs.course', {
        url: '/courses/:courseId',
        views: {
          'home-tab': {
            templateUrl: 'templates/map.html',
            controller: 'CourseDetailCtrl'
          }
        }
      })
      .state('tabs.facts', {
        url: '/facts',
        views: {
          'home-tab': {
            templateUrl: 'templates/facts.html'
          }
        }
      })
      .state('tabs.facts2', {
        url: '/facts2',
        views: {
          'home-tab': {
            templateUrl: 'templates/facts2.html'
          }
        }
      })
      .state('tabs.about', {
        url: '/about',
        views: {
          'about-tab': {
            templateUrl: 'templates/about.html'
          }
        }
      })
      .state('tabs.navstack', {
        url: '/navstack',
        views: {
          'about-tab': {
            templateUrl: 'templates/nav-stack.html'
          }
        }
      })
      .state('tabs.home', {
        url: '/home',
        views: {
          'home-tab': {
            templateUrl: 'templates/home.html',
            controller: 'HomeTabCtrl'
          }
        }
      })


    $urlRouterProvider.otherwise('/sign-in');

  });