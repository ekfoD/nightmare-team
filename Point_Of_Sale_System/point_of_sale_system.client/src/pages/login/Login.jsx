import { useRef, useState } from 'react';
import useAuth from "../../hooks/useAuth.jsx"
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import api from '../../api/axios.js';
import "../../styles/Register.css";

const LOGIN_URL = 'http://localhost:7079/api/login';

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



    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrMsg("");

        try {
            const response = await api.post("/login", {
                username: user,
                password: pwd,
            });

            const token = response.data.token;

            // decode JWT payload
            const payload = JSON.parse(atob(token.split(".")[1]));

            setAuth({
                token,
                role: payload.role,
                businessId: payload.businessId || null,
                businessType: payload.businessType || null,
            });

            setUser("");
            setPwd("");
            navigate(from, { replace: true });

        } catch (err) {
            if (!err?.response) {
                setErrMsg("No server response");
            } else if (err.response.status === 400) {
                setErrMsg("Missing username or password");
            } else if (err.response.status === 401) {
                setErrMsg("Unauthorized");
            } else {
                setErrMsg("Login failed");
            }
            errRef.current?.focus();
        }
    };

    return (

        <section className="container">
            <h1>Sign In</h1>
            <h2 ref={errRef} className={errMsg.length ? "errorMessage" : "hide"}>{errMsg}</h2>
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