'use strict';

var app = angular.module('paymentApp');

app.controller('cartIndexCtrl', function($scope, $state, BookService, Payment ) {
  $scope.test = 500
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
      cartItem._id = resp.data._id
      $scope.cart.push(cartItem)
      $scope.total += cartItem.total
    })
  })

  $scope.doCheckout = (tokenObj) => {
    let data = {};
    data.tokenObj = tokenObj;
    data.cart = $scope.cart;
    data.cart.unshift($scope.total);
    Payment.sendPayment(data).then((resp) => {
      console.log('got this back from server',resp);
      if (resp.status != 200) return;
      $scope.$storage.reciept = resp.data;
      $scope.$storage.reciept.push(new Date());
      delete $scope.$storage.myCart
      let purchaseId = Date.now().toString()
      $state.go('cart.reciept')
    })
  }

});
