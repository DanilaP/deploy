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
            res.status(400).json({ message: "Неверные данные" });
        }
    } catch (error) {
        console.error("/auth/sigin method", error);
        res.status(400).json({ message: "Ошибка входа в аккаунт!" });
    }
});
app.post("/auth/signup", async function(req, res) {
    try {
        const { login, password } = req.body;
        let currentUsers = JSON.parse(fs.readFileSync('DB/Users.json', 'utf8'));
        if (currentUsers.filter((user) => user.login === login).length > 0) {
            res.status(400).json({ message: "Данный  пользователь уже существует!" });
        } else {
            let newUserId = Date.now();
            let newUser = {
                id: newUserId,
                login,
                password: bcrypt.hashSync(password, 7),
                role: "Пользователь",
                avatar: "http://localhost:5000/avatar.jpg"
            };
            let updatedUsers = JSON.stringify([...currentUsers, newUser]);
            fs.writeFileSync('DB/Users.json', updatedUsers);
            res.status(200).json({ message: "Успешная регистрация", user: newUser, token: generateAccessToken(newUserId) });
        }
        
    } catch (error) {
        console.error("/auth/sigup method", error);
        res.status(400).json({ message: "Ошибка регистрации!" });
    }
});

//Users routes
app.post("/users", async function(req, res) {
    try {
        const { login, password, role } = req.body;
        let currentUsers = JSON.parse(fs.readFileSync('DB/Users.json', 'utf8'));
        if (currentUsers.filter((user) => user.login === login).length > 0) {
            res.status(200).json({ message: "Данный  пользователь уже существует!" });
        } else {
            let newUserId = Date.now();
            let newUser = {
                id: newUserId,
                login,
                password: bcrypt.hashSync(password, 7),
                role,
                avatar: "http://localhost:5000/avatar.jpg"
            };
            let updatedUsers = JSON.stringify([...currentUsers, newUser]);
            fs.writeFileSync('DB/Users.json', updatedUsers);
            res.status(200).json({ message: "Успешная регистрация", user: newUser, users: JSON.parse(updatedUsers) });
        }
    }
    catch(error) {
        console.error("post /users", error);
        res.status(400).json({ message: "Ошибка получения пользователей!" });
    }
});
app.delete("/users", async function(req, res) {
    try {
        const userId  = req.query.id;
        let currentUsers = JSON.parse(fs.readFileSync('DB/Users.json', 'utf8'));
        if (currentUsers.length !== 0) {
            let newUsersArray = currentUsers.filter((user) => user.id !== +userId);
            fs.writeFileSync('DB/Users.json', JSON.stringify(newUsersArray));
            res.status(200).json({ message: "Успешное удаление пользователя!", users: newUsersArray });
        }
    }
    catch(error) {
        console.error("delete /users", error);
        res.status(400).json({ message: "Ошибка при удалении пользователя!" });
    }
});
app.get("/users", async function(req, res) {
    try {
        let currentUsers = JSON.parse(fs.readFileSync('DB/Users.json', 'utf8'));
        res.status(200).json({ message: "Успешное получение списка пользователей", users: currentUsers });
    }
    catch(error) {
        console.error("get /users", error);
        res.status(400).json({ message: "Ошибка при получении списка пользователей!" });
    }
});
app.put("/users", async function(req, res) {
    try {
        let currentUsers = JSON.parse(fs.readFileSync('DB/Users.json', 'utf8'));
        let updatedUsers = currentUsers.map((user) => {
            console.log(req.body);
            if (user.id === req.body.id) {
                return { 
                    id: user.id,
                    login: req.body.login,
                    password: req.body.password ? bcrypt.hashSync(req.body.password, 7) : user.password,
                    role: req.body.role,
                    avatar: req.body.avatar
                };
            } 
            return user;
        });
        fs.writeFileSync('DB/Users.json', JSON.stringify(updatedUsers));
        res.status(200).json({ message: "Успешное обновление данных пользователя", user: updatedUsers });
    }
    catch(error) {
        console.error("put /users", error);
        res.status(400).json({ message: "Ошибка редактирования пользователя!" });
    }
});

//Profile 
app.get("/profile", async function(req, res) {
    try {
        const token = req.headers.authorization;     
        const userId = jwt_decode(token);
        let currentUsers = JSON.parse(fs.readFileSync('DB/Users.json', 'utf8'));

        let user = currentUsers.filter((user) => user.id === userId.id);
        res.status(200).json({ message: "Данные о пользователе успешно получены", user: user });
    }
    catch(error) {
        console.error("get /profile", error);
        res.status(400).json({ message: "Ошибка получения пользователя!" });
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
