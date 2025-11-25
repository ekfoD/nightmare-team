import { useRef, useState, useEffect } from "react";
import axios from "axios";
import "../../styles/Register.css";

const REGISTER_URL = "";
const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
function Register() {
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);


    useEffect(() => {
        const result = USER_REGEX.test(user);
        console.log(result);
        console.log(user);
        setValidName(result);
    }, [user])

    useEffect(() => {
        const result = PWD_REGEX.test(pwd);
        console.log(result);
        console.log(pwd);
        setValidPwd(result);
        const match = pwd === matchPwd;
        setValidMatch(match);
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd])

    const handleSubmit = async (e) => {
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);

        if (!v1 || !v2) {
            setErrMsg("InvalidEntry");
            return;
        }
        console.log(user, pwd);
        try {
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({ user, pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(response.data);
            console.log(response.accessToken);
            console.log(JSON.stringify(response));
            setSuccess(true);
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Username Taken');
            } else {
                SetErrMsg('Registration Failed');
            }
            errRef.current.focus();
        }
        setSuccess(true); 
    }

    return (
        <section className={"container"}>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"}>
                {errMsg}
            </p>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">
                    Username:
                    <span className={validName ? "valid" : "hide"}>
                        <img src="../public/checked.png" />
                    </span>
                    <span className={!validName ? "invalid" : "hide"}>
                        <img src="../public/crossed.png" />
                    </span>
                </label> 
                <input
                    type="text"
                    id="username"
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setUser(e.target.value)}
                    required
                    aria-invalid={validName ? "false" : "true"}
                    onFocus={() => setUserFocus(true)}
                    onBlur={() => setUserFocus(false)}
                />

                <label htmlFor="password">
                    Password:
                    <span className={validPwd ? "valid" : "hide"}>
                        <img src="../public/checked.png" />
                    </span>
                </label>
                <input
                    type="password"
                    id="password"
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setPwd(e.target.value)}
                    required
                    aria-invalid={validPwd ? "false" : "true"}
                    onFocus={() => setPwdFocus(true)}
                    onBlur={() => setPwdFocus(false)}
                />

                <label htmlFor="confirm_password">
                    Confirm Password:
                    <span className={validMatch ? "valid" : "hide"}>
                        <img src="../public/checked.png" />
                    </span>
                    <span className={!validMatch ? "valid" : "hide"}>
                        <img src="../public/crossed.png" />
                    </span>
                </label>
                <input
                    type="password"
                    id="confirm_pwd"
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setMatchPwd(e.target.value)}
                    required
                    aria-invalid={validMatch ? "false" : "true"}
                    onFocus={() => setMatchFocus(true)}
                    onBlur={() => setMatchFocus(false)}
                />

                <button disabled={!validName || !validPwd || !validMatch ? true : false}>
                Sign Up
                </button>

            </form>
        </section>    
    );
}

export default Register;