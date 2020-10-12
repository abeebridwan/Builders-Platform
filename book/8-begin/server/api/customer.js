/* eslint-disable no-console */
const express = require('express');
const Book = require('../models/Book');
const stripe = require('../stripe.js');
const Purchase = require('../models/Purchase');

const router = express.Router();

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

    const session = await stripe.createSession({
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

router.get('/my-books', async (req, res) => {
  try {
    const { purchasedBookIds = [] } = req.user;
    console.log(purchasedBookIds);
    const { purchasedBooks } = await Book.getPurchasedBooks({ purchasedBookIds });

    res.json({ purchasedBooks });
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
});

module.exports = router;
