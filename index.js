import routes from './src/routes/CookHereRoutes';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';


const app = express();
const PORT = 4000;
app.get('/', (req, res) =>
    res.send(`Node and express server running on port ${PORT}`)
)
app.listen(PORT, () =>
    console.log(`Your server is running on port ${PORT}`))

routes(app);

mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://matt:canada1@cluster0.gxf1a.mongodb.net/CookHere?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology : true })
//.then(() => 'You are now connected to Mongo!')
//.catch(err => console.error('Something went wrong', err))
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function() {
  console.log("Connection Successful!");
});

app.use(express.urlencoded({ extended : true}));
app.use(express.json());