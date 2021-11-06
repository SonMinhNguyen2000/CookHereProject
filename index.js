import routes from './src/routes/CookHereRoutes';
import express from 'express';
import mongoose from 'mongoose';


const app = express();
const PORT = 4000;
app.get('/', (req, res) =>
    res.send(`Node and express server running on port ${PORT}`)
)
app.listen(PORT, () =>
    console.log(`Your server is running on port ${PORT}`))

routes(app);

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/cookheredb', { useNewUrlParser: true, useUnifiedTopology : true })
app.use(express.urlencoded({ extended : true}));
app.use(express.json());