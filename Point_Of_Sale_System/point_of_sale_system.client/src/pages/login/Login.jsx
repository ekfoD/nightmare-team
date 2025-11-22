import { useRef, useState, useEffect, useContext } from 'react';
import useAuth from "../../hooks/useAuth.jsx"
import AuthContext from "../../context/AuthProvider.jsx"
import { Link, useNavigate, useLocation, NavLink } from 'react-router-dom';
import "./register.css";

const LOGIN_URL = '/login';
function Login() {
    const { setAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState('');

    //useEffect(() => {
    //    if (success === true) {
    //        navigate("/");
    //    }
    //}, [success])


    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log("Fuck: ", user, pwd);
        //setSuccess(false);
        //setErrMsg("Generic error Message");

        //try {
        //    const response = await axios.post(LOGIN_URL,
        //        JSON.stringify({ username: user, password: pwd }),
        //        {
        //            headers: { 'Content-Type': 'application/json' },
        //            withCredentials: true
        //        }
        //    );

        //    const accessToken = response?.data?.accessToken;
        //    setAuth({ user, pwd, accessToken })
        //    setUser('');
        //    setPwd('');
        //    setSuccess(true);
        //} catch (err) {
        //    if (!err?.response) {
        //        setErrMsg('No server Response');
        //    } else if (err.response?.status === 400) {
        //        setErrMsg('Missing Username or Password');
        //    } else if (err.response?.status === 401) {
        //        setErrMsg('Unauthorized');
        //    }
        //    else {
        //        setErrMsg('Login Failed');
        //    }
        //    errRef.current.focus();
        //}


        const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30";
        setAuth({ user: user, password: pwd, token: accessToken });
        setUser('');
        setPwd('');
        //setSuccess(true);
        navigate(from, { replace: true });

    }


    return (

        <section className="container">
            <h1>Sign In</h1>
            <h2 className={errMsg.length ? "errorMessage" : "hide"}>{errMsg}</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    ref={userRef}
                    onChange={(e) => setUser(e.target.value)}
                    value={user}
                    required
                />
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    required
                />
                <button>Sign In</button>
            </form>
            <p>
                <span>Or <NavLink to="/register" end>
                    register
                </NavLink> here!</span>
            </p>
        </section>
    );
}

export default Login;