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

'use strict';

var app = angular.module('paymentApp');

app.controller('navCtrl', function($scope, $state) {
  $scope.logout = function(){
    delete $scope.$storage.myToken;
    $state.go('login');
  };
});

'use strict';

var app = angular.module('paymentApp');

app.controller('registerCtrl', function($scope, $state, UserService) {

  $scope.submit = function(user) {
    if(user.password !== user.password2){
      swal('Error:', 'Passwords do not match.', 'error');
      return;
    }
    UserService.register(user)
    .then(function(data){
      $scope.$storage.myToken = res.data.token;
      $state.go('home');

    }, function(err) {
      console.error(err);
    });
  }
});

'use strict';

var app = angular.module('paymentApp');

app.service('BookService', function($http, ENV) {
  this.index = function() {
    return $http.get(`${ENV.API_URL}/books/`);
  };
  this.show = function(bookId) {
    return $http.get(`${ENV.API_URL}/books/${bookId}`);
  };
});

'use strict';

var app = angular.module('paymentApp');

app.service('Payment', function($http, ENV) {
  this.sendPayment = function(data) {
    console.log(data,'data in payment srvc');
    return $http.post(`${ENV.API_URL}/payment`, data);
  };
});

'use strict';

var app = angular.module('paymentApp');

app.service('UserService', function($http, ENV) {
  this.register = function(user) {
    return $http.post(`${ENV.API_URL}/users/register`, user);
  };
  this.login = function(user) {
    return $http.post(`${ENV.API_URL}/users/login`, user);
  };
});

'use strict';

var app = angular.module('paymentApp');

app.controller('booksIndexCtrl', function($scope, $state, BookService) {
  BookService.index()
  .then(function(res) {
    $scope.books = res.data;
  }, function(err) {
    console.error(err);
  });

});

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
    delete $scope.$storage.myCart[$scope.book._id];
    $scope.numInCart = 0;
  }

  $scope.showAddButon = () => {
  }

});

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
    })
  }

});

