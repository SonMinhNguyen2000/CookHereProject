import Login from "./components/login";
import SignUp from "./components/signup";
import Profile from "./components/profile";
import Home from "./components/home";
import Detail from "./components/detail";
import RecipeForm from "./components/RecipeForm";
import {useEffect} from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

const PrivateRoute = ({ children, navigateTo }) => {
  let isAuthenticated =
    localStorage.getItem("CookBookUser") !== null ? true : false;
  return isAuthenticated ? children : <Navigate to={navigateTo} />;
};

const LoginRoute = ({ children, navigateTo }) => {
  let isAuthenticated =
    localStorage.getItem("CookBookUser") !== null ? true : false;
  return isAuthenticated ? <Navigate to={navigateTo} /> : children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <LoginRoute navigateTo={"/"}>
              <Login />
            </LoginRoute>
          }
        />
        <Route
          path="/Signup"
          element={
            <LoginRoute navigateTo={"/"}>
              <SignUp />
            </LoginRoute>
          }
        />
        <Route path="/recipe/:recipeId" element={<Detail />} />
        <Route path={"/recipe/:recipeId/:userName"} element={<Detail />} />
        <Route
          path="/auth/profile"
          element={
            <PrivateRoute navigateTo={"/"}>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path={"/auth/createRecipe"}
          element={
            <PrivateRoute navigateTo={"/"}>
              <RecipeForm />
            </PrivateRoute>
          }
        />
        <Route
          path={"/auth/updateRecipe/:recipeId/:userName"}
          element={
            <PrivateRoute navigateTo={"/"}>
              <RecipeForm />
            </PrivateRoute>
          }
        />
        <Route
          path="*"
          element={
            <div className={"text-danger h1 text-center"}>
              404: Page not found
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

//useEffect(()=>{
    //     const spoon = async()=>{
    //         let test = await axios.get(
    //             "https://api.spoonacular.com/recipes/random?apiKey=6c6f079794cf49ac82f55aa0687f966c&type?dessert"
    //         )
    //         const stringIngredient =
    //             "- " +
    //             test.data.recipes[0].extendedIngredients
    //                 .map((i) => i.name)
    //                 .join("\n- ");
    //         const newRecipe = {
    //             title: test.data.recipes[0].title,
    //             description: test.data.recipes[0].summary,
    //             ingredients: stringIngredient,
    //             instruction: test.data.recipes[0].instructions,
    //             username: "YukitoMinori",
    //             category: "dessert",
    //             image: test.data.recipes[0].image,
    //         };
    //         axios.post("/api/recipes", newRecipe).then(res=>console.log(res)).catch(err=>console.log(err))
    //     }
    //     spoon()
    // },[])


export default App;
