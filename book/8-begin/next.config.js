require('dotenv').config();

module.exports = {
  mode: 'universal',
  env: {
    Stripe_Test_PublishableKey: process.env.Stripe_Test_PublishableKey,
    Stripe_Live_PublishableKey: process.env.Stripe_Live_PublishableKey,
  },
};
