import React, { useContext } from 'react';
import Home from '../../components/Home/Home';
import Canonical from '../../utils/Canonical';
import { GlobalContext } from '../../Context';
import posthog from 'posthog-js';

const HomePage = () => {
  const { userName }: any = useContext(GlobalContext);
  const userId = localStorage.getItem('userId');

  if (userId) {
    posthog.identify(userId, {
      name: userName,
    });
  }
  return (
    <>
      <Canonical path='/' title='Home' />
      <Home />
    </>
  );
};

export default HomePage;
