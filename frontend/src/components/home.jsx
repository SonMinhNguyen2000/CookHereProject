import { useEffect, useState} from "react";
import RecipeCard from './recipeCard';
import NavBar from './navBar';
import useFetch from '../helper/useFetch';
import background from '../images/bgnav.jpg';
import {useNavigate} from 'react-router-dom';

const CategoryButton = (props) => {
    return (
        <button className="rounded-pill
        btn btn-default btn-md btn-block
        px-3 mx-auto
        my-3
        fw-bolder
        text-dark border btn-block"
                style= {props.Style}
                onClick={props.handleClick}>
            {props.category}
        </button>
    )
}

const activeButton = {width:"50%", backgroundColor: "#F29F05", outline:"none", boxShadow:"none"}
const inactiveButton = {width:"50%"}

const categories = ["breakfast", "lunch", "dinner", "dessert"]

const Home = () => {
    let navigate = useNavigate()
    const [currCategory, setCurrentCategory] = useState("breakfast")
    useEffect(()=>{
        if(localStorage.getItem('currCategory')) setCurrentCategory(localStorage.getItem('currCategory'))
    }, [])
    const {data} = useFetch("/api/recipes/category/"+currCategory)
    return (
        <>
            <NavBar/>
            <div className="w-100" style={{
                backgroundImage: `url(${background})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                padding: '10px',
                height: '500px'
            }}/>
            <div className="row">
                <div className="col-3 p-5 d-flex flex-column h-25 sticky-top">
                    <h1 className="text-center"><b>Categories</b></h1>
                    {categories.map(category => (
                        <CategoryButton
                            key={category}
                            category={category}
                            handleClick={()=>{
                                setCurrentCategory(category)
                                localStorage.setItem('currCategory', category)
                            }}
                            Style={currCategory === category?activeButton:inactiveButton}
                        />
                    ))}
                </div>
                <div className="col-2">
                    {!data ? <h1 className="text-center"><b>...loading</b></h1>:(
                        data.map((recipe) => (
                            <RecipeCard
                                key={recipe._id}
                                title={recipe.title}
                                category={recipe.category}
                                description={recipe.description}
                                image={recipe.image}
                                handleClick={()=>{
                                    navigate(`/recipe/${recipe._id}`);
                                    navigate(`/recipe/${recipe._id}`, {replace: true});}
                                }
                            />
                        ))
                    )}
                </div>

            </div>
        </>
    )
}
export default Home;
/*

*/