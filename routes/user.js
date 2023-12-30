const { Router } = require("express");
const router = Router();
const User = require("../models/user");
const multer = require("multer");

router.get("/signup", async (req, res) => {
  return res.render("signup");
});

router.get("/signin", async (req, res) => {
  return res.render("signin");
});

router.get("/logout", (req, res) => {
  return res.clearCookie("token").redirect("/");
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  await User.create({
    fullName,
    email,
    password,
  });
  const token = await User.matchPasswordAndGenerateToken(email, password);
  return res.cookie("token", token).redirect("/");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("signin", { error: "Invalid credentials" });
  }
});

module.exports = router;
