const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const http = require('http');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');
const path = require('path');
const WebSocket = require('ws');

const { error, log } = require('console');
const e = require('cors');
const cron = require('node-cron');
const { Blob } = require('buffer');
const { Buffer } = require('buffer');

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
        if (!findedUser[0].isActive) {
            res.status(400).json({ message: "Пользователь не существует!" });
        }
        if (findedUser.length > 0) {
            let token = generateAccessToken(findedUser[0].id);
            res.status(200).json({ message: "Успешный вход", user: findedUser[0], token });
        }
        else {
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
                isActive: true,
                isVerified: false,
                login,
                password: bcrypt.hashSync(password, 7),
                role: "Пользователь",
                avatar: "http://localhost:5000/avatar.jpg",
                backet: [],
                favorites: []
            };
            let updatedUsers = JSON.stringify([...currentUsers, newUser], null, 2);
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
        const { login, password, role, isActive, isVerified } = req.body;
        let currentUsers = JSON.parse(fs.readFileSync('DB/Users.json', 'utf8'));
        if (currentUsers.filter((user) => user.login === login).length > 0) {
            res.status(200).json({ message: "Данный  пользователь уже существует!" });
        } else {
            let newUserId = Date.now();
            let newUser = {
                id: newUserId,
                isActive,
                isVerified,
                login,
                password: bcrypt.hashSync(password, 7),
                role,
                avatar: "http://localhost:5000/avatar.jpg",
                backet: [],
                favorites: []
            };
            let updatedUsers = JSON.stringify([...currentUsers, newUser], null, 2);
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
            let newUsersArray = currentUsers.map((user) => {
                if (user.id === Number(userId)) {
                    return {
                        ...user,
                        isActive: false
                    };
                } else return user;
            });
            fs.writeFileSync('DB/Users.json', JSON.stringify(newUsersArray, null, 2));
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
            if (user.id === req.body.id) {
                return {
                    ...req.body,
                    id: user.id,
                    password: (req.body.password === user.password)
                        ? user.password
                        : bcrypt.hashSync(req.body.password, 7)
                };
            }
            return user;
        });
        fs.writeFileSync('DB/Users.json', JSON.stringify(updatedUsers, null, 2));
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
        fs.writeFileSync('DB/PermissionGroups.json', JSON.stringify(newGroups, null, 2));
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
        fs.writeFileSync('DB/PermissionGroups.json', JSON.stringify(newGroups, null, 2));

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
        fs.writeFileSync('DB/PermissionGroups.json', JSON.stringify(newGroups, null, 2));

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
        fs.writeFileSync('DB/Roles.json', JSON.stringify(newRoles, null, 2));

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
        fs.writeFileSync('DB/Roles.json', JSON.stringify(newRoles, null, 2));

        res.status(200).json({ message: "Роль успешно добавлена", roles: newRoles });
    }
    catch(error) {
        console.error("post /roles", error);
        res.status(400).json({ message: "Ошибка при добавлении роли!" });
    }
});
app.put("/roles", async function(req, res) {
    try {
        fs.writeFileSync('DB/Roles.json', JSON.stringify(req.body.roles, null, 2));

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
        const choosenProduct = currentProducts.filter((product) => product.id === Number(req.query.id));
        res.status(200).json({ message: "Данные о товаре успешно получены", product: choosenProduct[0] });
    }
    catch(error) {
        console.error("get /product", error);
        res.status(400).json({ message: "Ошибка получения данных о товаре!" });
    }
});

app.post("/product", async function(req, res) {
    try {
        res.status(200).json({ message: "Данные о товаре успешно обновлены", product: req.body });
    }
    catch(error) {
        console.error("post /product", error);
        res.status(400).json({ message: "Ошибка обновления данных о товаре!" });
    }
});

app.put("/product", async function(req, res) {
    try {
        const token = req.headers.authorization;
        const userId = jwt_decode(token).id;
        let currentProducts = JSON.parse(fs.readFileSync('DB/Products.json', 'utf8'));
        let currentUsers = JSON.parse(fs.readFileSync('DB/Users.json', 'utf8'));
        let user = currentUsers.filter((user) => user.id === userId)[0];

        let updatedProducts = currentProducts.map((product) => {
            if (product.id === Number(req.body.productId)) {
                if (product.reviews.filter((review) => review.clientId === userId).length === 0) {
                    return {
                        ...product,
                        reviews: [...product.reviews, {
                            clientId: userId,
                            ...req.body.review,
                            video: "http://localhost:5000/video/video1.mp4",
                            photo: "http://localhost:5000/products/product1.jpg",
                            likes: []
                        }]
                    };
                }
                else {
                    return {
                        ...product,
                        reviews: product.reviews.map(review => {
                            if (review.clientId === userId) {
                                return {
                                    clientId: userId,
                                    ...req.body.review,
                                    video: "http://localhost:5000/video/video1.mp4",
                                    photo: "http://localhost:5000/products/product1.jpg",
                                    likes: []
                                };
                            } else return review;
                        })
                    };
                }
            } else return product;
        });
        fs.writeFileSync('DB/Products.json', JSON.stringify(updatedProducts, null, 2));
        res.status(200).json({ message: "Данные о товаре успешно изменены!", review: {
            ...req.body.review,
            clientId: userId,
            avatar: user.avatar,
            video: "http://localhost:5000/video/video1.mp4",
            photo: "http://localhost:5000/products/product1.jpg",
            likes: []
        } });
    }
    catch(error) {
        console.error("post /product", error);
        res.status(400).json({ message: "Ошибка изменения данных о товаре!" });
    }
});

