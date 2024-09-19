const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const http = require('http');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');

const generateAccessToken = (id) => {
    const payload = {
        id: id,
    };
    return jwt.sign(payload, "SECRET_KEY_RANDOM", { expiresIn: "24h" });
};

const PORT = 5000;
const app = express();
const server = http.createServer(app);

app.use(cors({ origin: '*' }));
mongoose.set('strictQuery', false);

app.use(fileUpload());
app.use(express.json());
app.use(express.static('./staticFiles'));
app.use(express.urlencoded({ extended: true }));

///Auth routes
app.post("/auth/signin", async function(req, res) {
    try {
        const { login, password } = req.body;
        let currentUsers = JSON.parse(fs.readFileSync('DB/Users.json', 'utf8'));
        let findedUser = currentUsers.filter((user) => user.login === login && bcrypt.compareSync(password, user.password));
        if (findedUser.length > 0) {
            let token = generateAccessToken(findedUser[0].id);
            res.status(200).json({ message: "Успешный вход", user: findedUser[0], token });
        } else {
            res.status(200).json({ message: "Неверные данные" });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Ошибка входа в аккаунт!" });
    }
});
app.post("/auth/signup", async function(req, res) {
    try {
        const { login, password } = req.body;
        let currentUsers = JSON.parse(fs.readFileSync('DB/Users.json', 'utf8'));
        if (currentUsers.filter((user) => user.login === login).length > 0) {
            res.status(200).json({ message: "Данный  пользователь уже существует!" });
        } else {
            let newUserId = Date.now();
            let newUser = {
                id: newUserId,
                login,
                password: bcrypt.hashSync(password, 7),
                isAdmin: false,
            };
            let updatedUsers = JSON.stringify([...currentUsers, newUser]);
            fs.writeFileSync('DB/Users.json', updatedUsers);
            res.status(200).json({ message: "Успешная регистрация", user: newUser, token: generateAccessToken(newUserId) });
        }
        
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Ошибка регистрации!" });
    }
});

async function startApp() {
    try {
        server.listen(PORT, () => console.log('Server started at PORT' + " " + PORT));
    } catch (error) {
        console.log(error);
    }
}
startApp();
