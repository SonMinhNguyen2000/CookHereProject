import * as controller from "../controllers/UserController";

const routes = (app) => {
    //login route
    app.route("/user/login")
       .post(controller.getUserWithPWD);
    //sign in route
    app.route('/user/signin')
       .post(controller.addNewUser);
    //get user info route
    app.route("/user/:userID")
       .post(controller.getUserWithID);
    //for testing only
    app.route("/user")
       .get(controller.getAllUser);
}

export default routes;