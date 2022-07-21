import { useContext, useRef } from "react";
import "./login.css";
import { loginCall, googleLoginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import GoogleLogin from 'react-google-login';
import { gapi } from "gapi-script";
import axios from "axios";

gapi.load("client:auth2", () => {
  gapi.client.init({
    clientId:
    "665674215864-n0m8keq2ee6kolgseq8uvdogrpm85gm0.apps.googleusercontent.com",
    plugin_name: "chat",
  });
});

export default function Login() {
  const email = useRef();
  const password = useRef();
  const { isFetching, dispatch } = useContext(AuthContext);
  const history = useHistory();

  const handleClick = (e) => {
    e.preventDefault();
    loginCall(
      { email: email.current.value, password: password.current.value },
      dispatch
    );
  };

  const handleRegister = () => {
    history.push("/");
  }

  const handleFailure = (result) => {
    console.log(result);
  };

  const handleLogin = async (googleData) => {
    const res = await fetch('/auth/google-login', {
      method: 'POST',
      body: JSON.stringify({
        token: googleData.tokenId,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    if(data.new) {
      console.log('new true')
      const res = await axios.get('/users/all')
      let allU = res.data.map(u => u._id)

      allU.forEach(async uId => {
        if(uId !== data.user._id) {
          const res = await axios.post(`/conversations/${data.user._id}/${uId}`)
          console.log('convOK', res.data, JSON.stringify({
            "senderId": data.user._id,
            "receiverId": uId
          }))
        }
      })
    } else {
      console.log('new false')
    }
    googleLoginCall(data.user, dispatch)
  };

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
              placeholder="Email"
              type="email"
              required
              className="loginInput"
              ref={email}
            />
            <input
              placeholder="Password"
              type="password"
              required
              minLength="6"
              className="loginInput"
              ref={password}
            />
            <button className="loginButton" type="submit" disabled={isFetching}>
              {isFetching ? (
                <CircularProgress color="white" size="20px" />
              ) : (
                "Log In"
              )}
            </button>
            <div className="ggWrapper">
              {isFetching ? (
                <CircularProgress color="white" size="20px" />
              ) : (
                <div className="ggLogin">
                <GoogleLogin
                  clientId="665674215864-n0m8keq2ee6kolgseq8uvdogrpm85gm0.apps.googleusercontent.com"
                  buttonText="Log in with Google"
                  onSuccess={handleLogin}
                  onFailure={handleFailure}
                  cookiePolicy={'single_host_origin'}
                ></GoogleLogin>
                </div>
              )}
            </div>
            <span className="loginForgot">Forgot Password?</span>
            <button onClick={handleRegister} className="loginRegisterButton">
              {isFetching ? (
                <CircularProgress color="white" size="20px" />
              ) : (
                "Create a New Account"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
