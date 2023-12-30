require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Blog = require("./models/blog");
const PORT = process.env.PORT || 8000;
const app = express();
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const cookieParser = require("cookie-parser");
const { checkForUserAuthentication } = require("./middleware/auth");
mongoose
  .connect(`${process.env.MONGO_URL}/blogify`)
  .then(() => console.log("MongoDB connected"));

app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(checkForUserAuthentication);
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  return res.render("home", { user: req.user, blogs: allBlogs });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
