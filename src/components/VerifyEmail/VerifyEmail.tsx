import { message } from "antd";
import axios from "axios";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function VerifyEmail() {
    const location = useLocation();
    const navigate = useNavigate()
    const verifyEmail = async () => {
        //get token from query params
        const token: any = new URLSearchParams(location.search).get("token");
        try {
            const result = await axios.get(
                `${process.env.REACT_APP_SERVER_URL}/verifyEmail?token=${token}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            if (result.status == 200) {
                message.success("Email changed");
                navigate("/profile");

            } else {

                message.error(result?.data?.error);

            }
        } catch (error: any) {
            message.error(
                error?.response?.data?.error
                    ? error?.response?.data?.error
                    : error?.message
            );
        }

    }
    useEffect(() => {
        verifyEmail()
    }, [])
    return <div>Your email verification is in process please wait..</div>;
}

export default VerifyEmail;
