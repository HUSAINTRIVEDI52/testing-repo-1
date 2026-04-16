import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.scss";
import { Button, Input, message, Form, Row, Col } from "antd";
import { CheckCircleFilled, MobileOutlined, CheckCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const countryCodes = []; // Removed manual list as we use react-phone-input-2

export default function MobileVerificationModal({ setMobileModelOpen, userDetail }: any) {
    const [stage, setStage] = useState(0); // 0: Setup, 1: Success
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        firstName: userDetail?.firstName || "",
        lastName: userDetail?.lastName || "",
        mobileNumber: ""
    });
    const [phone, setPhone] = useState("");
    const [countryData, setCountryData] = useState<any>(null);
    // Sync formData with userDetail when it becomes available
    useEffect(() => {
        if (userDetail) {
            let initialFirstName = userDetail.firstName || "";
            let initialLastName = userDetail.lastName || "";
            
            if (!initialFirstName && !initialLastName && userDetail.name) {
                const nameParts = userDetail.name.split(" ");
                initialFirstName = nameParts[0] || "";
                initialLastName = nameParts.slice(1).join(" ") || "";
            }

            setFormData(prev => ({
                ...prev,
                firstName: prev.firstName || initialFirstName,
                lastName: prev.lastName || initialLastName
            }));
        }
    }, [userDetail]);

    // OTP state - kept but not used (OTP flow disabled, no production Twilio)
    // const [otp, setOtp] = useState(["", "", "", ""]);
    // const otpRefs = [useRef<any>(null), useRef<any>(null), useRef<any>(null), useRef<any>(null)];
    
    // useEffect(() => {
    //     if (stage === 1 && otpRefs[0].current) {
    //         otpRefs[0].current.focus();
    //     }
    // }, [stage]);

    const handleInputChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    // Save mobile number directly (no OTP)
    const handleSaveMobile = async () => {
        if (!formData.firstName.trim()) {
            message.error("First name is required");
            return;
        }
        
        // Advanced validation using react-phone-input-2 data
        if (!phone || phone.trim() === "") {
            message.error("Mobile number is required");
            return;
        }

        // Check if the number matches the country's expected format length
        // countryData.format usually looks like "+. (...) ...-...."
        if (countryData && countryData.format) {
            const expectedDigits = countryData.format.replace(/[^.]/g, "").length;
            // phone from react-phone-input-2 includes the dial code and digits
            // We strip everything but digits to check length
            const actualDigits = phone.replace(/\D/g, "").length;
            
            if (actualDigits < expectedDigits) {
                message.error(`Please enter a complete phone number for ${countryData.name}`);
                return;
            }
        } else if (phone.trim().length < 10) {
            // Fallback for when country data is missing
            message.error("Please enter a valid mobile number with country code");
            return;
        }

        setLoading(true);
        try {
            // Ensure single '+' prefix
            const formattedPhone = phone.trim().startsWith("+") ? phone.trim() : "+" + phone.trim();
            
            await axios.post(
                `${process.env.REACT_APP_SERVER_URL}/save-mobile-number`,
                {
                    mobileNumber: formattedPhone,
                    firstName: formData.firstName,
                    lastName: formData.lastName
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            setStage(1); // Go directly to success
        } catch (err: any) {
            // Check for specific error messages or provide a generic one
            const errorMsg = err.response?.data?.error || "Failed to save mobile number";
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // OTP send handler - kept but disabled (no production Twilio account)
    // const handleSendOTP = async () => {
    //     if (!formData.firstName.trim()) {
    //         message.error("First name is required");
    //         return;
    //     }
    //     if (!phone || phone.trim() === "") {
    //         message.error("Mobile number is required");
    //         return;
    //     }
    //     setLoading(true);
    //     try {
    //         await axios.post(
    //             `${process.env.REACT_APP_SERVER_URL}/send-mobile-otp`,
    //             { mobileNumber: "+" + phone },
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    //                 },
    //             }
    //         );
    //         message.success("OTP sent successfully");
    //         setOtp(["", "", "", ""]);
    //         setStage(1); // OTP stage
    //     } catch (err: any) {
    //         message.error(err.response?.data?.error || "Failed to send OTP");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // OTP input handlers - kept but disabled
    // const handleOtpChange = (index: number, value: string) => {
    //     if (isNaN(Number(value))) return;
    //     const newOtp = [...otp];
    //     newOtp[index] = value.substring(value.length - 1);
    //     setOtp(newOtp);
    //     if (value && index < 3) {
    //         otpRefs[index + 1].current.focus();
    //     }
    // };

    // const handleKeyDown = (index: number, e: any) => {
    //     if (e.key === "Backspace" && !otp[index] && index > 0) {
    //         otpRefs[index - 1].current.focus();
    //     }
    // };

    // OTP verification handler - kept but disabled (no production Twilio account)
    // const handleVerifyOTP = async () => {
    //     const otpCode = otp.join("");
    //     if (otpCode.length < 4) {
    //         message.error("Please enter the 4-digit OTP");
    //         return;
    //     }
    //     setLoading(true);
    //     try {
    //         await axios.post(
    //             `${process.env.REACT_APP_SERVER_URL}/verify-mobile-otp`,
    //             { 
    //                 otp: otpCode, 
    //                 mobileNumber: "+" + phone,
    //                 firstName: formData.firstName,
    //                 lastName: formData.lastName
    //             },
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    //                 },
    //             }
    //         );
    //         setStage(2); // Success
    //     } catch (err: any) {
    //         message.error(err.response?.data?.error || "Invalid or expired OTP");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    useEffect(() => {
        let timer: any;
        if (stage === 1 && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        } else if (stage === 1 && countdown === 0) {
            setMobileModelOpen(false);
            window.location.reload();
        }
        return () => clearInterval(timer);
    }, [stage, countdown, setMobileModelOpen]);

    const renderSetup = () => (
        <div className="confirmation-content-wrapper">
            <div className="figma-icon-wrapper" style={{background: 'transparent', padding: 0}}>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M23.3333 13.3333C23.3333 11.1232 22.4554 9.00358 20.8926 7.44078C19.3298 5.87797 17.2101 5 15 5C12.7899 5 10.6702 5.87797 9.10744 7.44078C7.54464 9.00358 6.66667 11.1232 6.66667 13.3333C6.66744 15.5278 7.53429 17.6332 9.0788 19.1921C10.6233 20.751 12.7207 21.6373 14.915 21.6583C15.6325 20.2301 16.5738 18.9259 17.7033 17.795C16.895 18.16 15.9567 18.3333 15 18.3333C13.1433 18.3333 11.7667 17.665 10.9033 16.16C10.9033 16.16 12.3717 15 15 15C16.8983 15 18.6917 15.7083 19.5383 16.2067C20.6739 15.3794 21.9207 14.7167 23.2417 14.2383C23.275 13.9367 23.3333 13.6433 23.3333 13.3333ZM15 13.3333C14.3367 13.3331 13.7007 13.0694 13.2319 12.6003C12.763 12.1311 12.4998 11.4949 12.5 10.8317C12.5002 10.1684 12.7639 9.5324 13.2331 9.06355C13.7022 8.59471 14.3384 8.33145 15.0017 8.33167C15.3301 8.33178 15.6553 8.39657 15.9586 8.52235C16.262 8.64813 16.5376 8.83243 16.7698 9.06473C17.0019 9.29703 17.186 9.57279 17.3116 9.87624C17.4372 10.1797 17.5018 10.5049 17.5017 10.8333C17.5016 11.1617 17.4368 11.4869 17.311 11.7903C17.1852 12.0937 17.0009 12.3693 16.7686 12.6014C16.5363 12.8336 16.2605 13.0177 15.9571 13.1433C15.6536 13.2689 15.3284 13.3334 15 13.3333ZM16.6667 38.3333C16.6667 38.7754 16.4911 39.1993 16.1785 39.5118C15.8659 39.8244 15.442 40 15 40H8.33333C3.73833 40 0 36.2617 0 31.6667V8.33333C0 3.73833 3.73833 0 8.33333 0H21.6667C26.2617 0 30 3.73833 30 8.33333V11.6667C30 12.1087 29.8244 12.5326 29.5118 12.8452C29.1993 13.1577 28.7754 13.3333 28.3333 13.3333C27.8913 13.3333 27.4674 13.1577 27.1548 12.8452C26.8423 12.5326 26.6667 12.1087 26.6667 11.6667V8.33333C26.6667 5.57667 24.4233 3.33333 21.6667 3.33333H8.33333C5.57667 3.33333 3.33333 5.57667 3.33333 8.33333V31.6667C3.33333 34.4233 5.57667 36.6667 8.33333 36.6667H15C15.442 36.6667 15.8659 36.8423 16.1785 37.1548C16.4911 37.4674 16.6667 37.8913 16.6667 38.3333ZM28.3333 16.6667C21.9 16.6667 16.6667 21.9017 16.6667 28.3333C16.6667 34.765 21.9 40 28.3333 40C34.7667 40 40 34.765 40 28.3333C40 21.9017 34.7667 16.6667 28.3333 16.6667ZM28.3333 36.6667C23.7383 36.6667 20 32.9283 20 28.3333C20 23.7383 23.7383 20 28.3333 20C32.9283 20 36.6667 23.7383 36.6667 28.3333C36.6667 32.9283 32.9283 36.6667 28.3333 36.6667ZM11.6667 26.6667C12.1087 26.6667 12.5326 26.8423 12.8452 27.1548C13.1577 27.4674 13.3333 27.8913 13.3333 28.3333C13.3333 28.7754 13.1577 29.1993 12.8452 29.5118C12.5326 29.8244 12.1087 30 11.6667 30H8.33333C7.89131 30 7.46738 29.8244 7.15482 29.5118C6.84226 29.1993 6.66667 28.7754 6.66667 28.3333C6.66667 27.8913 6.84226 27.4674 7.15482 27.1548C7.46738 26.8423 7.89131 26.6667 8.33333 26.6667H11.6667ZM33.7017 26.3133C33.8532 26.4712 33.9722 26.6575 34.0518 26.8614C34.1314 27.0653 34.1701 27.2828 34.1656 27.5017C34.1611 27.7205 34.1136 27.9363 34.0257 28.1368C33.9378 28.3373 33.8113 28.5184 33.6533 28.67L29.9667 32.21C29.2133 32.9533 28.2133 33.3283 27.2117 33.3283C26.21 33.3283 25.205 32.9533 24.4383 32.205L22.5517 30.3583C22.2356 30.0491 22.0553 29.627 22.0505 29.1849C22.0457 28.7428 22.2166 28.3169 22.5258 28.0008C22.835 27.6848 23.2571 27.5045 23.6992 27.4997C24.1413 27.4948 24.5673 27.6658 24.8833 27.975L26.77 29.8217C26.8864 29.9351 27.0425 29.9985 27.205 29.9985C27.3675 29.9985 27.5236 29.9351 27.64 29.8217L31.345 26.265C31.5029 26.1134 31.6891 25.9944 31.893 25.9148C32.0969 25.8352 32.3145 25.7966 32.5333 25.801C32.7522 25.8055 32.968 25.8531 33.1685 25.941C33.3689 26.0289 33.5501 26.1554 33.7017 26.3133Z" fill="#FF7C02"/>
</svg>
            </div>

            <div className="confirmation-content-title">
                <h2>Confirm & Complete setup</h2>
                <p>Your Google profile is linked. Add a mobile number to enable account recovery.</p>
            </div>

            <div className="confirmation-content">
                <Form layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="First Name">
                                <Input 
                                    value={formData.firstName} 
                                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                                    placeholder="John"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Last Name">
                                <Input 
                                    value={formData.lastName} 
                                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                                    placeholder="Doe"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item label="Email Address">
                        <Input value={userDetail?.email} disabled placeholder="john.doe@example.com" />
                    </Form.Item>

                    <Form.Item label="Mobile Number">
                        <PhoneInput
                            country={'in'}
                            value={phone}
                            onChange={(value, data) => {
                                setPhone(value);
                                setCountryData(data);
                            }}
                            inputClass="number-input-standard"
                            containerClass="mobile-input-container"
                            buttonClass="country-dropdown-standard"
                            enableSearch={true}
                            placeholder="Enter your mobile number"
                        />
                    </Form.Item>
                </Form>
            </div>
            
            <Button type="primary" onClick={handleSaveMobile} loading={loading} block className="next-btn">
                Next
            </Button>
        </div>
    );

    // OTP screen - kept but disabled (no production Twilio account)
    // const renderOTP = () => (
    //     <div className="confirmation-content-wrapper">
    //         <div className="figma-icon-wrapper" style={{background: 'transparent', padding: 0}}>
    //             {/* ... icon svg ... */}
    //         </div>
    //         <div className="confirmation-content-title">
    //             <h2>Verify your mobile number</h2>
    //             <p>
    //                 Enter the 4-digit code we sent to<br/>
    //                 <span className="sent-to-number">+{phone}</span> 
    //                 <span className="change-number" onClick={() => { setOtp(["", "", "", ""]); setStage(0); }}>Change Number</span>
    //             </p>
    //         </div>
    //         <div className="confirmation-content">
    //             <div className="otp-input-group">
    //                 {otp.map((digit, index) => (
    //                     <Input
    //                         key={index}
    //                         ref={otpRefs[index]}
    //                         value={digit}
    //                         onChange={(e) => handleOtpChange(index, e.target.value)}
    //                         onKeyDown={(e) => handleKeyDown(index, e)}
    //                         maxLength={1}
    //                     />
    //                 ))}
    //             </div>
    //             <div className="resend-container">
    //                 Did not get a code? <span className="resend-link" onClick={handleSendOTP}>Resend code</span>
    //             </div>
    //         </div>
    //         <div className="button-group">
    //             <Button className="back-btn" onClick={() => { setOtp(["", "", "", ""]); setStage(0); }}>
    //                 Back
    //             </Button>
    //             <Button type="primary" className="verify-btn" onClick={handleVerifyOTP} loading={loading}>
    //                 Verify
    //             </Button>
    //         </div>
    //     </div>
    // );

    const renderSuccess = () => (
        <div className="confirmation-content-wrapper success-screen">
            <div className="figma-icon-wrapper success-icon" style={{background: 'transparent', padding: 0}}>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.82973 11.6342C2.31579 10.5784 2.89356 9.56733 3.5564 8.61255C3.68126 8.43275 3.84032 8.2793 4.02449 8.16097C4.20866 8.04264 4.41433 7.96174 4.62976 7.9229C4.84519 7.88405 5.06617 7.88802 5.28006 7.93457C5.49396 7.98112 5.6966 8.06935 5.8764 8.19422C6.0562 8.31908 6.20965 8.47814 6.32798 8.66231C6.44631 8.84648 6.52721 9.05215 6.56605 9.26758C6.6049 9.48301 6.60093 9.70399 6.55438 9.91788C6.50783 10.1318 6.4196 10.3344 6.29473 10.5142C5.74473 11.3092 5.2614 12.1542 4.85807 13.0292C4.77068 13.2342 4.64306 13.4196 4.48275 13.5745C4.32245 13.7293 4.13272 13.8504 3.9248 13.9306C3.71687 14.0109 3.49496 14.0486 3.27221 14.0415C3.04945 14.0345 2.83037 13.9828 2.62792 13.8896C2.42548 13.7964 2.24378 13.6636 2.09358 13.4989C1.94338 13.3343 1.82772 13.1412 1.75346 12.9311C1.67919 12.7209 1.64783 12.498 1.66122 12.2756C1.6746 12.0531 1.73247 11.8356 1.8314 11.6359L1.82973 11.6342ZM9.3964 6.70755C9.72973 6.70755 10.0664 6.60755 10.3597 6.39922C11.149 5.83887 11.9855 5.34814 12.8597 4.93255C13.0594 4.83997 13.2388 4.70876 13.3874 4.5465C13.5361 4.38423 13.6512 4.19412 13.726 3.98714C13.8009 3.78016 13.834 3.56041 13.8234 3.34058C13.8128 3.12074 13.7589 2.90518 13.6645 2.70632C13.5702 2.50746 13.4375 2.32925 13.2739 2.18198C13.1104 2.03471 12.9193 1.92128 12.7116 1.84826C12.504 1.77524 12.284 1.74406 12.0643 1.75652C11.8445 1.76899 11.6294 1.82485 11.4314 1.92088C10.3847 2.41755 9.3764 3.00922 8.42973 3.68089C8.14091 3.88549 7.92472 4.17672 7.81249 4.51241C7.70026 4.84809 7.6978 5.21079 7.80549 5.54796C7.91318 5.88513 8.12541 6.17926 8.41144 6.38775C8.69747 6.59623 9.04245 6.70824 9.3964 6.70755ZM4.9164 27.0959C4.82602 26.8937 4.69623 26.7115 4.53463 26.56C4.37304 26.4085 4.18287 26.2908 3.97524 26.2137C3.76761 26.1365 3.54669 26.1015 3.32539 26.1108C3.10408 26.12 2.88684 26.1732 2.68635 26.2674C2.48587 26.3615 2.30616 26.4947 2.15773 26.6591C2.0093 26.8235 1.89513 27.0159 1.82189 27.2249C1.74866 27.4339 1.71782 27.6555 1.73118 27.8766C1.74455 28.0977 1.80185 28.3139 1.89973 28.5126C2.38973 29.5576 2.97807 30.5692 3.65307 31.5226C3.77692 31.7073 3.9365 31.8654 4.1224 31.9875C4.3083 32.1096 4.51676 32.1932 4.73549 32.2335C4.95423 32.2738 5.17881 32.2699 5.39601 32.222C5.61322 32.1742 5.81864 32.0833 6.00019 31.9548C6.18173 31.8264 6.33573 31.6628 6.45309 31.4739C6.57046 31.285 6.64883 31.0745 6.68358 30.8548C6.71833 30.6351 6.70876 30.4107 6.65543 30.1948C6.6021 29.9789 6.50609 29.7758 6.37307 29.5976C5.81489 28.8081 5.32745 27.971 4.9164 27.0959ZM3.4014 21.5176C3.31145 20.5537 3.30755 19.5838 3.38973 18.6192C3.40846 18.4012 3.38397 18.1815 3.31767 17.973C3.25136 17.7644 3.14454 17.5709 3.00334 17.4037C2.86213 17.2365 2.68931 17.0988 2.49479 16.9985C2.30026 16.8982 2.08785 16.8373 1.86973 16.8192C0.973066 16.7259 0.148066 17.4226 0.0697327 18.3392C-0.0269898 19.499 -0.0230863 20.6651 0.0813994 21.8242C0.119604 22.2377 0.310798 22.6221 0.617538 22.902C0.924279 23.1819 1.32447 23.3372 1.73973 23.3376C1.78973 23.3376 1.84307 23.3375 1.89473 23.3309C2.11275 23.3108 2.32467 23.248 2.51839 23.1459C2.71211 23.0439 2.88383 22.9048 3.02375 22.7364C3.16366 22.568 3.26903 22.3737 3.33383 22.1645C3.39863 21.9554 3.42159 21.7356 3.4014 21.5176ZM18.3331 3.40755C18.3814 3.40755 19.4881 3.33255 19.9997 3.33255C20.5114 3.33255 21.6181 3.40755 21.6664 3.40755C22.0953 3.40698 22.5075 3.24105 22.8172 2.9443C23.1269 2.64754 23.3103 2.24281 23.3292 1.8143C23.3481 1.38578 23.2011 0.966479 22.9187 0.643621C22.6363 0.320763 22.2403 0.119207 21.8131 0.0808851C20.6066 -0.0269617 19.3929 -0.0269617 18.1864 0.0808851C17.7592 0.119207 17.3632 0.320763 17.0808 0.643621C16.7984 0.966479 16.6514 1.38578 16.6703 1.8143C16.6891 2.24281 16.8725 2.64754 17.1822 2.9443C17.4919 3.24105 17.9041 3.40698 18.3331 3.40755ZM27.0981 4.91588C27.9735 5.32804 28.8111 5.81601 29.6014 6.37422C29.7798 6.50102 29.9815 6.59132 30.1949 6.63994C30.4084 6.68856 30.6293 6.69453 30.845 6.65752C31.0607 6.6205 31.267 6.54123 31.452 6.42426C31.6371 6.30728 31.7971 6.15491 31.9231 5.97588C32.0495 5.79718 32.1395 5.59533 32.1879 5.38185C32.2363 5.16838 32.2421 4.94746 32.2051 4.73171C32.1682 4.51596 32.089 4.30962 31.9723 4.12445C31.8555 3.93929 31.7035 3.77894 31.5247 3.65255C30.5752 2.98076 29.5685 2.39351 28.5164 1.89755C28.1194 1.7291 27.6725 1.72096 27.2696 1.87483C26.8667 2.0287 26.539 2.33262 26.3553 2.72284C26.1717 3.11307 26.1462 3.55926 26.2844 3.96783C26.4226 4.37639 26.7136 4.71557 27.0964 4.91422L27.0981 4.91588ZM29.5614 33.6525C28.7697 34.2076 27.9264 34.6959 27.0514 35.1059C26.7054 35.2647 26.4243 35.5374 26.2551 35.8784C26.086 36.2195 26.0389 36.6082 26.1218 36.9798C26.2047 37.3514 26.4125 37.6833 26.7106 37.9201C27.0087 38.1568 27.379 38.2842 27.7597 38.2809C27.9964 38.2809 28.2364 38.2309 28.4647 38.1226C29.5147 37.6326 30.5264 37.0459 31.4764 36.3792C31.6562 36.2537 31.8095 36.094 31.9275 35.9092C32.0454 35.7244 32.1258 35.5181 32.1639 35.3022C32.202 35.0863 32.1972 34.865 32.1496 34.651C32.1021 34.4369 32.0128 34.2344 31.8868 34.0549C31.7608 33.8755 31.6007 33.7226 31.4156 33.6052C31.2305 33.4877 31.024 33.4079 30.8079 33.3704C30.5919 33.3328 30.3706 33.3383 30.1567 33.3864C29.9428 33.4346 29.7405 33.5261 29.5614 33.6525ZM37.3214 26.2526C37.1234 26.1594 36.9089 26.1063 36.6903 26.0962C36.4717 26.0861 36.2533 26.1193 36.0475 26.1937C35.8418 26.2682 35.6527 26.3825 35.4912 26.5302C35.3297 26.6779 35.199 26.8559 35.1064 27.0542C34.6949 27.931 34.2086 28.7708 33.6531 29.5642C33.4141 29.9262 33.3256 30.367 33.4065 30.7932C33.4873 31.2193 33.7311 31.5971 34.086 31.8464C34.441 32.0957 34.8791 32.1968 35.3074 32.1282C35.7357 32.0597 36.1204 31.8268 36.3797 31.4792C37.0473 30.5279 37.6306 29.5202 38.1231 28.4676C38.216 28.2695 38.2689 28.0551 38.2789 27.8365C38.2889 27.618 38.2557 27.3996 38.1812 27.1939C38.1068 26.9882 37.9925 26.7992 37.845 26.6377C37.6975 26.4762 37.5195 26.3453 37.3214 26.2526ZM38.1264 16.7726C37.6862 16.8103 37.279 17.0213 36.9943 17.3591C36.7096 17.6969 36.5707 18.134 36.6081 18.5742C36.6464 19.0409 36.6681 19.5142 36.6664 19.9992C36.6664 20.4992 36.6431 20.9942 36.6031 21.4809C36.5845 21.6989 36.609 21.9184 36.6752 22.1269C36.7414 22.3354 36.8481 22.5289 36.9891 22.6962C37.1301 22.8635 37.3027 23.0014 37.4969 23.102C37.6912 23.2026 37.9034 23.2639 38.1214 23.2826C38.3394 23.3012 38.5589 23.2766 38.7674 23.2104C38.976 23.1442 39.1694 23.0375 39.3367 22.8965C39.504 22.7555 39.6419 22.583 39.7425 22.3887C39.8431 22.1944 39.9045 21.9822 39.9231 21.7642C40.0227 20.6087 40.0243 19.4467 39.9281 18.2909C39.9127 18.0717 39.8534 17.8578 39.7538 17.662C39.6543 17.4661 39.5164 17.2923 39.3484 17.1507C39.1803 17.0091 38.9856 16.9026 38.7757 16.8377C38.5658 16.7728 38.345 16.7506 38.1264 16.7726ZM12.9864 35.1226C12.108 34.7143 11.2665 34.2308 10.4714 33.6776C10.292 33.5491 10.0888 33.4575 9.87369 33.4082C9.65859 33.3589 9.43583 33.3528 9.21835 33.3902C9.00086 33.4277 8.79298 33.508 8.60677 33.6264C8.42056 33.7448 8.25972 33.8991 8.13359 34.0801C8.00745 34.2612 7.91854 34.4656 7.87201 34.6813C7.82547 34.897 7.82224 35.1198 7.86251 35.3368C7.90277 35.5538 7.98573 35.7606 8.10656 35.9453C8.22739 36.1299 8.3837 36.2888 8.5664 36.4125C9.51973 37.0775 10.5364 37.6626 11.5831 38.1475C11.7819 38.2424 11.9977 38.2969 12.2177 38.3078C12.4378 38.3188 12.6578 38.286 12.8652 38.2114C13.0725 38.1367 13.2629 38.0217 13.4255 37.873C13.5881 37.7243 13.7196 37.5448 13.8123 37.3449C13.9051 37.1451 13.9573 36.9288 13.966 36.7086C13.9746 36.4885 13.9395 36.2688 13.8627 36.0623C13.7859 35.8557 13.6689 35.6665 13.5185 35.5055C13.3681 35.3445 13.1872 35.2149 12.9864 35.1242V35.1226ZM39.5297 7.17255C39.2219 6.85541 38.8006 6.67356 38.3587 6.667C37.9167 6.66044 37.4902 6.8297 37.1731 7.13755L21.2514 22.6009C20.7863 23.0616 20.1599 23.3226 19.5053 23.3285C18.8508 23.3345 18.2197 23.0848 17.7464 22.6326L11.0914 16.1992C10.7732 15.895 10.3475 15.729 9.90736 15.7375C9.46718 15.746 9.04825 15.9283 8.74204 16.2446C8.43584 16.561 8.26723 16.9856 8.27305 17.4258C8.27886 17.866 8.45862 18.2861 8.77307 18.5942L15.4281 25.0276C16.5182 26.0779 17.9742 26.6631 19.4881 26.6592C20.9814 26.6592 22.4714 26.0959 23.5897 24.9759L39.4931 9.52922C39.8102 9.22134 39.9921 8.80009 39.9986 8.35813C40.0052 7.91618 39.8359 7.48972 39.5281 7.17255H39.5297ZM21.4731 36.6026C20.9992 36.6439 20.5238 36.6651 20.0481 36.6659C19.5364 36.6542 19.0547 36.6459 18.5681 36.6059C18.1276 36.5708 17.6912 36.7116 17.3542 36.9973C17.0173 37.2831 16.8071 37.6906 16.7697 38.1309C16.7338 38.5715 16.8742 39.0084 17.1601 39.3456C17.4461 39.6828 17.8541 39.8927 18.2947 39.9292C18.8747 39.9759 19.4064 39.9875 20.0531 39.9992C20.6297 39.9992 21.2014 39.9725 21.7664 39.9226C21.9869 39.9065 22.2019 39.8468 22.3991 39.7468C22.5962 39.6469 22.7715 39.5087 22.9148 39.3404C23.058 39.172 23.1664 38.9769 23.2335 38.7662C23.3006 38.5556 23.3251 38.3338 23.3057 38.1136C23.2862 37.8934 23.2231 37.6793 23.1201 37.4837C23.0172 37.2881 22.8763 37.115 22.7057 36.9744C22.5352 36.8337 22.3384 36.7285 22.1268 36.6646C21.9151 36.6008 21.6929 36.5797 21.4731 36.6026Z" fill="#FF7C02"/>
</svg>
            </div>
            <div className="confirmation-content-title">
                <h2>Phone number saved</h2>
                <p>Your mobile number has been saved successfully.</p>
                <p style={{ marginTop: '10px', fontSize: '12px', color: '#999' }}>Redirecting to dashboard in {countdown} seconds...</p>
            </div>
            <Button type="primary" onClick={() => { setMobileModelOpen(false); window.location.reload(); }} block className="next-btn">
                Go To Dashboard
            </Button>
        </div>
    );

    return (
        <>
            {stage === 0 && renderSetup()}
            {/* {stage === 1 && renderOTP()} */}{/* OTP stage disabled - no production Twilio account */}
            {stage === 1 && renderSuccess()}
        </>
    );
}
