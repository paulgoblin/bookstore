'use strict';

var express = require('express');
var router = express.Router();
var stripe = require("stripe")("sk_test_f9p8BUy2GpfyAhTQjR2tTcKn");


var User = require('../models/user');

// USERS

router.post('/', function(req, res) {

  // Set your secret key: remember to change this to your live secret key in production
  // See your keys here https://dashboard.stripe.com/account/apikeys

  // (Assuming you're using express - expressjs.com)
  // Get the credit card details submitted by the form
  var stripeToken = req.body.token;
  var book = req.body.book
  console.log("stripeToken:",stripeToken, book);

  var charge = stripe.charges.create({
    amount: Math.round(book.price*100), // amount in cents, again
    currency: "usd",
    source: stripeToken.id,
    description: "Example charge"
  }, function(err, charge) {
    if (err && err.type === 'StripeCardError') {
      // The card has been declined
    }
  });

  res.send('ok')

});

module.exports = router;
