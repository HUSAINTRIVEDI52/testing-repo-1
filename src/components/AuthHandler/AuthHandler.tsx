import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function AuthHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const jwtToken = params.get('token');
    const userId: any = params.get('userId');

    if (jwtToken) {
      localStorage.setItem('accessToken', jwtToken);
      localStorage.setItem('userId', userId);
      // Use replaceState to replace the history entry
      window.history.replaceState({}, '', `${process.env.REACT_APP_BASE_NAME}`);

      // Navigate to homepage and replace the history entry
      window.location.href = `${process.env.REACT_APP_BASE_NAME}`;
    } else {
      // Use replaceState to replace the history entry
      window.history.replaceState({}, '', `${process.env.REACT_APP_BASE_NAME}/login`);

      // If there's no token, redirect to login page
      window.location.href = `${process.env.REACT_APP_BASE_NAME}/login`;
    }
  }, [location.search, navigate]);
  return <div></div>;
}

export default AuthHandler;
