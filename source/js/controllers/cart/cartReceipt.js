'use strict';

var app = angular.module('paymentApp');

app.controller('cartRecieptCtrl', function($scope, $state ) {
  $scope.date = $scope.$storage.reciept.pop();
  $scope.reciept = $scope.$storage.reciept.slice(1);
  $scope.total = $scope.$storage.reciept[0];
  console.log($scope.date,'date');
});
