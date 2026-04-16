import React from 'react';
import { Button, Form, Input, message } from 'antd';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './auth.scss';
import blogImg from '../../assets/images/write-blog.png';
import CommonAuth from './CommonAuth';

export default function Register() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const passwordRules: any = [
    {
      validator: (_: any, value: any) => {
        if (!value) {
          return Promise.reject(new Error('Password is Required'));
        }
        const trimmedValue: any = value.trim();

        if (trimmedValue.length < 8) {
          return Promise.reject(new Error('At least 8 characters long'));
        }
        if (!/\d/.test(trimmedValue)) {
          return Promise.reject(new Error('At least one numeric digit'));
        }
        if (!/[a-z]/.test(trimmedValue)) {
          return Promise.reject(new Error('At least one lowercase letter'));
        }
        if (!/[A-Z]/.test(trimmedValue)) {
          return Promise.reject(new Error('At least one uppercase letter'));
        }
        if (!/[^A-Za-z0-9]/.test(trimmedValue)) {
          return Promise.reject(new Error('At least one special character'));
        }
        return Promise.resolve();
      }
    }
  ];
  const onFinish = async (values: any) => {
    try {
      const result = await axios.post(`${process.env.REACT_APP_SERVER_URL}/register`, values);
      if (result.status !== 201) {
        message.error(result?.data?.error);
      } else {
        message.success(result.data.message || 'user created');
        localStorage.setItem('accessToken', result?.data?.token);
        localStorage.setItem('userId', result?.data?.user?.id);
        form.resetFields();
        navigate('/onboarding');
      }
    } catch (error: any) {
      message.error(error?.response?.data?.error ? error?.response?.data?.error : error?.message);
    }
  };

  return (
    <div className='auth-wrapper'>
      <div className='left'>
        <div className='content-wrapper'>
          <CommonAuth />
          {/* Register form starting */}
          <Form layout={'vertical'} form={form} name='registeriform' onFinish={onFinish} className='register-form'>
            <Form.Item label={'Continue with email'} required className='no-input' />
            <Form.Item name='email' rules={[{ required: true, type: 'email', message: 'Please enter Email' }]}>
              <Input placeholder='Enter your email address' />
            </Form.Item>
            <Form.Item name='username' rules={[{ required: true, message: 'Please enter Username' }]}>
              <Input className='input-box' placeholder='Enter your full name' />
            </Form.Item>
            <Form.Item name='password' rules={passwordRules}>
              <Input.Password placeholder='Password' />
            </Form.Item>
            <Form.Item>
              <Button type='primary' htmlType='submit'>
                Sign up
              </Button>
            </Form.Item>
            <Form.Item className='account-check'>
              Already have an account?<Link to={'/login'}>Sign In</Link>
            </Form.Item>
          </Form>
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
