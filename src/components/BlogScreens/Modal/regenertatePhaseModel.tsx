import React from 'react';

import './common-modal.scss';
import { Button } from 'antd';

export default function RegeneratePhasedModal({ setCurrentScreen, setRegenerate }: any) {
  const handleClick = async () => {
    setRegenerate(true);
    setCurrentScreen(5);
  };
  return (
    <div className='confirmation-content-wrapper'>
      <div className='confirmation-content-title'>
        <h2>Regenerate blog</h2>
      </div>
      <div className='confirmation-content'>
        <p className='main-text'>Re-Generation will use your 1 Re-Generation count.</p>
        <p className='bottom-text'>Are you sure you want to re-generate?</p>
      </div>
      <Button onClick={handleClick}>Regenerate</Button>
    </div>
  );
}
