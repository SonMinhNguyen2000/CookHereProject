import useForm from '../helper/useForm';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import background from "../images/signup.jpg";
import {useState} from 'react';

export default function SignUp() {
    let navigate = useNavigate()
    const [user, handleChange] = useForm({username:"", email:"", password:""})
    const [error, setError] = useState({})
    const [passVisibility, setVisibility] = useState(false)
    const handleSubmit = e => {
        e.preventDefault();
        if (!isNaN(user.username) || user.password.length < 6 || user.password.length > 255) {
            if (!isNaN(user.username)) {
                setError({usernameErr: "INVALID_USERNAME"})
            } else {
                (user.password.length < 6)?setError({passwordErr: "PASSWORD_TOO_SHORT"}):
                    setError({passwordErr: "PASSWORD_TOO_LONG"})
            }
        } else {
            const newUser = {
                username: user.username,
                email: user.email,
                password: user.password
            }
            axios
                .post("/api/auth/register", newUser)
                .then((res) => {
                    alert("Email confirmation sent, you need to confirm your email before log in")
                    navigate("/login")
                    navigate("/login", {replace: true})
                })
                .catch((err) =>setError({...error,...err.response.data.error.message}));
        }

    }
    return(
        <div
            style={{
                backgroundImage: `url(${background})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                width: "100vw",
                height: "100vh",
                padding: "10px",
            }}
        >
            <form
                onSubmit={handleSubmit}
                className="shadow p-5 rounded-3 bg-light sm"
                style={{ width: "45%", marginLeft: "70px", marginTop: "7%" }}
            >
                <h1 className="h1 mb-4">Sign up</h1>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                        Username
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="text"
                        placeholder="Enter username"
                        name="username"
                        value={user.username}
                        onChange={handleChange}
                        required
                    />
                    <div className="form-text text-danger">{error.usernameErr}</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Email address
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Enter email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        required
                    />
                    <div className="form-text text-danger">{error.emailErr}</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        Password
                    </label>
                    <div className={"input-group"}>
                        <input
                            type={passVisibility ? "text" : "password"}
                            className="form-control"
                            id="password"
                            placeholder="Enter password"
                            name="password"
                            value={user.password}
                            onChange={handleChange}
                            required
                        />
                        <div className="input-group-append">
                  <span
                      className="input-group-text"
                      style={{cursor: 'pointer'}}
                      onClick={() => {
                          setVisibility(!passVisibility)
                      }}
                  >
                      Show
                  </span>
                        </div>
                    </div>
                    <div className="form-text text-danger">{error.passwordErr}</div>
                </div>
                <div className="mb-3 d-flex flex-row flex-wrap">
                    <button
                        type="submit"
                        className="btn me-3 mb-2 text-light"
                        style={{
                            backgroundColor: "#F29F05",
                        }}
                    >
                        Create account
                    </button>
                    <button
                        type="button"
                        className="btn me-3 mb-2 "
                        style={{ border: "1px solid #F29F05", color: "#F29F05" }}
                        onClick={()=>{
                            navigate("/login");
                            navigate("/login", {replace:true})
                        }}
                    >
                        Login
                    </button>
                </div>
            </form>
        </div>
    )
}
