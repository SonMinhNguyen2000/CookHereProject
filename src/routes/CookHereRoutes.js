import { addNewDonation } from "../controllers/CookHereController";

const routes = (app) => {
        //create route for donations
        app.route('/donations')
            //create get request
            .get((req, res) =>
                res.send('GET request successful!'))
            //create post request
            .post(addNewDonation)
        // create a new route so you can get these donation entries by their ID's
        app.route('/donations/:donationID')
            //create put request
            .put((req, res) =>
                res.send('PUT request successful!'))
            //create delete request
            .delete((req, res) =>
                res.send('DELETE request successful'))
    }
    // export it!
export default routes;