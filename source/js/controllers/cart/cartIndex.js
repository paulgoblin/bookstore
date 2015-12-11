'use strict';

var app = angular.module('paymentApp');

app.controller('cartIndexCtrl', function($scope, $state, BookService) {
  $scope.test = 'poop';
  $scope.cart = [];
  var itemKeys = Object.keys($scope.$storage.myCart);
  var count = 0;
  $scope.total = 0;
  itemKeys.forEach((key) => {
    BookService.show(key).then((resp)=>{
      let cartItem = {};
      cartItem.qty = $scope.$storage.myCart[key];
      cartItem.total = resp.data.price*cartItem.qty;
      cartItem.price = resp.data.price;
      cartItem.title = resp.data.title;
      $scope.cart.push(cartItem)
      $scope.total += cartItem.total
    })
  })
});