//Reviews
app.get("/reviews/product", async function(req, res) {
    try {
        let currentProducts = JSON.parse(fs.readFileSync('DB/Products.json', 'utf8'));
        let currentUsers = JSON.parse(fs.readFileSync('DB/Users.json', 'utf8'));
        let currentProduct = currentProducts.filter(product => product.id === Number(req.query.id))[0];
        let reviewsData = { title: currentProduct.name, reviews: currentProduct.reviews };
        if (currentProduct) {
            reviewsData.reviews = reviewsData.reviews.map(comment => {
                const currentUser = currentUsers.filter(user => user.id === comment.clientId)[0];
                return {
                    ...comment,
                    avatar: currentUser?.avatar
                };
            });
        }
        else {
            res.status(400).json({ message: "Ошибка получения данных об отзывах!" });
        }
        res.status(200).json({ message: "Данные об отзывах успешно получены", product: reviewsData });
    }
    catch(error) {
        console.error("get /reviews", error);
        res.status(400).json({ message: "Ошибка получения данных об отзывах!" });
    }
});
app.delete("/reviews/product", async function(req, res) {
    try {
        let currentProductId = +req.query.productId;
        let currentUserId = +req.query.userId;
        let currentProducts = JSON.parse(fs.readFileSync('DB/Products.json', 'utf8'));
        let updatedProducts = currentProducts.map((product) => {
            if (product.id === currentProductId) {
                return {
                    ...product,
                    reviews: product.reviews.filter((review) => review.clientId !== currentUserId)
                };
            } else return product;
        });
        fs.writeFileSync('DB/Products.json', JSON.stringify(updatedProducts, null, 2));
        res.status(200).json({ message: "Отзыв успешно удален" });
    }
    catch(error) {
        console.error("delete /reviews/product", error);
        res.status(400).json({ message: "Ошибка при удалении отзыва!" });
    }
});

//User Backet
app.get("/backet", async function(req, res) {
    try {
        const token = req.headers.authorization;
        const userId = jwt_decode(token).id;
        let currentUsers = JSON.parse(fs.readFileSync('DB/Users.json', 'utf8'));
        let currentProducts = JSON.parse(fs.readFileSync('DB/Products.json', 'utf8'));
        let user = currentUsers.filter((user) => user.id === userId)[0];

        let userBacketInfo = user.backet.map((productInfoFromBacket) => {
            return currentProducts.map((product) => {
                if (productInfoFromBacket.productId === product.id) {
                    return {
                        productInfo: { ...product },
                        number: productInfoFromBacket.number,
                        variation: productInfoFromBacket.variation,
                        id: productInfoFromBacket.id
                    };
                }
            });
        });
        let fixedArray = userBacketInfo.flat().filter((el) => el);
        res.status(200).json({ message: "Данные о корзине пользователя успешно получены", backet: fixedArray });
    } catch (error) {
        res.status(400).json({ message: "Ошибка получения данных о корзине пользователя" });
        console.error("get /backet", error);
    }
});
app.delete("/backet", async function(req, res) {
    try {
        const token = req.headers.authorization;
        const userId = jwt_decode(token).id;
        let currentUsers = JSON.parse(fs.readFileSync('DB/Users.json', 'utf8'));
        let updatedBacket = [];
        const idsToDelete = req.query.ids.split(',').map(Number);
        let updatedUsers = currentUsers.map((user) => {
            if (user.id === userId) {
                updatedBacket = user.backet.filter(
                  (product) => !idsToDelete.includes(product.id)
                );
                return {
                    ...user,
                    backet: updatedBacket
                };
            } else return user;
        });
        fs.writeFileSync('DB/Users.json', JSON.stringify(updatedUsers, null, 2));
        res.status(200).json({ message: "Товар успешно удален из корзины", backet: updatedBacket });
    }
    catch(error) {
        res.status(400).json({ message: "Ошибка при удалении товара из корзины пользователя!" });
        console.error("delete /backet", error);
    }
});

app.post("/backet", async function(req, res) {
    try {
        const token = req.headers.authorization;
        const userId = jwt_decode(token).id;
        let currentUsers = JSON.parse(fs.readFileSync('DB/Users.json', 'utf8'));
        let updatedUsers = currentUsers.map((user) => {
            if (user.id === userId) {
                return {
                    ...user,
                    backet: [
                        ...user.backet,
                        ...req.body.map(item => ({
                            id: Date.now() + Math.floor(Math.random() * 1000),
                            productId: item.id,
                            number: +item.number,
                            variation: item.variation
                        }))
                    ]
                };
            } else return user;
        });
        fs.writeFileSync('DB/Users.json', JSON.stringify(updatedUsers, null, 2));
        res.status(200).json({ message: "Товар успешно добавлен в корзину" });
    }
    catch(error) {
        res.status(400).json({ message: "Ошибка при добавлении товара в корзину пользователя!" });
        console.error("post /backet", error);
    }
});

