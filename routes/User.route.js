const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User.model");

const UserRouter = Router();

UserRouter.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const isEmailPresent = await UserModel.findOne({ email: email });

    if (isEmailPresent)
      return res.status(400).send("Email id already registered.");

    bcrypt.hash(password, 3, async (err, hash) => {
      // Store hash in your password DB.
      if (err) return res.status(400).send("Something went wrong.", err);

      const newUser = new UserModel({ email, password: hash });
      await newUser.save();

      res.send({ msg: "Account created successfully." });
    });
  } catch (error) {
    res.status(400).send("Something went wrong.", error);
  }
});

UserRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email: email });

    if (user == null) return res.status(400).send("User not found.");

    bcrypt.compare(password, user.password, (err, result) => {
      // result == true
      if (!result) return res.status(400).send("Invalid Credentials");

      const token = jwt.sign({ userId: user._id }, "secret-key");

      res.send({ token });
    });
  } catch (error) {
    res.status(400).send("Something went wrong.", error);
  }
});

module.exports = UserRouter;
