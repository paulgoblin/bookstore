'use strict';

var app = angular.module('paymentApp', ['ui.router', 'ngStorage', "stripe.checkout"]);

app.constant('ENV', {
  API_URL: 'http://localhost:3000'
});

app.run(function($rootScope, $localStorage) {
  $rootScope.$storage = $localStorage;
  $rootScope.$storage.myCart = $rootScope.$storage.myCart || {};

});

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', { url: '/', templateUrl: 'templates/home.html'})
    .state('login', { url: '/login', templateUrl: 'templates/login.html', controller: 'loginCtrl'})
    .state('register', { url: '/register', templateUrl: 'templates/register.html', controller: 'registerCtrl'})

    .state('cart', { url: '/cart', templateUrl: 'templates/cart/layout.html', abstract: true})
    .state('cart.index', { url: '/', templateUrl: 'templates/cart/cartIndex.html', controller: 'cartIndexCtrl'})
    .state('cart.reciept', { url: '/{purchaseId}', templateUrl: 'templates/cart/cartReciept.html', controller: 'cartRecieptCtrl'})

    .state('books', { url: '/books', templateUrl: 'templates/books/layout.html', abstract: true })
    .state('books.index', { url: '/', templateUrl: 'templates/books/booksIndex.html', controller: 'booksIndexCtrl'})
    .state('books.show', { url: '/{bookId}', templateUrl: 'templates/books/booksShow.html', controller: 'booksShowCtrl'})
});