// Stores
app.get('/stores/addresses', (req, res) => {
    const stores = JSON.parse(fs.readFileSync('DB/Pickups.json', 'utf8'));
    res.status(200).json(stores);
});

// Orders
app.get('/orders', async (req, res) => {
    try {
        const ordersData = JSON.parse(fs.readFileSync('DB/Orders.json', 'utf8'));
        res.status(200).json(ordersData);
    } catch(error) {
        res.status(400).json({ message: "Ошибка при получении данных заказов" });
        console.error("get /orders", error);
    }
});
// Stores
app.get('/stores/addresses', (req, res) => {
    const stores = JSON.parse(fs.readFileSync('DB/Pickups.json', 'utf8'));
    res.status(200).json(stores);
});



// UserDeliveryData
app.get('/user/data-delivery/:userid', async (req, res) => {
    try {
        const token = req.headers.authorization;
        const userId = jwt_decode(token).id;
        const deliveryData = JSON.parse(fs.readFileSync('DB/UserDeliveryData.json', 'utf8'));
        const userDeliveryData = deliveryData.find((data) => data.userId === userId);
        if (!userDeliveryData) {
            return res.status(200).json(null);
        }
        res.status(200).json(userDeliveryData);
    } catch (error) {
        res.status(400).json({ message: "Ошибка при получении данных доставки" });
        console.error("get /delivery", error);
    }
});

    app.put('/backet/updateCart', (req, res) => {
        res.status(200).json({ message: "Корзина успешно обновлена", cart: req.body });
    });


//Warehouses
app.get("/warehouses", async function (req, res) {
    try {
        let currentStores = JSON.parse(fs.readFileSync('DB/Warehouses.json', 'utf8'));
        let currentProducts = JSON.parse(fs.readFileSync('DB/Products.json', 'utf8'));

        let storesInfo = currentStores.map((store) => {
            return (
              {
                  ...store,
                  products: store.products.map((product) => {
                      const foundedProduct = currentProducts.find(el => el.id === product.productId);
                      return {
                          ...product,
                          productInfo: foundedProduct
                      };
                  })
              }
            );
        });

        res.status(200).json({ message: "Данные о товарах успешно получены", stores: storesInfo });
    } catch (error) {
        res.status(400).json({ message: "Ошибка при получении информации о складах" });
        console.error("get /warehouses", error);
    }
});


app.get("/order", async function(req, res) {
    try {
        const currentOrders = JSON.parse(fs.readFileSync('DB/Orders.json', 'utf8'));
        const choosenOrder = currentOrders.find((order) => order.orderId === Number(req.query.id));
        res.status(200).json({ message: "Данные о заказе успешно получены", order: choosenOrder });
    }
    catch(error) {
        console.error("get /order", error);
        res.status(400).json({ message: "Ошибка получения данных о заказе!" });
    }
});

//Favorites
app.get("/favorites", async function (req, res) {
    try {
        const token = req.headers.authorization;
        const userId = jwt_decode(token).id;
        let currentUsers = JSON.parse(fs.readFileSync('DB/Users.json', 'utf8'));
        let currentProducts = JSON.parse(fs.readFileSync('DB/Products.json', 'utf8'));
        const user = currentUsers.filter(user => user.id === userId)[0];
        const userFavorites = currentProducts.reduce((prev, product) => {
            if (user.favorites.includes(product.id)) {
                return [...prev, product];
            }
            return prev;
        }, []);
        res.status(200).json({
            message: "Успешное получение данных об избранных товарах!",
            favorites: userFavorites
        });
    } catch (error) {
        res.status(400).json({ message: "Ошибка при получении избранных товаров!" });
        console.error("get /favourites", error);
    }
});

//Warehouses
app.get("/warehouses", async function (req, res) {
    try {
        let currentStores = JSON.parse(fs.readFileSync('DB/Warehouses.json', 'utf8'));
        let currentProducts = JSON.parse(fs.readFileSync('DB/Products.json', 'utf8'));

        let storesInfo = currentStores.map((store) => {
            return (
                {
                    ...store,
                    products: store.products.map((product) => {
                        const foundedProduct = currentProducts.find(el => el.id === product.productId);
                        return {
                            ...product,
                            productInfo: foundedProduct
                        };
                    })
                }
            );
        });
        res.status(200).json({ message: "Данные о товарах успешно получены", stores: storesInfo });
    }
    catch (error) {
        res.status(400).json({ message: "Ошибка при получении информации о складах" });
        console.error("get /warehouses", error);
    }
});


