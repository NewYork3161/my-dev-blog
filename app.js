const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const multer = require("multer");
const path = require("path");

require("dotenv").config();

const Post = require("./models/Post");
const Response = require("./models/Response");

const app = express();

const PORT = 3000;

const storage = multer.diskStorage({

    destination: function(req, file, cb) {

        cb(null, "public/images");

    },

    filename: function(req, file, cb) {

        cb(
            null,
            Date.now() + path.extname(file.originalname)
        );

    }

});

const upload = multer({
    storage: storage
});

mongoose.connect(process.env.MONGO_URI)
.then(() => {

    console.log("MongoDB Connected");

})
.catch((error) => {

    console.log(error);

});

app.set("view engine", "ejs");

app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());

app.use(express.static("public"));

app.use(methodOverride("_method"));

app.get("/", (req, res) => {

    res.redirect("/home");

});

app.get("/home", (req, res) => {

    res.render("index");

});

app.get("/blog-post", (req, res) => {

    res.render("blog_post");

});

app.get("/post-page", async (req, res) => {

    try {

        const posts = await Post.find().sort({
            createdAt: -1
        });

        const responses =
            await Response.find().sort({
                createdAt: -1
            });

        res.render("post_page", {
            posts,
            responses
        });

    }

    catch(error) {

        console.log(error);

        res.status(500).send("Server Error");

    }

});

app.post(
    "/create-post",
    upload.single("image"),
    async (req, res) => {

    try {

        const newPost = new Post({

            title: req.body.title,

            content: req.body.content,

            image: req.file
                ? req.file.filename
                : ""

        });

        await newPost.save();

        res.redirect("/post-page");

    }

    catch(error) {

        console.log(error);

        res.status(500).send("Server Error");

    }

});

app.post(
    "/create-response/:id",
    upload.single("responseImage"),
    async (req, res) => {

    try {

        const newResponse = new Response({

            postId: req.params.id,

            username: req.body.username,

            content: req.body.responseContent,

            image: req.file
                ? req.file.filename
                : ""

        });

        await newResponse.save();

        res.redirect("/post-page");

    }

    catch(error) {

        console.log(error);

        res.status(500).send("Server Error");

    }

});

app.put(
    "/edit-post/:id",
    upload.single("image"),
    async (req, res) => {

    try {

        const updatedData = {

            title: req.body.title,

            content: req.body.content

        };

        if(req.file) {

            updatedData.image =
                req.file.filename;

        }

        await Post.findByIdAndUpdate(
            req.params.id,
            updatedData
        );

        res.redirect("/post-page");

    }

    catch(error) {

        console.log(error);

        res.status(500).send("Server Error");

    }

});

app.put(
    "/edit-response/:id",
    upload.single("responseImage"),
    async (req, res) => {

    try {

        const updatedData = {

            username: req.body.username,

            content: req.body.responseContent

        };

        if(req.file) {

            updatedData.image =
                req.file.filename;

        }

        await Response.findByIdAndUpdate(
            req.params.id,
            updatedData
        );

        res.redirect("/post-page");

    }

    catch(error) {

        console.log(error);

        res.status(500).send("Server Error");

    }

});

app.delete(
    "/delete-post/:id",
    async (req, res) => {

    try {

        await Response.deleteMany({
            postId: req.params.id
        });

        await Post.findByIdAndDelete(
            req.params.id
        );

        res.redirect("/post-page");

    }

    catch(error) {

        console.log(error);

        res.status(500).send("Server Error");

    }

});

app.delete(
    "/delete-response/:id",
    async (req, res) => {

    try {

        await Response.findByIdAndDelete(
            req.params.id
        );

        res.redirect("/post-page");

    }

    catch(error) {

        console.log(error);

        res.status(500).send("Server Error");

    }

});

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});