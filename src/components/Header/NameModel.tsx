import React, { useContext, useState } from "react";

import "./Header.scss";
import { Button, Input, message } from "antd";
import axios from "axios";
import { GlobalContext } from "../../Context";

export default function NameConfirmation({ setModelOpen }: any) {
  const userId = localStorage.getItem("userId");
  const [name, setName] = useState<any>();
  const { setUserName }: any = useContext(GlobalContext);
  const [error, setError] = useState("");

  const handleInputChange = (event: any) => {
    setName(event.target.value);
    if (event.target.value.trim() !== "") {
      setError("");
    }
  };
  const handleSubmit = async () => {
    if (name?.trim() == "") {
      setError("Name is required");
      return;
    }
    const data = new FormData();
    data.append("name", name);

    axios
      .put(
        `${process.env.REACT_APP_SERVER_URL}/updateuser?userId=${userId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
      .then((res) => {
        if (res.status == 200) {
          message.success("Profile updated successfully");
          setUserName(name);
          setModelOpen(false);
          window.location.reload();
        } else {
          message.error(res?.data?.error);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="confirmation-content-wrapper">
      <div className="confirmation-content-title">
        <h2>Add your name</h2>
      </div>
      <div className="confirmation-content">
        <p className="main-text">Please help us by providing your name</p>
        <Input
          value={name}
          className="bottom-text"
          placeholder="Name"
          onChange={handleInputChange}
        />
        {error && (
          <p className="error-text" style={{ color: "red" }}>
            {error}
          </p>
        )}
      </div>
      <Button onClick={handleSubmit} disabled={!name}>
        Save
      </Button>
    </div>
  );
}
