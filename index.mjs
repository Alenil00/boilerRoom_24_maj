import oExpress from "express";
import products from "./data/products.js";
import users from "./data/users.js";

let app = oExpress();

const PORT = 3008;

//middleware för att reqest.body kan defineras
app.use(oExpress.json());

//middleware för att läsa in ejs-filer (statiskt)
app.set("view engine", "ejs");

//serve static files
app.use(oExpress.static('public'));

//GET STARTVY
app.get("/api/products" , (_request, _response) => {
    _response.status(200).render("index", {products : products})
})

// GET KATEGORI VY
app.get("/api/products/:category", (_request, _response) => {
    const category = _request.params.category.replace(/-/g, ' ').toLowerCase();
    const categoryProducts = products.find(product => product.category.toLowerCase() === category);

    if (categoryProducts) {
        _response.status(200).render("categoryPage", { 
            category: categoryProducts.category, 
            items: categoryProducts.items,
            allCategories: products , // Pass all categories for navigation
        });
    } else {
        _response.status(404).send("Category not found");
    }
});

// GET PRODUKTDETALJER VY
app.get("/api/products/:category/:id", (_request, _response) => {
    const categoryId = parseInt(_request.params.category);
    const itemId = parseInt(_request.params.id);

    // Find the category based on the provided ID
    const specificCategory = products.find(category => category.id === categoryId);

    if (!specificCategory) {
        // If the category is not found, return a 404 status and message
        return _response.status(404).send("Category not found");
    }

    // Find the item within the category based on the provided ID
    const specificItem = specificCategory.items.find(item => item.id === itemId);

    if (!specificItem) {
        // If the item is not found within the category, return a 404 status and message
        return _response.status(404).send("Item not found");
    }

    // Render the productDetail view with the specific item and all categories
    _response.status(200).render("productDetail", { item: specificItem, allCategories: products });
});




// app.post("/api/:category", (_request, _response) => {
//     let {
//       body,
//       params: { category },
//     } = _request;
  
//     let oCategory = products.find((product) => product.category === category);
  
//     const newItem = {
//       id: oCategory.item.length
//         ? oCategory.item[oCategory.item.length - 1].id + 1
//         : 1,
//       ...body,
//       price: _request.body.price,
//       size: _request.body.size,
//     };
  
//     oCategory.item.push(newItem);
//     _response.status(201).json(newItem);
  
//     if (!category) {
//       return _response.status(404).send("404: Gör om Gör rätt!");
//     }
//   });
  
//   app.patch("/api/:category/:itemId", (_request, _response) => {
//     const {
//       body,
//       params: { category, itemId },
//     } = _request;
  
//     let oCategory = products.find((product) => product.category === category);
  
//     if (!oCategory) {
//       return _response.status(404).send("Category not found");
//     }
  
//     let itemToUpdate = oCategory.item.find((item) => item.id == itemId);
  
//     if (!itemToUpdate) {
//       return _response.status(404).send("Item not found");
//     }
  
//     // Object.assign() is a method in JavaScript used for copying the values of all enumerable own properties from one or more source objects to a target object. It returns the target object.
//     Object.assign(itemToUpdate, body);
//     _response.status(200).json(itemToUpdate);
//   });
  
//   app.delete("/api/:category/:itemId", (_request, _response) => {
//     const {
//       params: { category, itemId },
//     } = _request;
  
//     // Find the category
//     let oCategory = products.find((product) => product.category === category);
  
//     if (!oCategory) {
//       return _response.status(404).send("Category not found");
//     }
  
//     // Find the item within the category
//     let index = oCategory.item.findIndex((item) => item.id == itemId);
  
//     if (index === -1) {
//       return _response.status(404).send("Item not found");
//     }
  
//     // Remove the item from the category's items array
//     const deletedItem = oCategory.item.splice(index, 1)[0];
  
//     _response.status(200).json(deletedItem);
//   });
  
//   // get endpoints
//   app.get("/", (_request, _response) => {
//     _response.status(200).send("Welcome to the start page... This is it!");
//   });
  
//   app.get("/api/products", (_request, _response) => {
//     _response.status(200).send(products);
//   });
  

// //GET USERS
// app.get("/api/users", (_request, _response) => {
//     _response.status(200).json(users);
// })

// app.get("/api/users/:id", (_request, _response) => {
//     let id = parseInt(_request.params.id);

//     if(isNaN(id)) {
//         return _response.status(400).send("400 error, bad request. invalid id");
//     }

//     let specUser = users.find((user) => {
//         return user.id === id;
//     })

//     if(!specUser) return _response.status(404).send(`404 page not found, no user with id ${id} found. `)

//     _response.status(200).json(specUser);
// })


// //POST USER
// app.post("/api/users", (_request, _response) => {
//     let {body} = _request;

//     let addNewUser = {
//         id: users[users.length -1].id + 1, ...body
//     }

//     users.push(addNewUser);

//     _response.status(201).send(addNewUser);
// })


// //PUT USER
// app.put("/api/users/:id", (_request, _response) => {
//     let {body, params: {id}} = _request;

//     let userId = parseInt(id);

//     if(isNaN(userId)) {
//         return _response.status(400).send(`400 bad request, please enter a number`)
//     }

//     let userIndex = users.findIndex((user) => {
//         return user.id === userId
//     })

//     if (userIndex === -1) {
//         return _response.status(404).send("404, user not found");
//     }

//     users[userIndex] = {id: userId, ...body};

//     _response.status(200).send(users[userIndex]);
// })



// //PATCH USER
// app.patch("/api/users/:id", (_request, _response) => {
//     let {body, params: {id}} = _request;

//     let userId = parseInt(id);

//     if(isNaN(userId)) {
//         return _response.status(400).send(`400 bad request, please enter a number`)
//     }

//     let userIndex = users.findIndex((user) => {
//         return user.id === userId
//     })

//     if (userIndex === -1) {
//         return _response.status(404).send("404, user not found");
//     }

//     users[userIndex] = {...users[userIndex], ...body};

//     _response.status(200).send(users[userIndex]);
// })


// //DELETE USER
// app.delete("/api/users/:id", (_request, _response) => {
//     let {params: { id } } = _request;

//     let userId = parseInt(id);

//     if (isNaN(userId)) {
//         return _response.status(400).send("400 bad request, please enter a number"); // Bad Request
//     }

//     let userIndex = users.findIndex((user) => user.id === userId);


//     if (userIndex === -1) {
//         return _response.status(404).send("404, page not found, userId not found");
//     }

//     //raderar fr.o.m. userIndex och raderar bara 1 (index, 1)
//     users.splice(userIndex, 1);

//     _response.status(200).send(`user deleted successfully`);
// })



app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`)
});