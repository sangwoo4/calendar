import React, {useState} from 'react';
import './LoginForm.css';
import { FaUser, FaLock } from "react-icons/fa";

const LoginForm = (props) => {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className='login-from'>
            <form action="">
                <h1>Login</h1>
                <div className="input-id-box">
                    <input type="text" placeholder='Username' required 
                    onChange={event => {
                        setId(event.target.value);
                    }}/>
                    <FaUser className='icon' />
                </div>

                <div className="input-password-box" >
                    <input type="password" placeholder='Password' required
                    onChange={event => {
                        setPassword(event.target.value);
                    }}/>
                    <FaLock className='icon' />
                </div>

                <div className="remember-forgot">
                    <label><input type="checkbox" />Remember me</label>
                    <a href="#">Forgot password?</a>
                </div>

                <button className="btn" type="button" value="로그인"
                    onClick={() => {
                        console.log('click');
                        const userData = {
                            userId: id,
                            userPassword: password,
                        };

                        console.log("전송할 데이터:", userData); // 콘솔에 데이터 출력

                        fetch("http://localhost:5000", {
                            method: "post",
                            headers: {
                                "content-type": "application/json",
                            },
                            body: JSON.stringify(userData),
                        })

                        .then((res) => res.json())
                        .then((json) => {            
                            if(json.isLogin === "True"){
                                props.setMode("WELCOME");
                            } else {
                                alert(json.isLogin);
                            }
                        })
                    }
                }> Login </button>

                <div className="register-link">
                    <p>Don't have an account? <a href="#">Register</a></p>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;