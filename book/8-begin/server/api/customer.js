/* eslint-disable no-console */
const express = require('express');
const Book = require('../models/Book');

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
