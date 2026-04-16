import { Divider } from "antd";
import img1 from "../../assets/images/Bloggr.ai.png";
import googleImg from "../../assets/images/flat-color-icons_google.png";
import "./auth.scss";
import React from "react";

function CommonAuth() {
  return (
    <>
      <img className="logo" src={img1} alt="logo" />
      <div className="top-section-details">
        <h2>Hi 👋, let’s get familiar.</h2>
        <p>Let's create account and start writing blogs.</p>
      </div>
      <div className="google-login">
        <button
          onClick={() => {
            window.location.href = `${process.env.REACT_APP_SERVER_URL}/google`;
          }}
        > <img src={googleImg} alt="google" />Continue with Google</button>
        <Divider>or</Divider>
      </div>
    </>
  );
}

export default CommonAuth;
