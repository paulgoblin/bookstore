'use strict';

var app = angular.module('paymentApp');

app.service('Payment', function($http, ENV) {
  this.sendPayment = function(data) {
    console.log(data,'data in payment srvc');
    return $http.post(`${ENV.API_URL}/payment`, data);
  };
});
