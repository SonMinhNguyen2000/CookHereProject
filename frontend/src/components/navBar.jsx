import {useNavigate} from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import axios from 'axios';

const Nav = props => {
    let navigate = useNavigate()
    return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
            <button className="navbar-brand ms-5 btn sm" onClick={()=>{navigate("/", {replace: true})}}
                    style={{outline:"none", boxShadow:"none"}}>
                <h1 className="h1">CookBook</h1>
            </button>
            <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div
                className="collapse navbar-collapse justify-content-end"
                id="navbarNav"
            >
                <ul className="navbar-nav">
                    {props.username ? (
                        <UserTool username={props.username}
                                  handleClick={()=>{navigate("/auth/profile", {replace: true})}}
                                  handleSignOut={props.handleSignOut}
                        />
                    ) : (
                        <li className="nav-item mx-5">
                            <button
                                className="nav-link rounded-pill btn px-3 fw-bolder"
                                style={{ backgroundColor: "#73BFA3" }}
                                onClick={()=>{
                                    navigate("/login")
                                    navigate("/login", {replace: true})
                                }}
                            >
                                Login
                            </button>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    </nav>
)}

const UserTool = props => {

    return props.username!==undefined?(
    <>
        <li className="nav-item mx-3">
            <button className="btn bg-dark fw-bolder rounded-circle text-light"
                    style={{width:"50px", height:"50px"}}
                    onClick={props.handleClick}>
                {props.username[0].toUpperCase()}
            </button>
        </li>
        <li className="nav-item mx-5 d-flex align-center">
            <button
                className="nav-link rounded-pill btn px-3 fw-bolder"
                style={{ backgroundColor: "#73BFA3" }}
                onClick={props.handleSignOut}
            >
                Sign out
            </button>
        </li>
    </>
):null}

export default function NavBar() {
    let navigate = useNavigate()
    const [login, setLogin] = useState(false)
    useEffect(() => {
        localStorage.getItem("CookBookUser")?setLogin(true):setLogin(false)
    }, []);
    return (
      <>
          {localStorage.getItem("CookBookUser")?
              <Nav
                  username={localStorage.getItem('CookBookUser')}
                  handleClick={()=>{}}
                  handleSignOut = {()=>{
                      setLogin(false);
                      localStorage.removeItem('CookBookUser');
                      localStorage.removeItem("currCategory");
                      axios.get('/api/auth/logout')
                      navigate("/")
                      navigate("/", {replace: true})
                  }}
              />:<Nav/>
          }
      </>
    );
}