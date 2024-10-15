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

        let currentRoles = JSON.parse(fs.readFileSync('DB/Roles.json', 'utf8'));
        let currentUserPermissions = currentRoles.filter((role) => role.name === user[0].role)[0].permissions;

        res.status(200).json({ message: "Данные о пользователе успешно получены", user: user, permissions: currentUserPermissions });
    }
    catch(error) {
        console.error("get /profile", error);
        res.status(400).json({ message: "Ошибка получения пользователя!" });
    }
});

//Permissions
app.get("/permissions", async function(req, res) {
    try {
        let currentPermissions = JSON.parse(fs.readFileSync('DB/Permissions.json', 'utf8'));
        let currentRoles = JSON.parse(fs.readFileSync('DB/Roles.json', 'utf8'));
        let currentPermissionsGroups = JSON.parse(fs.readFileSync('DB/PermissionGroups.json', 'utf8'));
        res.status(200).json({ message: "Данные о разрешениях пользователей успешно получены", permissions: currentPermissions, roles: currentRoles, permissionsGroups: currentPermissionsGroups });
    }
    catch(error) {
        console.error("get /permitions", error);
        res.status(400).json({ message: "Ошибка получения данных о разрешениях пользователей!" });
    }
});

//PermissionGroups
app.get("/permissions/groups", async function(req, res) {
    try {
        let currentPermissions = JSON.parse(fs.readFileSync('DB/Permissions.json', 'utf8'));
        let currentPermissionsGroups = JSON.parse(fs.readFileSync('DB/PermissionGroups.json', 'utf8'));
        res.status(200).json({ message: "Данные о группах разрешений успешно получены", permissionsGroups: currentPermissionsGroups, permissions: currentPermissions });
    }
    catch(error) {
        console.error("get /permissions/groups", error);
        res.status(400).json({ message: "Ошибка получения данных о группах разрешений!" });
    }
});
app.post("/permissions/groups", async function(req, res) {
    try {
        let currentGroups = JSON.parse(fs.readFileSync('DB/PermissionGroups.json', 'utf8'));
        const newGroups = [...currentGroups, { name: req.body.name, permissions: [] }];
        fs.writeFileSync('DB/PermissionGroups.json', JSON.stringify(newGroups));
        res.status(200).json({ message: "Группа разрешений успешно добавлена", permissionsGroups: newGroups });
    }
    catch(error) {
        console.error("post /permissions/groups", error);
        res.status(400).json({ message: "Ошибка при создании группы разрешений!" });
    }
});
app.delete("/permissions/groups", async function(req, res) {
    try {
        let currentGroups = JSON.parse(fs.readFileSync('DB/PermissionGroups.json', 'utf8'));
        const newGroups = currentGroups.filter((group) => group.name !== req.query.name);
        fs.writeFileSync('DB/PermissionGroups.json', JSON.stringify(newGroups));
        
        res.status(200).json({ message: "Группа разрешений успешно удалена", permissionsGroups: newGroups });
    }
    catch(error) {
        console.error("delete /permissions/groups", error);
        res.status(400).json({ message: "Ошибка при удалении группы разрешений!" });
    }
});
app.put("/permissions/groups", async function(req, res) {
    try {
        const newGroups = req.body.permissionsGroups;
        const allPermissionsFromGroups = newGroups.reduce((prev, group) => {
            return [...prev, ...group.permissions];
        }, []);
        const currentRoles = JSON.parse(fs.readFileSync('DB/Roles.json', 'utf8'));

        let updatedRoles = currentRoles.map(role => {
            return {
                ...role,
                permissions: role.permissions.filter(el => allPermissionsFromGroups.includes(el))
            };
        });
        fs.writeFileSync('DB/Roles.json', JSON.stringify(updatedRoles));
        fs.writeFileSync('DB/PermissionGroups.json', JSON.stringify(newGroups));
        
        res.status(200).json({ message: "Группа разрешений успешно обновлена", permissionsGroups: newGroups });
    }
    catch(error) {
        console.error("put /permissions/groups", error);
        res.status(400).json({ message: "Ошибка при обновлении группы разрешений!" });
    }
});

//Roles
app.get("/roles", async function(req, res) {
    try {
        let currentRoles = JSON.parse(fs.readFileSync('DB/Roles.json', 'utf8'));
        res.status(200).json({ message: "Данные о ролях успешно получены", roles: currentRoles });
    }
    catch(error) {
        console.error("get /roles", error);
        res.status(400).json({ message: "Ошибка получения данных о ролях!" });
    }
});
app.delete("/roles", async function(req, res) {
    try {
        let currentRoles = JSON.parse(fs.readFileSync('DB/Roles.json', 'utf8'));
        const newRoles = currentRoles.filter((role) => role.name !== req.query.name);
        fs.writeFileSync('DB/Roles.json', JSON.stringify(newRoles));

        res.status(200).json({ message: "Роль успешно удалена", roles: newRoles });
    }
    catch(error) {
        console.error("delete /roles", error);
        res.status(400).json({ message: "Ошибка при удалении роли!" });
    }
});
app.post("/roles", async function(req, res) {
    try {
        let currentRoles = JSON.parse(fs.readFileSync('DB/Roles.json', 'utf8'));
        const newRoles = [...currentRoles, { name: req.body.name, permissions: req.body.permissions }];
        fs.writeFileSync('DB/Roles.json', JSON.stringify(newRoles));

        res.status(200).json({ message: "Роль успешно добавлена", roles: newRoles });
    }
    catch(error) {
        console.error("post /roles", error);
        res.status(400).json({ message: "Ошибка при добавлении роли!" });
    }
});
app.put("/roles", async function(req, res) {
    try {
        fs.writeFileSync('DB/Roles.json', JSON.stringify(req.body.roles));

        res.status(200).json({ message: "Роль успешно изменена", roles: req.body.roles });
    }
    catch(error) {
        console.error("put /roles", error);
        res.status(400).json({ message: "Ошибка при изменении роли!" });
    }
});


//Products
app.get("/products", async function(req, res) {
    try {
        let currentProducts = JSON.parse(fs.readFileSync('DB/Products.json', 'utf8'));
        res.status(200).json({ message: "Данные о товарах успешно получены", products: currentProducts });
    }
    catch(error) {
        console.error("get /products", error);
        res.status(400).json({ message: "Ошибка получения данных о товарах!" });
    }
});
app.get("/product", async function(req, res) {
    try {
        let currentProducts = JSON.parse(fs.readFileSync('DB/Products.json', 'utf8'));
        const choosenProduct = currentProducts.filter((product) => product.id === +req.query.id);
        res.status(200).json({ message: "Данные о товаре успешно получены", product: choosenProduct[0] });
    }
    catch(error) {
        console.error("get /product", error);
        res.status(400).json({ message: "Ошибка получения данных о товаре!" });
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