// categories

    app.get("/category", async function (req, res) {
        try {
            let currentCategoryList = JSON.parse(fs.readFileSync('DB/Categories.json', 'utf8'));
            res.status(200).json({ message: "Данные о категориях получены", categoryList: currentCategoryList });
        } catch (error) {
            console.error("get /category", error);
            res.status(400).json({ message: "Ошибка получения данных о категории!" });
        }
    });

    app.post("/category", async function (req, res) {
        try {
            let currentCategoryList = JSON.parse(fs.readFileSync('DB/Categories.json', 'utf8'));
            res.status(200).json({ message: "Добавлена новая категория", category: req.body });
        } catch (error) {
            console.error("get /category", error);
            res.status(400).json({ message: "Ошибка добавления категории!" });
        }
    });

    app.put("/category", async function (req, res) {
        try {
            let currentCategoryList = JSON.parse(fs.readFileSync('DB/Categories.json', 'utf8'));
            res.status(200).json({ message: "Категория обновлена", category: req.body });
        } catch (error) {
            console.error("get /category", error);
            res.status(400).json({ message: "Ошибка обновления данных о категории!" });
        }
    });

    app.delete("/category", async function (req, res) {
        try {
            let currentCategoryList = JSON.parse(fs.readFileSync('DB/Categories.json', 'utf8'));
            res.status(200).json({ message: "Категория удалена", category: req.body });
        } catch (error) {
            console.error("get /category", error);
            res.status(400).json({ message: "Ошибка удаления категории!" });
        }
    });

// providers
app.get("/providers", async function(req, res) {
    try {
        let currentProvidersList = JSON.parse(fs.readFileSync('DB/Providers.json', 'utf8'));
        res.status(200).json({ message: "Данные о поставщиках успешно получены", providers: currentProvidersList });
    }
    catch(error) {
        console.error("get /providers", error);
        res.status(400).json({ message: "Ошибка получения данных о поставщиках!" });
    }
});

app.post("/providers", async function(req, res) {
    try {
        let currentProvidersList = JSON.parse(fs.readFileSync('DB/Providers.json', 'utf8'));
        res.status(200).json({ message: "Данные о поставщике сохранены", provider: req.body });
    }
    catch(error) {
        console.error("post /providers", error);
        res.status(400).json({ message: "Ошибка сохранения данных о поставщике!" });
    }
});

app.put("/providers", async function(req, res) {
    try {
        let currentProvidersList = JSON.parse(fs.readFileSync('DB/Providers.json', 'utf8'));
        res.status(200).json({ message: "Данные о поставщике сохранены", provider: req.body });
    }
    catch(error) {
        console.error("post /providers", error);
        res.status(400).json({ message: "Ошибка сохранения данных о поставщике!" });
    }
});

app.delete("/providers", async function(req, res) {
    try {
        let currentProvidersList = JSON.parse(fs.readFileSync('DB/Providers.json', 'utf8'));
        res.status(200).json({ message: "Данные о поставщике удалены", provider: req.body });
    }
    catch(error) {
        console.error("delete /providers", error);
        res.status(400).json({ message: "Ошибка удаленя данных о поставщике!" });
    }
});

//Chat endpoints
app.post("/chat/pin", async function(req, res) {
    try {
        let currentChats = JSON.parse(fs.readFileSync('DB/Chats.json', 'utf8'));
        let currentUsers = JSON.parse(fs.readFileSync('DB/Users.json', 'utf8'));
        let updatedChats = currentChats.map((chat) => {
            if (chat.id === req.body.id) {
                return {
                    ...chat,
                    fixed: chat.fixed ? false : true
                };
            }
            else return chat;
        });
        let detailedChatsInfo = updatedChats.map(chat => {
            return {
                ...chat,
                members: currentUsers.filter(user => chat.members.includes(user.id))
            };
        });
        fs.writeFileSync('DB/Chats.json', JSON.stringify(updatedChats, null, 2));
        res.status(200).json({ message: "Успешное закрепление чата", chats: detailedChatsInfo });
    }
    catch (error) {
        res.status(400).json({ message: "Ошибка при закреплении чата" });
        console.error(error);
    }
});

app.get("/chats", async function(req, res) {
    try {
        const token = req.headers.authorization;
        const userId = jwt_decode(token).id;
        let currentChats = JSON.parse(fs.readFileSync('DB/Chats.json', 'utf8'));
        let currentUsers = JSON.parse(fs.readFileSync('DB/Users.json', 'utf8'));
        let chats = currentChats.filter((chat) => chat.members.includes(userId));
        let opponentInfo = currentUsers.find(user => (user.id !== userId && chats[0].members.includes(user.id)));

        res.status(200).json({ message: "Данные о чатах успешно получены", chats: chats, opponentInfo: opponentInfo ? {
            id: opponentInfo.id,
            avatar: opponentInfo.avatar
        } : {} });
    }
    catch(error) {
        console.error("get /chats", error);
        res.status(400).json({ message: "Ошибка получения данных о чатах!" });
    }
});

app.get("/admin/chats", async function(req, res) {
    try {
        let currentChats = JSON.parse(fs.readFileSync('DB/Chats.json', 'utf8'));
        let currentUsers = JSON.parse(fs.readFileSync('DB/Users.json', 'utf8'));

        let detailedChatsInfo = currentChats.map(chat => {
            return {
                ...chat,
                members: currentUsers.filter(user => chat.members.includes(user.id))
            };
        });

        res.status(200).json({ message: "Данные о чатах успешно получены", chats: currentChats, detailedChatsInfo: detailedChatsInfo });
    }
    catch(error) {
        console.error("get /admin/chats", error);
        res.status(400).json({ message: "Ошибка получения данных о чатах!" });
    }
});

