import React, { useState } from "react";

import { useDispatch } from "react-redux";

import { login } from "./store/authSlice";
import { ApiAxios } from "./Api";

function AccessDenied() {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const loginAnswer = await ApiAxios.post("/login", {
        email,
        password,
        'formType': 'username'
      });
      localStorage.setItem("user", JSON.stringify(loginAnswer.data.user));
      localStorage.setItem("token", loginAnswer.data.token);
      dispatch(login());
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="access-denied">
      <h2>Login Required</h2>
      <p>You are not logged in. Please login and try again</p>
      <form className="login-form" onSubmit={handleLogin}>
        <div className="form-line">
          <input
            type="text"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-line">
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-line">
          <button className="btn btn-primary" type="submit">
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default AccessDenied;
