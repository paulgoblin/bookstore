'use strict';

var express = require('express');
var router = express.Router();
var stripe = require("stripe")("sk_test_f9p8BUy2GpfyAhTQjR2tTcKn");

router.post('/', function(req, res) {
  var stripeToken = req.body.tokenObj;
  var cart = req.body.cart
  console.log("stripeToken:", cart[0], req.body.cart);

  var charge = stripe.charges.create({
    amount: Math.round(cart[0]*100), // amount in cents, again
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