app.post("/admin/chat", async function(req, res) {
    try {
        const token = req.headers.authorization;
        const userId = jwt_decode(token).id;
        const choosenChat = req.body;
        const currentChats = JSON.parse(fs.readFileSync('DB/Chats.json', 'utf8'));
        const currentUsers = JSON.parse(fs.readFileSync('DB/Users.json', 'utf8'));

        let updatedChats = currentChats.map((chat) => {
            if (chat.id === choosenChat.id && !chat.members.includes(userId)) {
                return {
                    ...chat,
                    members: chat.members.map(id => {
                        if (id === null) {
                            return userId;
                        }
                        return id;
                    }),
                    messages: chat.messages.map((message) => {
                        return {
                            ...message,
                            recipientId: message.recipientId === null ? userId : message.recipientId,
                            senderId: message.senderId === null ? userId : message.senderId
                        };
                    })
                };
            }
            return chat;
        });
        fs.writeFileSync('DB/Chats.json', JSON.stringify(updatedChats, null, 2));

        let chat = updatedChats.find(chat => chat.id === choosenChat.id);
        let opponentInfo = currentUsers.find(user => (user.id !== userId && chat.members.includes(user.id)));

        res.status(200).json({ message: "Успешное закрепление за чатом", chat: chat, opponentInfo: opponentInfo });
    }
    catch (error) {
        res.status(400).json({ message: "Ошибка закрепления админа за чатом" });
        console.error("post /admin/chat", error);
    }
});

app.post("/upload", async function (req, res) {
    try {
        if (req.files && Object.keys(req.files).length !== 0) {
            const uploadedFiles = req.files.files.length > 0 ? req.files.files : [req.files.files];
            let files = [];
            uploadedFiles.map((file) => {
                let fileName = Buffer.from(file.name, 'latin1').toString('utf8');
                let currentDate = Date.now();
                const uniqueFileStats = `${ currentDate + file.size + fileName }`;
                file.mv(`./staticFiles/chatfiles/${ uniqueFileStats  }`, function (err) {
                    if (err) {
                        console.log(err);
                    } 
                });
                files = [...files, {
                    url: `http://localhost:5000/chatfiles/${ uniqueFileStats }`,
                    name: fileName,
                    size: file.size
                }];
            });
            res.status(200).json({ message: "Файлы успешно загружены", files: files });
        } 
    }
    catch (error) {
        res.status(400).json({ message: "Ошибка загрузки файлов", files: [] });
        console.error(error);
    }
});

app.post("/chats/messages", async function(req, res) {
    try {
        const currentChats = JSON.parse(fs.readFileSync('DB/Chats.json', 'utf8'));
        const updatedChats = currentChats.map((chat) => {
            if (chat.id === req.body.chat.id) {
                return {
                    ...chat,
                    messages: chat.messages.map(message => {
                        if (message.id === Number(req.body.messageId)) {
                            return {
                                ...message,
                                checked: true
                            };
                        } else return message;
                    })
                };
            }
            else return chat;
        });
        fs.writeFileSync('DB/Chats.json', JSON.stringify(updatedChats, null, 2));
        res.status(200).json({ message: "Статус сообщения успешно изменён" });
    }
    catch (error) {
        res.status(400).json({ message: "Ошибка смены статуса сообщения!" });
        console.error(error);
    }
});

app.post("/chats/messages/reaction", async function(req, res) {
    try {
        const currentChats = JSON.parse(fs.readFileSync('DB/Chats.json', 'utf8'));
        let userChat = null;
        const updatedChats = currentChats.map((chat) => {
            if (chat.id === req.body.chat.id) {
                userChat = {
                    ...chat,
                    messages: chat.messages.map(message => {
                        if (message.id === Number(req.body.messageId)) {
                            return {
                                ...message,
                                reactions: message.reactions === "" ? "reaction" : ""
                            };
                        } else return message;
                    })
                };
                return userChat;
            }
            else return chat;
        });
        fs.writeFileSync('DB/Chats.json', JSON.stringify(updatedChats, null, 2));
        res.status(200).json({ message: "Реакция на сообщение успешно изменена", chat: userChat });
    }
    catch (error) {
        res.status(400).json({ message: "Ошибка смены реакции на сообщение!" });
        console.error(error);
    }
});

//Chat websocket
const wss = new WebSocket.Server({ server });
let clients = [];

