const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{ username: "carlos", password: "1111111" },
{ username: "john_doe", password: "password123" }];

const isValid = (username) => { //returns boolean

    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username, password) => {
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generar token de acceso JWT
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 });

        // Almacenar token de acceso y nombre de usuario en la sesión
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("Usuario ha iniciado sesión correctamente");
    } else {
        return res.status(208).json({ message: "Inicio de sesión inválido. Verifique el nombre de usuario y la contraseña" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;

    // Verificar si la reseña fue proporcionada
    if (!review) {
        return res.status(400).json({ message: "Review content is required." });
    }
    // Verificar si el usuario está autenticado
    const authorization = req.session.authorization;
    if (!authorization) {
        return res.status(401).json({ message: "User not logged in." });
    }
    const username = jwt.verify(authorization.accessToken, "access").username;
    // Verificar si el libro existe
    if (!books[isbn]) {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
    }
    // Agregar o modificar la reseña del usuario
    if (!books[isbn].reviews) {
        books[isbn].reviews = {}; // Inicializar el objeto de reseñas si no existe
    }
    books[isbn].reviews[username] = review;

    res.status(200).json({ message: "Review added/updated successfully.", reviews: books[isbn].reviews });
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    // Verificar si el usuario está autenticado
    const authorization = req.session.authorization;
    if (!authorization) {
        return res.status(401).json({ message: "User not logged in." });
    }
    const username = jwt.verify(authorization.accessToken, "access").username;
    // Verificar si el libro existe
    if (!books[isbn]) {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
    }
    // Verificar si el usuario tiene una reseña para este libro
    if (books[isbn].reviews && books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        res.status(200).json({ message: "Review deleted successfully.", reviews: books[isbn].reviews });
    } else {
        res.status(404).json({ message: "Review not found for the user." });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
