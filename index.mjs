import oExpress from "express";
import products from "./data/products.js";
import users from "./data/users.js";

let app = oExpress();

const PORT = 3008;

// Middleware for parsing request body
app.use(oExpress.json());

// Middleware for serving EJS files (static)
app.set("view engine", "ejs");

// Serve static files
app.use(oExpress.static('public'));

// GET HOME VIEW
app.get("/api/products", (_request, _response) => {
    _response.status(200).render("index", { products: products });
});

// GET CATEGORY VIEW
app.get("/api/products/:category", (_request, _response) => {
    const category = _request.params.category;

    const categoryProducts = products.find(product => product.category.toLowerCase() === category.toLowerCase());

    if (categoryProducts) {
        _response.status(200).render("categoryPage", {
            category: categoryProducts.category,
            items: categoryProducts.items,
            allCategories: products, // Pass all categories for navigation
        });
    } else {
        _response.status(404).send("Category not found");
    }
});

// GET PRODUCT DETAIL VIEW
app.get("/api/products/:category/:id", (_request, _response) => {
    const category = _request.params.category.replace(/-/g, ' ').toLowerCase();
    const itemId = parseInt(_request.params.id);

    const specificCategory = products.find(cat => cat.category.toLowerCase() === category);

    if (!specificCategory) {
        return _response.status(404).send("Category not found");
    }

    const specificItem = specificCategory.items.find(item => item.id === itemId);

    if (!specificItem) {
        return _response.status(404).send("Item not found");
    }

    _response.status(200).render("productDetail", { item: specificItem, allCategories: products });
});

// POST NEW ITEM
app.post("/api/products/:category", (_request, _response) => {
    let {
        body,
        params: { category },
    } = _request;

    let oCategory = products.find((product) => product.category.toLowerCase() === category.toLowerCase());

    if (!oCategory) {
        return _response.status(404).send("Category not found");
    }

    const newItem = {
        id: oCategory.items.length ? oCategory.items[oCategory.items.length - 1].id + 1 : 1,
        ...body
    };

    oCategory.items.push(newItem);
    _response.status(201).json(newItem);
});

// PUT ITEM
app.put("/api/products/:category/:itemId", (_request, _response) => {
    const {
        body,
        params: { category, itemId },
    } = _request;

    let oCategory = products.find((product) => product.category.toLowerCase() === category.toLowerCase());

    if (!oCategory) {
        return _response.status(404).send("Category not found");
    }

    let itemIndex = oCategory.items.findIndex((item) => item.id == itemId);

    if (itemIndex === -1) {
        return _response.status(404).send("Item not found");
    }

    oCategory.items[itemIndex] = { id: parseInt(itemId), ...body };
    _response.status(200).json(oCategory.items[itemIndex]);
});

// PATCH ITEM
app.patch("/api/products/:category/:itemId", (_request, _response) => {
    const {
        body,
        params: { category, itemId },
    } = _request;

    let oCategory = products.find((product) => product.category.toLowerCase() === category.toLowerCase());

    if (!oCategory) {
        return _response.status(404).send("Category not found");
    }

    let itemIndex = oCategory.items.findIndex((item) => item.id == itemId);

    if (itemIndex === -1) {
        return _response.status(404).send("Item not found");
    }

    oCategory.items[itemIndex] = { ...oCategory.items[itemIndex], ...body };
    _response.status(200).json(oCategory.items[itemIndex]);
});

// DELETE ITEM
app.delete("/api/products/:category/:itemId", (_request, _response) => {
    const {
        params: { category, itemId },
    } = _request;

    let oCategory = products.find((product) => product.category.toLowerCase() === category.toLowerCase());

    if (!oCategory) {
        return _response.status(404).send("Category not found");
    }

    let itemIndex = oCategory.items.findIndex((item) => item.id == itemId);

    if (itemIndex === -1) {
        return _response.status(404).send("Item not found");
    }

    const deletedItem = oCategory.items.splice(itemIndex, 1)[0];

    _response.status(200).json(deletedItem);
});

// GET USERS
app.get("/api/users", (_request, _response) => {
    _response.status(200).json(users);
});

app.get("/api/users/:id", (_request, _response) => {
    let id = parseInt(_request.params.id);

    if (isNaN(id)) {
        return _response.status(400).send("400 error, bad request. invalid id");
    }

    let specUser = users.find((user) => {
        return user.id === id;
    });

    if (!specUser) return _response.status(404).send(`404 page not found, no user with id ${id} found.`);

    _response.status(200).json(specUser);
});

// POST USER
app.post("/api/users", (_request, _response) => {
    let { body } = _request;

    let addNewUser = {
        id: users[users.length - 1].id + 1, ...body
    };

    users.push(addNewUser);

    _response.status(201).send(addNewUser);
});

// PUT USER
app.put("/api/users/:id", (_request, _response) => {
    let { body, params: { id } } = _request;

    let userId = parseInt(id);

    if (isNaN(userId)) {
        return _response.status(400).send(`400 bad request, please enter a number`);
    }

    let userIndex = users.findIndex((user) => {
        return user.id === userId;
    });

    if (userIndex === -1) {
        return _response.status(404).send("404, user not found");
    }

    users[userIndex] = { id: userId, ...body };

    _response.status(200).send(users[userIndex]);
});

// PATCH USER
app.patch("/api/users/:id", (_request, _response) => {
    let { body, params: { id } } = _request;

    let userId = parseInt(id);

    if (isNaN(userId)) {
        return _response.status(400).send(`400 bad request, please enter a number`);
    }

    let userIndex = users.findIndex((user) => {
        return user.id === userId;
    });

    if (userIndex === -1) {
        return _response.status(404).send("404, user not found");
    }

    users[userIndex] = { ...users[userIndex], ...body };

    _response.status(200).send(users[userIndex]);
});

// DELETE USER
app.delete("/api/users/:id", (_request, _response) => {
    let { params: { id } } = _request;

    let userId = parseInt(id);

    if (isNaN(userId)) {
        return _response.status(400).send("400 bad request, please enter a number");
    }

    let userIndex = users.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
        return _response.status(404).send("404, page not found, userId not found");
    }

    users.splice(userIndex, 1);

    _response.status(200).send(`user deleted successfully`);
});

// Default GET endpoint
app.get("/", (_request, _response) => {
    _response.status(200).send("Welcome to the start page... This is it!");
});

app.get("/api/products", (_request, _response) => {
    _response.status(200).send(products);
});

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});
