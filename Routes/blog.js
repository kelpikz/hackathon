const express = require("express");
const router = express.Router();
const Blog = require("../Models/Blog");
const User = require("../Models/User");
const { ensureAuthenticated } = require("../Config/auth");

// Index Route for the blogs
router.get("/", async (req, res) => {
  try {
    let blogs = await Blog.find({ public: true });
    res.render("show2", { blogs, type: "index" });
  } catch (err) {
    next(err);
  }
});

router.get("/drafts", ensureAuthenticated, async (req, res) => {
  try {
    let { blogs } = await User.findById(req.user.id).populate("blogs");
    blogs = blogs.filter((blog) => blog.public === false);
    res.render("show2", { blogs, type: "drafts" });
  } catch (err) {
    next(err);
  }
});
router.get("/mine", ensureAuthenticated, async (req, res) => {
  try {
    let { blogs } = await User.findById(req.user.id).populate("blogs");
    res.render("show2", { blogs, type: "mine" });
  } catch (err) {
    next(err);
  }
});

//new Route
router.get("/new", (req, res) => {
  res.render("new");
});

router.post("/", ensureAuthenticated, async (req, res, next) => {
  req.body.body = req.body.body;
  console.log(req.body);
  let user = await User.findById(req.user.id);
  req.body.author = user.name;
  let blog = await Blog.create(req.body);

  user.blogs.push(blog);
  blog.editors.push(user);

  await blog.save();
  await user.save();

  console.log(req.body);
  res.send(blog); //TODO do redirect in the new page
  // res.send("you have reached the post route");
});

//#SHOW ROUTE
router.get("/:id", async (req, res, next) => {
  try {
    if (req.user) {
      let user = await User.findById(req.user.id);
      let blog = await Blog.findById(req.params.id);
      if (blog.editors.includes(user._id)) {
        if (blog.public) {
          if (blog.layout === 1)
            res.render("Layouts/1", { blog, type: "unpublish" });
          if (blog.layout === 2)
            res.render("Layouts/2", { blog, type: "unpublish" });
        } else {
          if (blog.layout === 1)
            res.render("Layouts/1", { blog, type: "publish" });
          if (blog.layout === 2)
            res.render("Layouts/2", { blog, type: "publish" });
        }
        return;
      }
    }
    if (blog.layout === 1) res.render("Layouts/1", { blog });
    if (blog.layout === 2) res.render("Layouts/2", { blog });
  } catch (err) {
    next({ status: 500, message: err });
  }
});

//#EDIT ROUTE
router.get("/:id/edit", async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);
    res.render("edit", { blog });
  } catch (err) {
    next({ status: 500, message: err });
  }
});

//#UPDATE ROUTE
router.put("/:id", async (req, res) => {
  try {
    req.body.body = req.body.body;
    console.log(req.body);
    let blog = await Blog.findByIdAndUpdate(req.params.id, req.body);
    res.json({ blog });
  } catch (err) {
    next({ status: 500, message: err });
  }
});
router.put("/:id/publish", async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);
    blog.public = !blog.public;
    await blog.save();

    res.json({ blog });
  } catch (err) {
    next({ status: 500, message: err });
  }
});

module.exports = router;
