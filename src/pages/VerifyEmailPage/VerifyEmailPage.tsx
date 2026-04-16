import React from 'react';
import VerifyEmail from '../../components/VerifyEmail/VerifyEmail';
import Canonical from '../../utils/Canonical';

function VerifyEmailPage() {
  return (
    <div>
      <Canonical path='/verify-email' title='Contact Us | My Website' />
      <VerifyEmail />
    </div>
  );
}

export default VerifyEmailPage;
