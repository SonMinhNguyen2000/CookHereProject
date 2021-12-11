import NavBar from './navBar';
import RecipeCard from './recipeCard'
import useFetch from '../helper/useFetch';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {useEffect, useState} from 'react';



const Profile = () => {
    let navigate = useNavigate();
    const {data} = useFetch("/api/recipes/auth/user/" + localStorage.getItem("CookBookUser"))
    const [email, setEmail] = useState("...loading")
    useEffect(()=>{
        axios.get("/api/auth/email").then(res=>setEmail(res.data.success.email))
    },[])
    return (
        <>
            <NavBar/>
            <div className="row d-flex justify-content-center py-3">
                <div className="rounded-circle d-flex
                     justify-content-center
                     align-items-center
                     fw-bold border
                     bg-dark
                     text-light"
                     style={{height: "200px", width: "200px", fontSize: "100px"}}>
                    {localStorage.getItem("CookBookUser")[0].toUpperCase()}
                </div>
            </div>
            <h1 className="h1 fw-bolder text-center" style={{fontSize:"30px"}}>
                {localStorage.getItem("CookBookUser")}
            </h1>
            <h3 className="h3 text-center m-1">{email}</h3>
            <div className="row">
                <div className="col-3 p-5 d-flex flex-column h-25 sticky-top">
                    <h1 className="h2 fw-bolder text-center py-2">Your recipes:</h1>
                    <button className="rounded-pill
                            btn px-3 mx-auto
                            my-3
                            fw-bolder"
                            style={{width:"50%", border: "1px solid #F29F05", color: "#F29F05"}}
                            onClick={()=>{
                                navigate("/auth/createRecipe")
                                navigate("/auth/createRecipe",{replace: true})}
                            }
                            >
                        Create new recipe
                    </button>
                </div>
                <div className="col-9">
                    {!data ? <h3 className="text-center text-muted fw-bolder py-2 m-5 d-flex align-center">
                        <b>...loading</b>
                    </h3>:data.length > 0? (
                        data.map((recipe) => (
                            <RecipeCard
                                key={recipe._id}
                                title={recipe.title}
                                category={recipe.category}
                                description={recipe.description}
                                image={recipe.image}
                                handleClick={()=>{
                                    const detailRoute = `/recipe/${recipe._id}/${localStorage.getItem("CookBookUser")}`
                                    navigate(detailRoute)
                                    navigate(detailRoute,
                                        {replace: true}
                                    )
                                }}
                            />
                        ))
                    ): <h1
                        className={"h1 text-muted fw-bolder py-2 m-5 d-flex align-center"}
                    >No Recipe</h1>}
                </div>
            </div>
        </>
    )
}

export default Profile;