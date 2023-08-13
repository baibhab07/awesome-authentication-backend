const User = require("../../models/userSchema");
const router = require("express").Router();
const bcrypt = require("bcryptjs");

//REGISTER A USER
router.post("/", async (req, res) => {
  const { email, password } = req.body;
  try {
    const passwordPattern =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!password.match(passwordPattern)) {
      return res.status(400).json({ msg: "Invalid password", status: false });
    }

    const userExists = await User.findOne({ email: email });
    if (userExists) {
      return res.status(401).json({
        msg: "User with provided email already exists",
        status: false,
      });
    } else {
      // Hashing Password
      const hashedPassword = await bcrypt.hash(password, 10);
      // Saving User Details
      const newUser = await User.create({
        email,
        password: hashedPassword,
      });
      await newUser.save();

      const user = {
        email: newUser.email,
        _id: newUser._id,
      };
      //respond with success message
      return res.status(200).json({
        status: true,
        user,
        msg: "User is registered succesfully",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
