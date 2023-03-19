const mongoose = require("mongoose");
const campground = require("../modules/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  //   useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
  console.log("database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
  await campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new campground({
      location: `${cities[random1000].city},${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: "https://source.unsplash.com/collection/483251",

      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem dolorum veniam soluta dolorem explicabo. Sequi nobis quasi doloremque id quidem accusantium quis eos aperiam eveniet, expedita officia iste minus ipsa!",
      price,
    });
    await camp.save();
  }
  // await c.save();
};

seedDB().then(() => {
  mongoose.connection.close(); //closing the connection
});