wss.on('connection', (ws) => {
    clients = [...clients, { userws: ws, userId: jwt_decode(ws.protocol).id }];

    ws.on('message', async (message) => {
        try {
            const newMessageData = JSON.parse(message);
            const senderId = jwt_decode(newMessageData.senderToken).id;
            const recipientId = newMessageData.recipientId;
            let currentChats = JSON.parse(fs.readFileSync('DB/Chats.json', 'utf8'));

            let isChatExists = currentChats.filter((chat) => {
                if (chat.members.includes(senderId) && chat.members.includes(recipientId)) {
                    return true;
                }
                return false;
            });

            if (isChatExists.length > 0) {
                const newChats = currentChats.map((chat) => {
                    if (isChatExists[0].id === chat.id) {
                        return {
                            ...chat,
                            messages: [ ...chat.messages, {
                                id: Date.now(),
                                senderId,
                                recipientId,
                                date: newMessageData.date,
                                text: newMessageData.message,
                                files: newMessageData.files,
                                reactions: "",
                                checked: false
                            } ]
                        };
                    } else return chat;
                });
                fs.writeFileSync('DB/Chats.json', JSON.stringify(newChats, null, 2));
            }
            else {
                currentChats = [ ...currentChats, {
                    id: Date.now(),
                    members: [senderId, null],
                    messages: [{
                        id: Date.now(),
                        senderId,
                        recipientId: null,
                        date: newMessageData.date,
                        text: newMessageData.message,
                        files: newMessageData.files,
                        reactions: "",
                        checked: false
                    }]
                } ];
                fs.writeFileSync('DB/Chats.json', JSON.stringify(currentChats, null, 2));
            }

            clients.map((client) => {
                if (client.userId === recipientId || client.userId === senderId) {
                    if (isChatExists.length > 0) {
                        client.userws.send(JSON.stringify({
                            ...isChatExists[0],
                            messages: [...isChatExists[0].messages, {
                                id: Date.now(),
                                senderId: senderId,
                                recipientId: recipientId,
                                date: newMessageData.date,
                                text: newMessageData.message,
                                files: newMessageData.files,
                                reactions: "",
                                checked: false
                            }]
                        }));
                    } else {
                        client.userws.send(JSON.stringify({
                            ...currentChats[currentChats.length - 1],
                            messages: [{
                                id: Date.now(),
                                senderId: senderId,
                                recipientId: null,
                                date: newMessageData.date,
                                text: newMessageData.message,
                                files: newMessageData.files,
                                reactions: "",
                                checked: false
                            }]
                        }));
                    }
                }
            });
        }
        catch (error) {
            console.log(error);
        }
    });

    ws.on('close', () => {
        console.log("Соединение закрыто!");
    });
});
// feedbacks

app.get("/feedbacks", async function(req, res) {
    try {
        const feedbacksList = JSON.parse(fs.readFileSync('DB/Feedbacks.json', 'utf8'));
        const userId = +req.query.userId;
        const userFeedbacks = feedbacksList.filter(feedback => feedback.userId === userId);

        res.status(200).json({ message: "Данные о заявках обратной связи получены", feedbacks:
            JSON.parse(req.query.userId) ? userFeedbacks : feedbacksList
        });
    }
    catch(error) {
        console.error("get /feedbacks", error);
        res.status(400).json({ message: "Ошибка получения данных о заявках обратной связи!" });
    }
});

app.post("/feedbacks", async function(req, res) {
    try {
        res.status(200).json({ message: "Данные о заявке с обратной связью сохранены", feedbacks: req.body });
    }
    catch(error) {
        console.error("post /feedbacks", error);
        res.status(400).json({ message: "Ошибка сохранения данных о заявке с обратной связью!" });
    }
});

app.put("/feedbacks", async function(req, res) {
    try {
        res.status(200).json({ message: "Данные о заявке с обратной связью обновлены", feedbacks: req.body });
    }
    catch(error) {
        console.error("put /feedbacks", error);
        res.status(400).json({ message: "Ошибка обновления данных о заявке с обратной связью!" });
    }
});

app.delete("/feedbacks", async function(req, res) {
    try {
        const feedbackId = req.query.feedbackId;
        res.status(200).json({ message: "Данные о заявке с обратной связью удалены", feedbackId: feedbackId });
    }
    catch(error) {
        console.error("delete /feedbacks", error);
        res.status(400).json({ message: "Ошибка удаления данных о заявке с обратной связью!" });
    }

});

// feeback types

app.get("/feedback-types", async function(req, res) {
    try {
        let typesList = JSON.parse(fs.readFileSync('DB/FeedbacksTypes.json', 'utf8'));
        res.status(200).json({ message: "Данные о типах заявки получены", types: typesList });
    }
    catch(error) {
        console.error("get /feedback-types", error);
        res.status(400).json({ message: "Ошибка получения данных о типах заявки" });
    }

});

//Invoices
app.get("/invoices", async function(req, res) {
    try {
        let currentInvoices = JSON.parse(fs.readFileSync('DB/Invoices.json', 'utf8'));
        res.status(200).json({ message: "Накладные успешно получены", invoices: currentInvoices });
    }
    catch (error) {
        res.status(400).json({ message: "Ошибка получения накладных!" });
        console.error(error);
    }
});
// discounts

app.get("/discounts", async function(req, res) {
    try {
        let discountsList = JSON.parse(fs.readFileSync('DB/Discounts.json', 'utf8'));
        res.status(200).json({ message: "Данные об акциях получены", discounts: discountsList });
    }
    catch(error) {
        console.error("get /discounts", error);
        res.status(400).json({ message: "Ошибка получения данных об акциях!" });
    }
});

app.post("/discounts", async function(req, res) {
    try {
        let discountsList = JSON.parse(fs.readFileSync('DB/Discounts.json', 'utf8'));
        res.status(200).json({ message: "Данные об акциях сохранены", discount: req.body });
    }
    catch(error) {
        console.error("post /discounts", error);
        res.status(400).json({ message: "Ошибка сохранения данных об акциях!" });
    }
});

