import React from 'react';
import BrandVoice from '../../components/BrandVoice/BrandVoice';
import Canonical from '../../utils/Canonical';

const BrandVoicePage = () => {
  return (
    <>
      <Canonical path='/brand-voice' title='brand voice' />
      <BrandVoice />
    </>
  );
};

export default BrandVoicePage;
