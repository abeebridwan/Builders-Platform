/* eslint-disable no-console */
const express = require('express');
const Book = require('../models/Book');

const router = express.Router();

function createSession({ userId, bookId, bookSlug, userEmail, redirectUrl }) {
  console.log(userId, bookId, bookSlug, userEmail, redirectUrl);
  return stripeInstance.checkout.sessions.create({
    customer_email: userEmail,
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [{ price: getBookPriceId(bookSlug), quantity: 1 }],
    success_url: `${ROOT_URL}/stripe/checkout-completed/{CHECKOUT_SESSION_ID}`,
    cancel_url: `${ROOT_URL}${redirectUrl}?checkout_canceled=1`,
    metadata: { userId, bookId, redirectUrl },
  });
}

function getBookPriceId(bookSlug) {
  let priceId;

  if (bookSlug === 'demo-book') {
    priceId = dev
      ? process.env.STRIPE_TEST_DEMO_BOOK_PRICE_ID
      : process.env.STRIPE_LIVE_DEMO_BOOK_PRICE_ID;
  } else if (bookSlug === 'second-book') {
    priceId = dev
      ? process.env.STRIPE_TEST_SECOND_BOOK_PRICE_ID
      : process.env.STRIPE_LIVE_SECOND_BOOK_PRICE_ID;
  } else {
    throw new Error('Wrong book');
  }

  return priceId;
}

router.post('/stripe/fetch-checkout-session', async (req, res) => {
  try {
    const { bookId, redirectUrl } = req.body;

    const book = await Book.findById(bookId).select(['slug']).setOptions({ lean: true });

    if (!book) {
      throw new Error('Book not found');
    }

    const isPurchased =
      (await Purchase.find({ userId: req.user._id, bookId: book._id }).countDocuments()) > 0;
    if (isPurchased) {
      throw new Error('Already bought this book');
    }

    const session = await createSession({
      userId: req.user._id.toString(),
      userEmail: req.user.email,
      bookId,
      bookSlug: book.slug,
      redirectUrl,
    });

    res.json({ sessionId: session.id });
  } catch (err) {
    console.error(err);
    res.json({ error: err.message || err.toString() });
  }
});