app.put("/discounts", async function(req, res) {
    try {
        let discountsList = JSON.parse(fs.readFileSync('DB/Discounts.json', 'utf8'));
        res.status(200).json({ message: "Данные об акции обновлены", discount: req.body });
    }
    catch(error) {
        console.error("post /discounts", error);
        res.status(400).json({ message: "Ошибка обновления данных об акциии!" });
    }
});

app.delete("/discounts", async function(req, res) {
    try {
        let discountsList = JSON.parse(fs.readFileSync('DB/Discounts.json', 'utf8'));
        res.status(200).json({ message: "Данные об акции удалены", discount: req.body });
    }
    catch(error) {
        console.error("delete /discounts", error);
        res.status(400).json({ message: "Ошибка удаления данных об акции!" });
    }
});

// statistic

app.get("/statistic/orders", async function(req, res) {
    try {
        let { dateFrom, dateTo, userId } = req.query;
        const minDate = new Date(dateFrom);
        const maxDate = new Date(dateTo);
    
        let ordersList = JSON.parse(fs.readFileSync('DB/Orders.json', 'utf8'));
        let productList = JSON.parse(fs.readFileSync('DB/Products.json', 'utf8'));
        let deliveryTimeAmount = 0;
        const inithialStatistic = {
            countOfOrders: 0,
            deliveredCount: 0,
            inTransitCount: 0,
            paymentsInfo: {},
            courierCount: 0,
            pickupCount: 0,
            averageTimeOfDeliveryHours: 0,
            averageAmountOfOrder: 0,
            amountPriceOfOrders: 0,
            productsStats: {},
        };
        const statisticInfo = ordersList.reduce((statistic, order, index) => {
            const orderCreationDate = new Date(order.createdAt);
            if (userId !== "null" && Number(userId) !== order.userId) { 
                return statistic;
            }
            if (orderCreationDate > maxDate || orderCreationDate < minDate) {
                return statistic;
            }
            statistic.countOfOrders = statistic.countOfOrders + 1;
            statistic.amountPriceOfOrders = statistic.amountPriceOfOrders + order.orderPrice;
            if (order.orderStatus === "delivered") {
                statistic.deliveredCount = statistic.deliveredCount + 1;
                
                const createdDate = new Date(order.createdAt).getTime();
                const deliveredDate = new Date(order.deliveredAt).getTime();
                deliveryTimeAmount = deliveryTimeAmount + deliveredDate - createdDate;
            }
            if (order.orderStatus === "in-transit") {
                statistic.inTransitCount = statistic.inTransitCount + 1;
            }
            if (order.deliveryMethod === "courier") {
                statistic.courierCount = statistic.courierCount + 1;
            }
            if (order.deliveryMethod === "pickup") {
                statistic.pickupCount = statistic.pickupCount + 1;
            }
            if (statistic.paymentsInfo[order.paymentMethod]) {
                statistic.paymentsInfo[order.paymentMethod].count 
                    = statistic.paymentsInfo[order.paymentMethod].count + 1;
                statistic.paymentsInfo[order.paymentMethod].amount 
                    = statistic.paymentsInfo[order.paymentMethod].amount + order.orderPrice;
            } else {
                statistic.paymentsInfo[order.paymentMethod] = { 
                    count: 1, 
                    type: order.paymentMethod,
                    amount: order.orderPrice
                };
            }

            order.products.forEach((productInfo) => {
                const productStats = statistic.productsStats[productInfo.id];
                const findedProduct = productList.find(el => el.id === productInfo.id);
                const findedVariation = findedProduct?.variations.find(el => el.name === productInfo.variation);

                if (productStats) {
                    productStats.count = productStats.count + productInfo.number;
                    productStats.amount = 
                        productStats.amount + productInfo.number * findedVariation.price;
                    productStats.ordersCount = productStats.ordersCount + 1;
                } else {
                    statistic.productsStats[productInfo.id] = {
                        count: productInfo.number,
                        amount: productInfo.number * findedVariation.price,
                        ordersCount: 1,
                        name: findedProduct.name,
                        images: findedProduct.images,
                        categories: findedProduct.category
                    };
                }
            });
            if (index === ordersList.length - 1) {
                productList.forEach(product => {
                    if (!statistic.productsStats[product.id]) {
                        statistic.productsStats[product.id] = {
                            count: 0,
                            amount: 0,
                            name: product.name,
                            images: product.images,
                            ordersCount: 0,
                            categories: product.category
                        };
                    }
                });
            }
            statistic.averageTimeOfDeliveryHours = Math.floor(deliveryTimeAmount / statistic.deliveredCount / 3600000);
            statistic.averageAmountOfOrder = Math.floor(statistic.amountPriceOfOrders / statistic.countOfOrders);
            return statistic;
        }, inithialStatistic);
        res.status(200).json({ message: "Статистика по товарам получена", statistic: statisticInfo });
    }
    catch(error) {
        console.error("get /statistic/products", error);
        res.status(400).json({ message: "Ошибка получния статистики о товарах!" });
    }
});

app.get("/statistic/places", async function(req, res) {
    try {
        let ordersList = JSON.parse(fs.readFileSync('DB/Orders.json', 'utf8'));
        res.status(200).json({ message: "Статистика по местам доставки получены", statistic: ordersList });
    }
    catch(error) {
        console.error("get /statistic/places", error);
        res.status(400).json({ message: "Ошибка получения статистики о местах доставки!" });
    }
});

