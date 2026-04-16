import React, { useContext, useEffect, useState } from 'react';
import { Radio, Button, message } from 'antd';
import './Onboarding.scss';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../Context';
import axios from 'axios';
import { onboardingConfigs } from './Onboarding.config';

function Onboarding({ setOnboard, name }: any) {
  const navigate = useNavigate();
  const { identity, role, search, setIdentity, setRole, setSearch }: any = useContext(GlobalContext);
  const [loader, setLoader] = useState(false);
  const userId = localStorage.getItem('userId');
  const [current, setCurrent] = useState(1);
  const data = onboardingConfigs[current - 1]?.data || [];
  const heading = onboardingConfigs[current - 1]?.heading;
  const isBack = current > 1;

  // Handle radio button selection
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (current === 1) setIdentity(value);
    else if (current === 2) setRole(value);
    else setSearch(value);
  };

  // Store user lead details
  const storeLeadsDetails = async () => {
    const payload = { identity, role, search, userId };
    try {
      const { data, status } = await axios.post(`${process.env.REACT_APP_SERVER_URL}/leads`, payload);
      if (status === 201) {
        setOnboard(false);
        message.success(data?.message || 'Details saved successfully');
        navigate('/');
      } else {
        message.error(data?.error || 'Failed to save details');
      }
    } catch (error: any) {
      message.error(error?.response?.data?.error || error.message || 'An error occurred');
    }
  };

  // Navigate to the next step
  const nextHandler = () => {
    if (current < 3) setCurrent(current + 1);
    else storeLeadsDetails();
  };

  // Navigate to the previous step
  const backHandler = () => {
    if (current > 1) setCurrent(current - 1);
  };

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     setLoader(true);
  //     try {
  //       const { data } = await axios.get(`${process.env.REACT_APP_SERVER_URL}/getuser`, {
  //         params: { userId },
  //         headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
  //       });
  //     } catch (err) {
  //       console.error('Error fetching user data:', err);
  //     } finally {
  //       setLoader(false);
  //     }
  //   };

  //   fetchUserData();
  // }, []);

  return (
    <div className='onboarding-parent'>
      <div className='onboarding-container'>
        <h1>
          <span>Hi, {name}</span>
          Let us know you better...
        </h1>
        <div className='count-step'>
          {onboardingConfigs.map((step: any, index: any) => {
            if (index === onboardingConfigs.length) {
              return;
            }
            return <div key={step?.id} className={`step ${index < current && 'active'}`}></div>;
          })}
        </div>
        <div className='detail-list'>
          <h3>{heading}</h3>
          <Radio.Group value={current === 1 ? identity : current === 2 ? role : search}>
            {data.map((item) => (
              <Radio key={item} value={item} onChange={(e: any) => handleCheckboxChange(e)}>
                {item}
              </Radio>
            ))}
          </Radio.Group>
        </div>
      </div>

      <div className='bottom-section'>
        {isBack && (
          <Button className='back' type='default' onClick={backHandler}>
            Back
          </Button>
        )}
        <Button className='next' type='primary' onClick={nextHandler} loading={loader}>
          {current === 3 ? 'Let’s Get Started' : 'Next'}
        </Button>
      </div>
    </div>
  );
}

export default Onboarding;
