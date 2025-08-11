const express = require('express');
let books = require("./booksdb.js");
const axios = require("axios");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const BASE_URL = "http://localhost:5000";

// moved to auth cause related to users
// public_users.post("/register", (req,res) => {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        const { data } = await axios.get('http://localhost:5000/books');
        return res.status(200).json(data);
    } catch (e) {
        return res.status(500).json({ message: "Can't get books", error: e.message });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        let isbn = req.params.isbn;
        const { data } = await axios.get(`${BASE_URL}/books/`);
        let book = data[isbn];

        if (book) {
            return res.status(200).json(book);
        } else {
            return res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Error fetching book by ISBN", error: error.message });
    }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
        let author = req.params.author;
        const { data } = await axios.get(`${BASE_URL}/books/`);
        let filteredBooks = Object.values(data).filter(
            (book) => book.author === author
        );

        if (filteredBooks.length > 0) {
            return res.status(200).json(filteredBooks);
        } else {
            return res
                .status(404)
                .json({ message: "Books not found for this author" });
        }
    } catch (error) {
        return res
            .status(500)
            .json({
                message: "Error fetching books by author",
                error: error.message,
            });
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
        let title = req.params.title;
        const { data } = await axios.get(`${BASE_URL}/books/`);
        let filteredBooks = Object.values(data).filter(
            (book) => book.title === title
        );

        if (filteredBooks.length > 0) {
            return res.status(200).json(filteredBooks);
        } else {
            return res
                .status(404)
                .json({ message: "Books not found for this title" });
        }
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Error fetching books by title", error: error.message });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    let isbn = req.params.isbn;
    let book = books[isbn];
    if (book && book.reviews) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: "No reviews found for this book" });
    }
});

module.exports.general = public_users;
