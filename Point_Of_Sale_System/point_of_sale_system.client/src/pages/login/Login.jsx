import { useRef, useState } from 'react';
import useAuth from "../../hooks/useAuth.jsx"
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import axios from "axios";
import "../../styles/Register.css";

const LOGIN_URL = 'http://localhost:5098/api/login';

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

    const handleSubmit = async(e) => {
        e.preventDefault();
        setErrMsg("");
        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ username: user, password: pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            setAuth({ role: response.data.role, businessType: response.data.businessType });
            setUser('');
            setPwd('');
            navigate(from, { replace: true });
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current?.focus();
        }
    }

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