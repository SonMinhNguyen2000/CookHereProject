import express from 'express';
import mongoose from 'mongoose';

const PORT = process.env.PORT;
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const RecipeRoute = require("./src/routes/recipe");
const UserRoute = require("./src/routes/user");

app.use(express.json());
app.use(cors());
app.use(cookieParser())

app.use("/api/recipes", RecipeRoute);
app.use("/api/auth", UserRoute);


app.listen(PORT, () =>
    console.log(`Your server is running on port ${PORT}`))

mongoose
  .connect(`${process.env.DB_PROTOCOL}://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?${process.env.DB_PARAMS}`)
  .then(() => {
    console.log("mongoose is connected");
  })
  .catch((err) => {
    console.log(err);
  });

process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log("Mongoose disconnected on app termination");
    process.exit(0);
  });
});

// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb+srv://matt:canada1@cluster0.gxf1a.mongodb.net/CookHere?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology : true })
// //.then(() => 'You are now connected to Mongo!')
// //.catch(err => console.error('Something went wrong', err))
// mongoose.set('debug', true);
// var db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));

// db.once("open", function() {
//   console.log("Connection Successful!");
// });
