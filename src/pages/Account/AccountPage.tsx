import React from 'react';
import Account from '../../components/Account/Account';
import Canonical from '../../utils/Canonical';

const AccountPage = () => {
  return (
    <>
      <Canonical path='/account' title='profile' />
      <Account />
    </>
  );
};

export default AccountPage;
