const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Verificar si se proporcionaron username y password
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // Verificar si el usuario ya existe
    const userExists = users.some(user => user.username === username);
    if (userExists) {
        return res.status(409).json({ message: `Username ${username} already exists.` });
    }

    // Registrar nuevo usuario
    users.push({ username, password });
    res.status(201).json({ message: "User registered successfully." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {

    //Write your code here
    res.send(JSON.stringify(books, null, 4));
});
const axios = require('axios');

// Obtener la lista de libros usando Promesas
const getBooksWithPromises = () => {
    return new Promise((resolve, reject) => {
        if (books) {
            resolve(JSON.stringify(books, null, 4));
        } else {
            reject("No books available.");
        }
    });
};

// Obtener la lista de libros usando async/await
const getBooksAsyncAwait = async () => {
    try {
        const response = await axios.get("http://localhost:5000/");
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch books.");
    }
};


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    res.send(books[isbn]);
});
const getBookDetailsWithPromises = (isbn) => {
    return new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject(`Book with ISBN ${isbn} not found.`);
        }
    });
};

// Endpoint usando Promesas
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    getBookDetailsWithPromises(isbn)
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({ message: error }));
});



const getBookDetailsAsyncAwait = async (isbn) => {
    if (books[isbn]) {
        return books[isbn];
    } else {
        throw new Error(`Book with ISBN ${isbn} not found.`);
    }
};

// Endpoint usando async/await
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    try {
        const book = await getBookDetailsAsyncAwait(isbn);
        res.status(200).json(book);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});


// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    const author = req.params.author;

    // Obtener todas las claves del objeto books
    const bookKeys = Object.keys(books);

    // Filtrar libros cuyo autor coincida con el proporcionado
    const filteredBooks = bookKeys
        .map(key => books[key])
        .filter(book => book.author.toLowerCase() === author.toLowerCase()); // Verificar coincidencia del autor

    if (filteredBooks.length > 0) {
        res.status(200).json(filteredBooks);
    } else {
        res.status(404).json({ message: `No books found by author: ${author}` });
    }

});

const getBooksByAuthorWithPromises = (author) => {
    return new Promise((resolve, reject) => {
        const bookKeys = Object.keys(books);
        const filteredBooks = bookKeys
            .map(key => books[key])
            .filter(book => book.author.toLowerCase() === author.toLowerCase());

        if (filteredBooks.length > 0) {
            resolve(filteredBooks);
        } else {
            reject(`No books found by author: ${author}`);
        }
    });
};

// Endpoint usando Promesas
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;

    getBooksByAuthorWithPromises(author)
        .then(books => res.status(200).json(books))
        .catch(error => res.status(404).json({ message: error }));
});

const getBooksByAuthorAsyncAwait = async (author) => {
    const bookKeys = Object.keys(books);
    const filteredBooks = bookKeys
        .map(key => books[key])
        .filter(book => book.author.toLowerCase() === author.toLowerCase());

    if (filteredBooks.length > 0) {
        return filteredBooks;
    } else {
        throw new Error(`No books found by author: ${author}`);
    }
};

// Endpoint usando async/await
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;

    try {
        const books = await getBooksByAuthorAsyncAwait(author);
        res.status(200).json(books);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    const title = req.params.title;

    // Obtener todas las claves del objeto books
    const bookKeys = Object.keys(books);

    // Filtrar libros cuyo título coincida con el proporcionado
    const filteredBooks = bookKeys
        .map(key => books[key]) // Convertir las claves en objetos de libros
        .filter(book => book.title.toLowerCase() === title.toLowerCase()); // Verificar coincidencia del título

    if (filteredBooks.length > 0) {
        res.status(200).json(filteredBooks);
    } else {
        res.status(404).json({ message: `No books found with title: ${title}` });
    }
});
const getBooksByTitleWithPromises = (title) => {
    return new Promise((resolve, reject) => {
        const bookKeys = Object.keys(books);
        const filteredBooks = bookKeys
            .map(key => books[key])
            .filter(book => book.title.toLowerCase() === title.toLowerCase());

        if (filteredBooks.length > 0) {
            resolve(filteredBooks);
        } else {
            reject(`No books found with title: ${title}`);
        }
    });
};

// Endpoint usando Promesas
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;

    getBooksByTitleWithPromises(title)
        .then(books => res.status(200).json(books))
        .catch(error => res.status(404).json({ message: error }));
});

const getBooksByTitleAsyncAwait = async (title) => {
    const bookKeys = Object.keys(books);
    const filteredBooks = bookKeys
        .map(key => books[key])
        .filter(book => book.title.toLowerCase() === title.toLowerCase());

    if (filteredBooks.length > 0) {
        return filteredBooks;
    } else {
        throw new Error(`No books found with title: ${title}`);
    }
};

// Endpoint usando async/await
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;

    try {
        const books = await getBooksByTitleAsyncAwait(title);
        res.status(200).json(books);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;

    if (books[isbn]) {
        res.status(200).json(books[isbn].reviews);
    } else {
        res.status(404).json({ message: `No book found with ISBN: ${isbn}` });
    }
});

module.exports.general = public_users;
