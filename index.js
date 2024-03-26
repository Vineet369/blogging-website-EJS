const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const userRoute = require('./routes/user.route.js');

const app = express();
const PORT = 8000;

mongoose.connect("mongodb+srv://bloodbankmanagement:bloodbank@clusterbloodban.7cf1bky.mongodb.net/Blog-site")
.then((e) => console.log("Mongodb connected"))
.catch((error) => console.log("error connecting to mongodb", error));

app.set("view engine", "ejs");
app.set('views', path.resolve("./views"));

app.use(express.urlencoded({ extended: false}));

app.get("/", (req, res) => {
    res.render("home");
})

app.use("/user", userRoute);


app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
}) 