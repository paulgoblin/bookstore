'use strict';

var app = angular.module('paymentApp');

app.controller('booksShowCtrl', function($scope, $state, BookService, Payment, ENV, $localStorage) {

  BookService.show($state.params.bookId)
  .then(function(res) {
    $scope.book = res.data;
    $scope.numInCart = $scope.$storage.myCart[$scope.book._id] || 0;
  });
  $scope.STRIPE_PUB_KEY = ENV.STRIPE_PUB_KEY;

  $scope.doCheckout = (token) => {
    var data = {};
    data.token = token;
    data.book = $scope.book;
    Payment.sendPayment(data).then((resp)=>{
      console.log("resp: ",resp);
    })
  }

  $scope.addToCart = () => {
    $scope.$storage.myCart[$scope.book._id] = $scope.$storage.myCart[$scope.book._id] + 1 || 1;
    $scope.numInCart = $scope.$storage.myCart[$scope.book._id]
  }

  $scope.clearItemFromCart = () => {
    $scope.$storage.myCart[$scope.book._id] = 0;
    $scope.numInCart = $scope.$storage.myCart[$scope.book._id]
    
  }

  $scope.showAddButon = () => {
  }

});
