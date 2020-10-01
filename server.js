// this import is now pulling from node_modules instead of the Node stdlib
const express = require("express");
const db = require("./database");

// create an express server instance
const server = express();

// this allows us to parse request JSON bodies,
server.use(express.json());

//Post (creating users)
server.post("/api/users", (req, res) => {
  try {
    const { name, bio } = req.body;

    if (!name || !bio) {
      res
        .status(400)
        .json({ errorMessage: "Please provide name and bio for the user." });
    } else {
      db.createUser(req.body);

      res.status(201).json(req.body);
    }
  } catch (err) {
    res.status(500).json({
      errorMessage: "There was an error while saving the user to the database",
    });
  }
});

//fetching a user
server.get("/api/users", (req, res) => {
  try {
    const user = db.getUsers();

    if (user) {
      res.status(200).json(user);
    } else {
      res
        .status(404)
        .json({ message: "The user with the specified ID does not exist." });
    }
  } catch (err) {
    res
      .status(500)
      .json({ errorMessage: "The users information could not be retrieved" });
  }
});

//fetching users specific by id
server.get("/api/users/:id", (req, res) => {
  try {
    const id = req.params.id;
    const user = db.getUserById(id);

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({
        message: "The user with the specified ID does not exist.",
      });
    }
  } catch (err) {
    res
      .status(500)
      .json({ errorMessage: "The user information could not be retrieved." });
  }
});

//deleting users by id
server.delete("/api/users/:id", (req, res) => {
  try {
    const id = req.params.id;
    const user = db.getUserById(id);

    if (user) {
      db.deleteUser(id);

      res.status(204).end();
    } else {
      res.status(404).json({
        message: "'The user with the specified ID does not exist.'",
      });
    }
  } catch (err) {
    res.status(500).json({ errorMessage: "The user could not be removed" });
  }
});

//changing data user by id
server.put("/api/users/:id", (req, res) => {
  try {
    const { name, bio } = req.body;

    if (!name || !bio) {
      res
        .status(400)
        .json({ errorMessage: "Please provide name and bio for the user." });
    } else {
      db.updateUser(req.params.id, req.body);

      if (req.body) {
        res.status(200).json(req.body);
      } else {
        res.status(404).json({
          message: "The user with the specified ID does not exist.",
        });
      }
    }
  } catch (err) {
    res.status(500).json({
      errorMessage: "There was an error while saving the user to the database",
    });
  }
});

// web servers need to be continuously listening
server.listen(3000, () => {
  console.log("server started");
});
