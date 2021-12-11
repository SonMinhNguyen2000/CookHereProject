import {useState, useEffect} from 'react';
import NoImg from '../images/no-image.png'
import NavBar from './navBar'
import {useNavigate, useParams} from 'react-router-dom';
import useForm from '../helper/useForm';
import axios from 'axios'
import { EditorState } from "draft-js";
import TextEditor, {validateEditor, convertContentToHTML, convertHtmlToEditorObject} from "./editor";

const RecipeForm = () => {
  let navigate = useNavigate();
  const [update, setUpdate] = useState(false);
  const { recipeId, userName } = useParams();
  //current recipe -for updating recipe route
  const [preview, setPreview] = useState(null);
  const [currRecipe, setCurrRecipe] = useState(null);
  useEffect(() => {
    if (userName && userName !== localStorage.getItem("CookBookUser")) {
      navigate('/', {replace: true})
    }
    const fetch = async (id) =>{
        const res = await axios.get(`/api/recipes/${recipeId}`);
        const data = await res.data.result;
        setCurrRecipe((recipe) => data);
    }
    if (recipeId && userName) {
      fetch(recipeId);
    }
  },[]);
  useEffect(()=>{
    if (currRecipe) {
      setImage(currRecipe.image);
      setRecipe(currRecipe);
      setDescriptionState(d=>convertHtmlToEditorObject(currRecipe.description));
      setIngredientState(i=>convertHtmlToEditorObject(currRecipe.ingredients));
      setInstructionState(i=>convertHtmlToEditorObject(currRecipe.instruction));
    }
  },[currRecipe])

  useEffect(()=>{
    if (preview) {
      setImage(preview)
    }
  },[update, preview])

  const [image, setImage] = useState(null);
  
  const [err, setErr] = useState(""); //empty error
  //recipe placeholder -not include created_date, description, ingredient, instruction
  //reason for creating this state is for convenience,1 handleChange function to 2 inputs
  const [recipe, setRecipe] = useState({
    title: "",
    category: "breakfast",
    username: localStorage.getItem("CookBookUser"),
  });
  const handleChange = (e)  =>{
      const {name, value} = e.target
      setRecipe(r=>({...recipe, [name]: value}))
  }
  //All editors state
  const [descriptionState, setDescriptionState] = useState(() =>
    EditorState.createEmpty()
  );
  const [ingredientState, setIngredientState] = useState(() =>
    EditorState.createEmpty()
  );
  const [instructionState, setInstructionState] = useState(() =>
    EditorState.createEmpty()
  );
  //All handles editors change
  //handle editor change
  const descriptionChange = (state) => {
    setDescriptionState((d) => state);
  };

  const ingredientChange = (state) => {
    setIngredientState((d) => state);
  };

  const instructionChange = (state) => {
    setInstructionState((d) => state);
  };


  //handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    //form validation
    if (image == null) setErr("IMAGE_IS_REQUIRED");
    //check if image is empty
    else if (recipe.title === "") setErr("TITLE_IS_REQUIRED");
    else if (!validateEditor(descriptionState))
      setErr("DESCRIPTION_IS_REQUIRED");
    else if (!validateEditor(ingredientState)) setErr("INGREDIENT_IS_REQUIRED");
    else if (!validateEditor(instructionState))
      setErr("INSTRUCTION_IS_REQUIRED");
    else {
      //Convert editors content to html string and store them in variables
      const description = convertContentToHTML(descriptionState);
      const ingredient = convertContentToHTML(ingredientState);
      const instruction = convertContentToHTML(instructionState);
      //create a form data object then post it to cloudinary server to store img
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "gzwmg6wt"); //upload preset get on cloudinary
      const res = await axios.post(
          `https://api.cloudinary.com/v1_1/cstpcookbook/image/upload`,
          formData
      ); //post the form data object
      const url = res.data.url; //store the image url after it has been saved on cloudinary

      const newRecipe = {
        //new recipe object to upload to database
        ...recipe,
        image: url,
        created_date: new Date(),
        description: description,
        ingredients: ingredient,
        instruction: instruction,
      };
      const addRecipe = await axios.post(
        "/api/recipes/auth/user/addRecipe",
        newRecipe
      );
      console.log(addRecipe);
      navigate("/auth/profile"); //navigate back to profile
      navigate("/auth/profile", { replace: true });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdate(true);
    let imgUrl;
    //form validation
    if (image == null) setErr("IMAGE_IS_REQUIRED");
    //check if image is empty
    else if (recipe.title === "") setErr("TITLE_IS_REQUIRED");
    else if (!validateEditor(descriptionState))
      setErr("DESCRIPTION_IS_REQUIRED");
    else if (!validateEditor(ingredientState)) setErr("INGREDIENT_IS_REQUIRED");
    else if (!validateEditor(instructionState))
      setErr("INSTRUCTION_IS_REQUIRED");
    else {
      //Convert editors content to html string and store them in variables
      const description = convertContentToHTML(descriptionState);
      const ingredient = convertContentToHTML(ingredientState);
      const instruction = convertContentToHTML(instructionState);
      //check if image is new
      if (typeof image != "string") {
        //create a form data object then post it to cloudinary server to store img
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "gzwmg6wt"); //upload preset get on cloudinary
        const res = await axios.post(
            `https://api.cloudinary.com/v1_1/cstpcookbook/image/upload`,
            formData
        ); //post the form data object
        imgUrl = res.data.url;
      } else {
        imgUrl = image
      }

      const newRecipe = {
        //new recipe object to upload to database
        ...recipe,
        image: imgUrl,
        created_date: new Date(),
        description: description,
        ingredients: ingredient,
        instruction: instruction,
      };
      const updateRecipe = await axios.put(
          `/api/recipes/auth/user/edit/${recipeId}`,
          newRecipe
      );
      navigate("/auth/profile"); //navigate back to profile
      navigate("/auth/profile", { replace: true });
    }
  };
  return (
    <>
      <NavBar />
      <div className="row d-flex justify-content-center">
        <img
          className={"pt-2 rounded"}
          src={preview? URL.createObjectURL(preview):image?image:NoImg}
          style={{ width: "30%", height: "30%" }}
        />
        <form className={"py-3"}>
          <center>
            <label className={"btn btn-dark w-25 rounded-3 mb-4"}>
              <i className="bi bi-camera w-100 h-100"></i>
              <input
                type="file"
                onChange={(e) => {
                  setPreview(e.target.files[0]);
                }}
                accept="image/png, image/jpeg"
                style={{ display: "none" }}
                id={"image"}
                required
              />
            </label><br/>
            <button className={"btn btn-danger fw-bolder mt-2 text-light"}
            onClick={(e)=>{
              e.preventDefault();
              setPreview(null)}}
            >remove image</button>
          </center>
          <div className="form-text text-danger text-center">{err}</div>
          <div className={"row px-5 m-auto mb-3 w-75"}>
            <div className=" col-8">
              <label htmlFor="title" className="h5 form-label">
                Recipe's title:
              </label>
              <input
                className={"w-75 form-control"}
                name={"title"}
                id={"title"}
                value={recipe.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className={"col-3 pe-5"}>
              <label className="h5 form-label" htmlFor="selector">
                Category:
              </label>
              <select
                className="form-select"
                value={recipe.category}
                name={"category"}
                onChange={handleChange}
              >
                <option value="breakfast">breakfast</option>
                <option value="lunch">lunch</option>
                <option value="dinner">dinner</option>
                <option value="dessert">dessert</option>
              </select>
            </div>
          </div>
          <div className={"row px-5 m-auto pt-4 w-75 d-flex flex-column"}>
            <h5>Description:</h5>
            <TextEditor
              editorState={descriptionState}
              handleChange={descriptionChange}
            />
          </div>
          <div className={"row px-5 m-auto pt-4 w-75 d-flex flex-column"}>
            <h5>Ingredients:</h5>
            <TextEditor
              editorState={ingredientState}
              handleChange={ingredientChange}
            />
          </div>
          <div className={"row px-5 m-auto pt-4 w-75 d-flex flex-column"}>
            <h5>Instructions:</h5>
            <TextEditor
              editorState={instructionState}
              handleChange={instructionChange}
            />
          </div>
          <div
            className={
              "row px-5 m-auto pt-3 w-75 d-flex justify-content-center"
            }
          >
            {recipeId && userName ? (
              <button
                type="submit"
                style={{ backgroundColor: "#F29F05" }}
                onClick={handleUpdate}
                className={"btn rounded w-25 fw-bolder text-light"}
              >
                Update
              </button>
            ) : (
              <button
                type="submit"
                style={{ backgroundColor: "#F29F05" }}
                onClick={handleSubmit}
                className={"btn rounded w-25 fw-bolder text-light"}
              >
                Create
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default RecipeForm;
