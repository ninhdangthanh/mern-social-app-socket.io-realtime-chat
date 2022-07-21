import axios from "axios";
import { useRef, useState } from "react";
import "./register.css";
import { useHistory } from "react-router";

export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const history = useHistory();
  const [loginSuccess, setLoginSuccess] = useState('')
  const [loginFailed, setLoginFailed] = useState('')

  const handleClick = async (e) => {
    e.preventDefault();
    if (passwordAgain.current.value !== password.current.value) {
      passwordAgain.current.setCustomValidity("Passwords don't match!");
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      try {
        const newU = await axios.post("/auth/register", user);
        const res = await axios.get('/users/all')
        let allU = res.data.map(u => u._id)
        // console.log('register', allU, newU.data._id)

        allU.forEach(async uId => {
          if(uId !== newU.data._id) {
            const res = await axios.post(`/conversations/${newU.data._id}/${uId}`)
            console.log('convOK', res.data, JSON.stringify({
              "senderId": newU.data._id,
              "receiverId": uId
            }))
          }
        })
        // history.push("/login");
        setLoginSuccess("Đăng kí thành công")
      } catch (err) {
        console.log(err);
        setLoginFailed("Đăng kí thất bại (Thử lại với thông tin khác)")
      }
    }
  };

  const handleLogin = () => {
    history.push("/login");
  }

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Lamasocial</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on Lamasocial.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input
              placeholder="Username"
              required
              ref={username}
              className="loginInput"
            />
            <input
              placeholder="Email"
              required
              ref={email}
              className="loginInput"
              type="email"
            />
            <input
              placeholder="Password"
              required
              ref={password}
              className="loginInput"
              type="password"
              minLength="6"
            />
            <input
              placeholder="Password Again"
              required
              ref={passwordAgain}
              className="loginInput"
              type="password"
            />
            <button className="loginButton" type="submit">
              Sign Up
            </button>
            <button onClick={handleLogin} className="loginRegisterButton">Log into Account</button>
            <br />
            {loginSuccess ? 
            <div><strong style={{color:"green",fontSize:18}}><center>{loginSuccess}</center></strong></div>
            : <></>}
            {loginFailed ? 
            <div><strong style={{color:"red",fontSize:18}}><center>{loginFailed}</center></strong></div>
            : <></>}
          </form>
        </div>
      </div>
    </div>
  );
}