app.get("/static-pages", async function(req, res) {
    try {
        const pageList = JSON.parse(fs.readFileSync('DB/StaticPages.json', 'utf8'));
        const pageWithJoinedContent = pageList.map(page => {
            const pageContent = JSON.parse(fs.readFileSync(`staticFiles/static-pages/${page.content}`, 'utf8'));
            return {
                ...page,
                content: pageContent
            };
        });
        res.status(200).json({ message: "Статические страницы получены", pages: pageWithJoinedContent });
    }
    catch(error) {
        console.error("get /static-pages", error);
        res.status(400).json({ message: "Ошибка получения статических страниц!" });
    }
});

app.get("/static-page", async function(req, res) {
    try {
        const { id } = req.query;
        const pageList = JSON.parse(fs.readFileSync('DB/StaticPages.json', 'utf8'));
        const findedStaticPage = pageList.find(el => el.id === Number(id));
        if (findedStaticPage && findedStaticPage.isPublished) {
            const pageContent = JSON.parse(fs.readFileSync(`staticFiles/static-pages/${findedStaticPage.content}`, 'utf8'));
            res.status(200).json({ 
                message: "Статическая страница получена", 
                page: {
                    ...findedStaticPage,
                    content: pageContent
                }
            });
        } else {
            res.status(200).json({ 
                message: "Статическая страница недоступна", 
                page: null 
            });
        }
    }
    catch(error) {
        console.error("get /static-page", error);
        res.status(400).json({ message: "Ошибка получения статической страницы!" });
    }
});

app.put("/static-page", async function(req, res) {
    try {
        const { id } = req.query;
        const pageList = JSON.parse(fs.readFileSync('DB/StaticPages.json', 'utf8'));
        const findedPage = pageList.find(el => el.id === Number(id)); 
        fs.writeFileSync(`staticFiles/static-pages${findedPage.content}`, JSON.stringify(req.body.content));
        const updatedPageList = pageList.map(el => {
            if (el.id === Number(id)) {
                return {
                    ...el,
                    title: req.body.title,
                    menuTitle: req.body.menuTitle,
                    description: req.body.description,
                    isPublished: req.body.isPublished
                };
            }
            return el;
        });
        fs.writeFileSync('DB/StaticPages.json', JSON.stringify(updatedPageList, null, 2));
        res.status(200).json({
            message: "Статическая страница успешно обновлена", 
            pages: updatedPageList 
        });
    }
    catch(error) {
        console.error("put /static-page", error);
        res.status(400).json({ message: "Ошибка обновления статической страницы!" });
    }
});

app.post("/static-page", async function(req, res) {
    try {
        const { content, title, description, menuTitle, isPublished } = req.body;
        const pageList = JSON.parse(fs.readFileSync('DB/StaticPages.json', 'utf8'));
        const newStaticPage = {
            id: Date.now(),
            content,
            title,
            description,
            menuTitle,
            isPublished
        };
        fs.writeFileSync(`staticFiles/static-pages/static-${newStaticPage.id}.txt`, JSON.stringify(newStaticPage.content));
        const updatedPageList = [
            ...pageList,
            { ...newStaticPage, content: `/static-${newStaticPage.id}.txt` }
        ];
        fs.writeFileSync('DB/StaticPages.json', JSON.stringify(updatedPageList, null, 2));
        res.status(200).json({
            message: "Статическая страница успешно создана", 
            pages: updatedPageList
        });
    }
    catch(error) {
        console.error("post /static-page", error);
        res.status(400).json({ message: "Ошибка создания статической страницы!" });
    }
});

const isDateWithin15Minutes = (date) => {
    let currentDate = new Date(Date.now());
    let paramDate = new Date(date);
    const diff = Math.abs(currentDate - paramDate);
    return diff < 900000;
};

cron.schedule('*/15 * * * *', () => {
    let currentChats = JSON.parse(fs.readFileSync('DB/Chats.json', 'utf8'));
    let updatedChats = currentChats.map((chat) => {
        let isClear = false;
        if (!chat.fixed) {
            let array = [...chat.messages].reverse();
            let adminLastMsg = array.find(msg => msg.senderId !== chat.messages[0].senderId);
            if (adminLastMsg) {
                isClear = !isDateWithin15Minutes(adminLastMsg.date);
            }
            if (isClear) {
                return {
                    ...chat,
                    members: chat.members.map(memberId => {
                        if (memberId === chat.messages[0].senderId) {
                            return memberId;
                        } else return null;
                    }),
                    messages: chat.messages.map(message => {
                        return {
                            ...message,
                            recipientId: message.recipientId !== chat.messages[0].senderId ? null : message.recipientId,
                            senderId: message.senderId !== chat.messages[0].senderId ? null : message.senderId
                        };
                    })
                };
            } else return chat;
        }
        else return chat;
    });
    fs.writeFileSync('DB/Chats.json', JSON.stringify(updatedChats, null, 2));
});

async function startApp() {
    try {
        server.listen(PORT, () => console.log('Server started at PORT' + " " + PORT));
    } catch (error) {
        console.log(error);
    }
}

startApp();
