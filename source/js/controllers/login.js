'use strict';

var app = angular.module('paymentApp');

app.controller('loginCtrl', function($scope, $state, $localStorage, UserService) {
  $scope.submit = function(user) {
    UserService.login(user)
    .then(function(res){
      $scope.$storage.myToken = res.data.token;
      $state.go('books.index');
    }, function(err) {
      console.error(err);

    });
  }
});
