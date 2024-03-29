import express from "express";
import bodyParser from "body-parser";
import fs from "fs";

const app=express();
const port=3000;
var message;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
let array_of_blog = [];

try {
    const data = fs.readFileSync("blogs.json", "utf8");
    array_of_blog = JSON.parse(data);
} catch (err) {
    console.error("Error reading blogs file:", err);
}

app.get("/",(req,res)=>{
    res.render("index.ejs");
});
app.get("/create",(req,res)=>{
    res.render("create.ejs");
});
app.post("/submit", (req, res) => {
    var Name = req.body["firstname"];
    var title = req.body["title"];
    var content= req.body["blog"];
    var note= req.body["notes"];
    var thank= req.body["thanks"];

    const blog = { Name, title, content, note, thank };
    array_of_blog.push(blog);
    fs.writeFile("blogs.json", JSON.stringify(array_of_blog), (err) => {
        if (err) {
            console.error("Error writing blogs file:", err);
            ans=false;
            return;
        }
        console.log("Blogs file updated successfully");
        message="Blog created successfully";
        res.render("create.ejs",{message:message});
    });

  });
app.get("/view",(req,res)=>{
    const clickedBlogTitle = req.query.title;
    const clickedBlog = array_of_blog.find(blog => blog.title === clickedBlogTitle);
    res.render('view.ejs', { blogsData: array_of_blog, clickedBlog: clickedBlog });
});
app.get("/edit",(req,res)=>{
    const clickedBlogTitle = req.query.title;
    const clickedBlog = array_of_blog.find(blog => blog.title === clickedBlogTitle);
    res.render('edit.ejs', { blogsData: array_of_blog, clickedBlog: clickedBlog});
});
app.post("/update", (req, res) => {
    var Name = req.body["firstname"];
    var title = req.body["title"];
    var content = req.body["blog"];
    var note = req.body["notes"];
    var thank = req.body["thanks"];
    const existingBlogIndex = array_of_blog.findIndex(blog => blog.title === title);
    if (existingBlogIndex !== -1) {
        array_of_blog[existingBlogIndex] = { Name, title, content, note, thank };
    } else {
        res.status(404).send("Blog not found");    
    }
    fs.writeFile("blogs.json", JSON.stringify(array_of_blog), (err) => {
        if (err) {
            console.error("Error writing blogs file:", err);
            ans = false;
            return;
        }
        console.log("Blogs file updated successfully");
    });
    res.redirect("/");
});
app.post("/delete", (req, res) => {
    const titleToDelete = req.body.title;
    const updatedBlogs = array_of_blog.filter(blog => blog.title !== titleToDelete);
    if (updatedBlogs.length !== array_of_blog.length) {
        array_of_blog = updatedBlogs;
        fs.writeFile("blogs.json", JSON.stringify(array_of_blog), (err) => {
            if (err) {
                console.error("Error writing blogs file:", err);
                return res.status(500).send("Internal Server Error");
            }
            console.log("Blog deleted successfully");
            res.render("delete.ejs", { blogsData: array_of_blog }); // Redirect to delete page or any other desired page
        });
    } else {
        res.status(404).send("Blog not found");
    }
});

app.get("/delete", (req, res) => {
    res.render("delete.ejs", { blogsData: array_of_blog });
});
app.listen(port,(req,res)=>{
    console.log(`Server is running on port ${port}`);
});