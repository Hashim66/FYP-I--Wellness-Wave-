const { User } = require("../models/user");
const { hashPassword, comparePassword } = require("../utils/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  try {
    const { formData } = req.body;
    const { name, rollNo, email, password } = formData;
    // console.log(req.body);
    const regName = /^[a-zA-Z]+ [a-zA-Z]+$/;
    //validation
    if (!name) {
      return res.status(400).send("name is required");
    }

    if (!name.match(regName)) {
      return res.status(400).send("name is not valid");
    }

    if (!rollNo) {
      return res.status(400).send("roll number is required");
    }

    const regRoll = /^\d{2}F-\d{4}$/;
    if (!regRoll.test(rollNo)) {
      return res.status(400).send("roll number is invalid");
    }

    if (!email) {
      return res.status(400).send("email is required");
    }

    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email.match(mailFormat)) {
      return res.status(400).send("email is not valid");
    }
    // if (!email.includes(".com")) {
    //   return res.status(400).send("email is not valid");
    // }

    if (!password || password.length < 6) {
      return res
        .status(400)
        .send(
          "Password is required and password must be at least 6 characters"
        );
    }

    const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if (!password.match(passRegex)) {
      return res
        .status(400)
        .send(
          "Password is not valid Enter a capital letter along with special character with minimum 6 characters"
        );
    }

    let userExist = await User.findOne({ email }).exec();
    if (userExist) {
      return res.status(400).send("email is already taken");
    }

    let rollNoExist = await User.findOne({ rollNo }).exec();
    if (rollNoExist) {
      return res.status(400).send("rollno is already taken");
    }

    const hashedPassword = await hashPassword(password);
    console.log("reached here2");
    const user = new User({ name, rollNo, email, password: hashedPassword });
    await user.save();
    console.log("user saved", user);

    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Please try again");
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email);
    console.log(password);
    const user = await User.findOne({ email }).exec();
    console.log(user);
    if (!user) {
      return res.status(400).send("No user found");
    }
    const match = await comparePassword(password, user.password);
    console.log(match);

    if (!match) {
      console.log(match);
      return res.status(400).send("Wrong password");
    }

    if (match) {
      const token = jwt.sign({ _id: user._id }, "mysecretkey", {
        expiresIn: "7d",
      });

      user.password = undefined;
      res.cookie("token", token, {
        httpOnly: true,
        // secure:true
      });

      res.json(user);
    }
  } catch (err) {
    return res.status(400).send("Error. Please try again");
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({ message: "Successfully logged out" });
  } catch (err) {
    console.log(err);
  }
};

const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id).select("-password").exec();
    console.log("CURRENT_USER", user);
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  register,
  login,
  logout,
  currentUser,
};
