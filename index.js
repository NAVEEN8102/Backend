const express = require('express');
const app = express();
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

let port = 8000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let posts = [
  {
    "id": uuidv4(),
    "username": "naveen",
    "content": "I am Frontend Devloper"
  },
  {
    "id": uuidv4(),
    "username": "gaurv",
    "content": "I am Database Enginer"
  },
  {
    "id": uuidv4(),
    "username": "Vikas",
    "content": "I am Backend Devloper"
  },
  {
    "id": uuidv4(),
    "username": "Vikas",
    "content": "I am Backend Devloper"
  },
  {
    "id": uuidv4(),
    "username": "Vikas",
    "content": "I am Backend Devloper"
  }
];

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get("/posts", (req, res) => {
  res.render("home.ejs", { posts });
});

app.get("/posts/add", (req, res) => {
  res.render("form.ejs");
});

app.post('/posts', (req, res) => {
  let { username, content } = req.body;
  posts.push({ username, content });
  res.redirect("/posts");
})

app.get('/posts/:id', (req, res) => {
  let { id } = req.params;
  let post = posts.find((p) => id === p.id);
  res.render("show.ejs", { post });
})

app.patch('/posts/:id', (req, res) => {
  let { id } = req.params;
  let newcontent=req.body.content;
  let post = posts.find((p) => id === p.id);
  post.content = newcontent
  res.redirect("/posts")
})

app.get("/posts/:id/edit", (req, res) => {
  let { id } = req.params;
  let post = posts.find((p) => id === p.id);
  res.render("edit.ejs", {post});
});

app.delete('/posts/:id', (req, res) => {
  let { id } = req.params;
  posts = posts.filter((p) => id !== p.id);
  res.redirect("/posts")
})