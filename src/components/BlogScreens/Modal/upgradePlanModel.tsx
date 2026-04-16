import React from 'react';
import { useNavigate } from 'react-router-dom';

import './common-modal.scss';
import { Button } from 'antd';

export default function UpgradePlan({ setCurrentScreen }: any) {
  const navigate = useNavigate();

  const handleSubmit = async () => {
    navigate('/account?tab=2');
  };
  return (
    <div className='confirmation-content-wrapper'>
      <div className='confirmation-content-title'>
        <h2>Upgrade Plan</h2>
      </div>
      <div className='confirmation-content'>
        <p className='main-text'>Upgrade your plan to provide reference data through link</p>
        <p className='bottom-text'>Are you sure you want to go to plan details page?</p>
      </div>
      <Button onClick={handleSubmit}>Upgrade</Button>
    </div>
  );
}
