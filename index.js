const express = require('express');
const app = express();
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const { Console } = require('console');
let port = 8000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Post');
}

main().catch(err => console.log(err));

const PostSchema = new mongoose.Schema({
  username: String,
  content: String
});

let post = mongoose.model('post', PostSchema);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get("/posts", async (req, res) => {
  let posts = await post.find();
  res.render("home.ejs", { posts });
});

//add route
app.get("/posts/add", (req, res) => {
  res.render("form.ejs");
});

app.post('/posts', (req, res) => {
  let { username, content } = req.body;
  let newpost = new post({
    username: username,
    content: content
  });
  newpost.save().then((res) => {
    Console.log('new chat created');
  })
  .catch((err)=>{
    console.log(err);
  });
  res.redirect("/posts");
})

//showroute

app.get('/posts/:id', async(req, res) => {
  let { id } = req.params;
  let post = await post.findById(id);
  console.log(post);
  res.render("show.ejs", { post });
});

//editroute
app.get("/posts/:id/edit", async(req, res) => {
  let { id } = req.params;
  post = await post.findById(id);
  res.render("edit.ejs", {post});
});

app.put('/posts/:id', async(req, res) => {
  let { id } = req.params;
  let newcontent = req.body.content;
  await post.findByIdAndUpdate(id, {content:newcontent});
  res.redirect("/posts")
})

// //deleteroute
app.delete('/posts/:id', async(req, res) => {
  let { id } = req.params;
  await post.findByIdAndDelete(id);
  res.redirect("/posts")
})