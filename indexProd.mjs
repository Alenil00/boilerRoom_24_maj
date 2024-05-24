import oExpress from "express";
let app = oExpress();

const PORT = 3006;
app.use(oExpress.json());

let products = [
  {
    id: 1,
    category: "T-shirts",
    item: [
      {
        id: 1,
        price: null,
        size: "",
      },
    ],
  },
  {
    id: 2,
    category: "Tröjor",
    item: [
      {
        id: 1,
        price: null,
        size: "",
      },
    ],
  },
  {
    id: 3,
    category: "Strumpor",
    item: [
      {
        id: 1,
        price: null,
        size: "",
      },
    ],
  },
  {
    id: 4,
    category: "Jackor",
    item: [
      {
        id: 1,
        price: null,
        size: "",
      },
    ],
  },
  {
    id: 5,
    category: "Byxor",
    item: [
      {
        id: 1,
        price: null,
        size: "",
      },
    ],
  },
];

app.post("/api/:category", (_request, _response) => {
  let {
    body,
    params: { category },
  } = _request;

  let oCategory = products.find((product) => product.category === category);

  const newItem = {
    id: oCategory.item.length
      ? oCategory.item[oCategory.item.length - 1].id + 1
      : 1,
    ...body,
    price: _request.body.price,
    size: _request.body.size,
  };

  oCategory.item.push(newItem);
  _response.status(201).json(newItem);

  if (!category) {
    return _response.status(404).send("404: Gör om Gör rätt!");
  }
});

app.patch("/api/:category/:itemId", (_request, _response) => {
  const {
    body,
    params: { category, itemId },
  } = _request;

  let oCategory = products.find((product) => product.category === category);

  if (!oCategory) {
    return _response.status(404).send("Category not found");
  }

  let itemToUpdate = oCategory.item.find((item) => item.id == itemId);

  if (!itemToUpdate) {
    return _response.status(404).send("Item not found");
  }

  // Object.assign() is a method in JavaScript used for copying the values of all enumerable own properties from one or more source objects to a target object. It returns the target object.
  Object.assign(itemToUpdate, body);
  _response.status(200).json(itemToUpdate);
});

app.delete("/api/:category/:itemId", (_request, _response) => {
  const {
    params: { category, itemId },
  } = _request;

  // Find the category
  let oCategory = products.find((product) => product.category === category);

  if (!oCategory) {
    return _response.status(404).send("Category not found");
  }

  // Find the item within the category
  let index = oCategory.item.findIndex((item) => item.id == itemId);

  if (index === -1) {
    return _response.status(404).send("Item not found");
  }

  // Remove the item from the category's items array
  const deletedItem = oCategory.item.splice(index, 1)[0];

  _response.status(200).json(deletedItem);
});

// get endpoints
app.get("/", (_request, _response) => {
  _response.status(200).send("Welcome to the start page... This is it!");
});

app.get("/api/products", (_request, _response) => {
  _response.status(200).send(products);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
