import React from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import NavBar from './navBar'
import useFetch from '../helper/useFetch'
import parse from "html-react-parser";
import axios from 'axios';


const Detail = () => {
    const {recipeId, userName} =  useParams()
    const {data} = useFetch(`/api/recipes/${recipeId}`)
    let navigate = useNavigate()
    const handleDelete = async() =>{
        const fetch = await axios.delete(`/api/recipes/auth/user/edit/${recipeId}`)
        const res = await fetch.data.result;
        console.log(res)
        navigate('/auth/profile');
        navigate('/auth/profile', {replace: true});
    }

    return (
        <>
            <NavBar/>
            {!data?<div className={"text-center h1 fw-bolder m-auto"}>...loading</div>:
                <div className={"row w-100 h-100 p-4"}>
                    <div className={"col-5"}>
                        <img src={data.image} className={"image-fluid rounded-3 w-100"} alt={data.title} />
                        <h1 className={"h3 fw-bolder mt-3"}>Ingredients:</h1>
                        <div style={{whiteSpace: "pre", fontSize:"21px"}} className={"p-1"}>
                            {parse(data.ingredients)}
                        </div>
                    </div>
                    <div className={"col-7 px-2"}>
                        <h1 className={"h2 fw-bolder"}>{data.title}</h1>
                        <p className={"h5 pt-3 pe-5 fw-italic"}>Author: {data.username}</p>
                        <h5 className={"fw-bold pt-3 pb-1"}>Description:</h5>
                        <div style={{fontSize:"18px"}}>
                            {parse(data.description)}
                        </div>
                        <h5 className={"fw-bold pt-3 pb-1"}>Instruction:</h5>
                        <div style={{fontSize:"18px"}}>
                            {parse(data.instruction)}
                        </div>
                        {userName === localStorage.getItem("CookBookUser") &&(
                            <>
                                <button
                                    className={"btn text-dark me-3 fw-bold"}
                                    style={{backgroundColor: "#F29F05"}}
                                    onClick={()=>{
                                        navigate(`/auth/updateRecipe/${recipeId}/${userName}`)
                                        navigate(
                                          `/auth/updateRecipe/${recipeId}/${userName}`
                                        , {replace: true});

                                    }}
                                >
                                    Update
                                </button>
                                <button className={"btn btn-danger text-light fw-bold"}
                                        onClick={handleDelete}
                                >
                                    Delete Recipe
                                </button>
                            </>
                            )
                        }
                    </div>
                </div>
            }
        </>
    );
};

export default Detail;
