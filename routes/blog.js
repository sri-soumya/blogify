const { Router } = require("express");
const router = Router();
const Blog = require("../models/blog");
const multer = require("multer");
const path = require("path");
const Comment = require("../models/comment");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.get("/add-new", (req, res) => {
  res.render("addBlog", { user: req.user });
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  const blog = await Blog.create({
    title: req.body.title,
    body: req.body.body,
    createdBy: req.user._id,
    coverImageURL: `/uploads/${req.file.filename}`,
  });
  res.redirect(`/blog/${blog.id}`);
});

router.get("/:blogId", async (req, res) => {
  const blog = await Blog.findById({ _id: req.params.blogId }).populate(
    "createdBy"
  );
  const comments = await Comment.find({ blogId: req.params.blogId }).populate(
    "createdBy"
  );
  return res.render("blog", { user: req.user, blog, comments });
});

router.post("/comment/:blogId", async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});
module.exports = router;
