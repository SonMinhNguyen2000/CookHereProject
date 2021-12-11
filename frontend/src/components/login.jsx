import useForm from '../helper/useForm';
import axios from "axios"
import background from "../images/login.jpg";
import {useState} from 'react'
import {useNavigate, Link} from 'react-router-dom';

export default function Login() {
    const [user, handleChange] = useForm({ email: "", password: "" });
    const [error, setError] = useState("")
    const [passVisibility, setVisibility] = useState(false)
    let navigate = useNavigate()
    const handleSubmit = (e) => {
      e.preventDefault();
      const newUser = {
        email: user.email,
        password: user.password,
      };
      axios.post("/api/auth/login", newUser)
          .then((res) =>{
              localStorage.setItem("CookBookUser", res.data.success.username);
              navigate("/");
              navigate("/", {replace: true});
          })
          .catch(err=>setError(error=>err.response.data.error.message));
    };


    return (
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
          <h1 className="h1 mb-4">Login</h1>
          <p className="text-danger">{error}</p>
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
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>

          <div className={"input-group"}>
              <input
                  type={passVisibility?"text":"password"}
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
                      onClick={()=>{setVisibility(!passVisibility)}}
                  >
                      Show
                  </span>
              </div>
          </div>

          </div>
          <div className="mb-3 d-flex flex-row flex-wrap">
            <button
              type="submit"
              className="btn me-3 mb-2 text-light"
              style={{
                backgroundColor: "#F29F05",
              }}
            >
              Login
            </button>
            <button
              type="button"
              className="btn me-3 mb-2 "
              style={{ border: "1px solid #F29F05", color: "#F29F05" }}
              onClick={()=>{
                  navigate("/Signup");
                  navigate("/SignUp", {replace: true})
              }}
            >
              Signup
            </button>
            <Link to={"/"}>
                Continue as guest
            </Link>
          </div>
        </form>
      </div>
    );
}

