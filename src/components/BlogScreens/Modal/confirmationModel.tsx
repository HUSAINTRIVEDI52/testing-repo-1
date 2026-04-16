import React, { useState } from 'react';

import './common-modal.scss';
import { Button, Input, message } from 'antd';

export default function ConfirmationModal({ setCurrentScreen }: any) {
  const handleSubmit = async () => {
    setCurrentScreen(5);
  };
  return (
    <div className='confirmation-content-wrapper'>
      <div className='confirmation-content-title'>
        <h2>Generating Outlines</h2>
      </div>
      <div className='confirmation-content'>
        <p className='main-text'>You won't be able to change previous data after generating outline.</p>
        <p className='bottom-text'>Are you sure you want generate outline?</p>
      </div>
      <Button onClick={handleSubmit}>Generate Outline</Button>
    </div>
  );
}
