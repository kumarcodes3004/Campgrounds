const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const campground = require("./modules/campground");
const methodOverride = require("method-override");
// const campground = require("./modules/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  // useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
  console.log("database connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method")); //using override so that we can edit and update our form
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/campgrounds", async (req, res) => {
  const campgrounds = await campground.find({});
  // await camp.save();
  res.render("campgrounds/index", { campgrounds });
});
//ORDER OF THE FUNCTION MATTERS HERE
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.post("/campgrounds", async (req, res) => {
  const camp = new campground(req.body.campground);
  await camp.save();
  res.redirect(`/campgrounds/${camp._id}`);
  // res.send(req.body);
});
app.get("/campgrounds/:id", async (req, res) => {
  const camp = await campground.findById(req.params.id);
  res.render("campgrounds/show", { camp });
});

app.get("/campgrounds/:id/edit", async (req, res) => {
  const camp = await campground.findById(req.params.id);
  res.render("campgrounds/edit", { camp });
});

app.put("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const camp = await campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  res.redirect(`/campgrounds/${camp._id}`);
});

app.delete("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  await campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
});
app.listen(3000, () => {
  console.log("serving on port 3000", async (req, res) => {});
});
