import oExpress from "express";
let app = oExpress();

const PORT = 3007;
app.use(oExpress.json());



// Users data
let users = [
  {
    id: 1,
    firstName: "",
    lastName: "",
    age: null,
    userName: "",
  },
];

//POST USER
app.post("/api/users", (_request, _response) => {
  let {body} = _request;

  let addNewUser = {
      id: users[users.length -1].id + 1, ...body
  }

  users.push(addNewUser);

  _response.status(201).send(addNewUser);
})


// PUT USERS
app.put("/api/users/:id", (_request, _response) => {
  let {body, params: {id}} = _request;

  let userId = parseInt(id);

  if(isNaN(userId)) {
      return _response.status(400).send(`400 bad request, please enter a number`)
  }

  let userIndex = users.findIndex((user) => {
      return user.id === userId
  })

  if (userIndex === -1) {
      return _response.status(404).send("404, user not found");
  }

  users[userIndex] = {id: userId, ...body};

  _response.status(200).send(users[userIndex]);
})

// PATCH USERS
app.patch("/api/users/:id", (_request, _response) => {
  let {body, params: {id}} = _request;

  let userId = parseInt(id);

  if(isNaN(userId)) {
      return _response.status(400).send(`400 bad request, please enter a number`)
  }

  let userIndex = users.findIndex((user) => {
      return user.id === userId
  })

  if (userIndex === -1) {
      return _response.status(404).send("404, user not found");
  }

  users[userIndex] = {...users[userIndex], ...body};

  _response.status(200).send(users[userIndex]);
})

//DELETE USER
app.delete("/api/users/:id", (_request, _response) => {
  let {params: { id } } = _request;

  let userId = parseInt(id);

  if (isNaN(userId)) {
      return _response.status(400).send("400 bad request, please enter a number"); // Bad Request
  }

  let userIndex = users.findIndex((user) => user.id === userId);


  if (userIndex === -1) {
      return _response.status(404).send("404, page not found, userId not found");
  }

  //raderar fr.o.m. userIndex och raderar bara 1 (index, 1)
  users.splice(userIndex, 1);

  _response.status(200).send(`user deleted successfully`);
})

app.get("/", (_request, _response) => {
  _response.status(200).send("Hello to the users!")
})

app.get("/api/users", (_request, _response) => {
  _response.status(200).send(users);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
