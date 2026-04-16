import React, { useContext, useState } from 'react';

import './common-modal.scss';
import { Button, Input, message } from 'antd';
import { GlobalContext } from '../../../Context';

export default function ConfirmResetModal({ setIsResetModalOpen, isResetModalOpen }: any) {
  const {
    step1Data,
    setStep1Data,
    setCurrentScreen,
    step3Data,
    setVisited,
    currentScreen,
    setStep2Data,
    setStep3Data,
    setStep4Data,
    setBrandVoice,
    setParsona,
    setCategories,
    setSelectedModel,
    userModel
  }: any = useContext(GlobalContext);
  const handleSubmit = async () => {
    setVisited(currentScreen);
    if (currentScreen < 2) {
      setStep2Data({
        scrappedUrl: [],
        files: []
      });

      if (currentScreen < 3) {
        setStep4Data({
          links: []
        });
        if (currentScreen < 4) {
          setBrandVoice([]);
          setParsona([]);
          setSelectedModel(userModel);
          if (currentScreen < 5) {
            setCategories([]);
          }
        }
      }
    }
    setIsResetModalOpen(false);
  };
  return (
    <div className='confirmation-content-wrapper'>
      <div className='confirmation-content-title'>
        <h2>Confirm reset</h2>
      </div>
      <div className='confirmation-content'>
        <p className='main-text'>If you change this value you will lost your dependent Data.</p>
        <p className='bottom-text'>Are you sure you want to change this field?</p>
      </div>
      <Button onClick={handleSubmit}>Yes</Button>
    </div>
  );
}
