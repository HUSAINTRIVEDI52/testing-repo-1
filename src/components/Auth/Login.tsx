import React, { useEffect } from 'react';
import { Divider, Form, message } from 'antd';
import axios from 'axios';
import './auth.scss';
import img1 from '../../assets/images/Bloggr.ai.png';
import logo from '../../assets/icons/Bloggr.ai.svg';

import googleImg from '../../assets/images/flat-color-icons_google.png';
import microsofrtImg from '../../assets/images/microsoft.png';
import { useNavigate } from 'react-router-dom';
import blogImg from '../../assets/images/write-blog.png';

function Login() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      const result = await axios.post(`${process.env.REACT_APP_SERVER_URL}/login`, values);
      if (result.status !== 200) {
        message.error(result?.data?.error);
      } else {
        message.success(result?.data?.message);
        localStorage.setItem('accessToken', result.data.token);
        localStorage.setItem('userId', result.data.userId);
        form.resetFields();
        navigate('/');
      }
    } catch (error: any) {
      message.error(error?.response?.data?.error ? error?.response?.data?.error : error?.message);
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem('accessToken');

      if (token) {
        navigate('/');
      }
    }, 500);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);
  return (
    <div className='auth-wrapper'>
      <div className='left'>
        <div className='content-wrapper'>
          <img
            className='logo'
            src={logo}
            alt='logo'
            onClick={() => {
              window.location.href = `${process.env.REACT_APP_URL}`;
            }}
            style={{ cursor: 'pointer' }}
          />
          <div className='top-section-details'>
            <h2>Hi 👋, let’s get familiar.</h2>
            <p>Let's create account and start writing blogs.</p>
          </div>
          <div className='google-login'>
            <button
              onClick={() => {
                window.location.href = `${process.env.REACT_APP_SERVER_URL}/google`;
              }}
            >
              <img src={googleImg} alt='google' />
              Continue with Google
            </button>
            <Divider>or</Divider>
            <button
              onClick={() => {
                window.location.href = `${process.env.REACT_APP_SERVER_URL}/auth/microsoft`;
              }}
            >
              <img src={microsofrtImg} height='15' alt='microsoft' />
              Continue with Microsoft
            </button>
          </div>
        </div>
      </div>
      <div className='right'>
        <div className='auth-blog-content'>
          <img className='blog-img' src={blogImg} alt='blog-img' />
          <h3>Conquer writer's block once and for all with Bloggr.ai.</h3>
          <p>
            Effortlessly create SEO-optimized, original content of any type in minutes with Bloggr.ai. Automate your
            content marketing to streamline your workflow and focus on growing your business.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
