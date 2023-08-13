const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/userSchema");

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res
        .status(401)
        .json({ msg: "Invalid Credentials", status: false });
    }
    const matchPassword = await bcrypt.compare(password, existingUser.password);
    if (!matchPassword) {
      return res
        .status(401)
        .json({ msg: "Invalid credentials", status: false });
    }

    // Token generation
    const token = jwt.sign(
      {
        email: existingUser.email,
        _id: existingUser._id,
      },
      process.env.SECRET_KEY,
      { expiresIn: "24h" }
    );

    const user = {
      email: existingUser.email,
      _id: existingUser._id,
    };

    return res.json({
      msg: "Logged in successfully",
      user,
      accessToken: token,
      status: true,
    });
  } catch (err) {
    return res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
