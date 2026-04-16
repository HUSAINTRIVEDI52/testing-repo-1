import React, { useEffect } from 'react';
import FirstStepOnboarding from '../../components/Onboarding/FirstStepOnboarding';
import SecondStepOnboarding from '../../components/Onboarding/SecondStepOnboarding';
import OnboardingIdentity from '../../components/Onboarding/OnboardingIdentity';
import { useLocation } from 'react-router-dom';

function OnboardingPage() {
  // const location = useLocation();
  // const id = location.state?.id;
  // useEffect(() => {
  //     const params = new URLSearchParams(location.search);
  //     const jwtToken = params.get("token");
  //     const userId: any = params.get("userId");
  //     if (jwtToken) {
  //         localStorage.setItem("accessToken", jwtToken);
  //         localStorage.setItem("userId", userId);
  //     }
  // }, []);
  // switch (id) {
  //     case 1:
  //         return <FirstStepOnboarding />;
  //     case 2:
  //         return <SecondStepOnboarding />;
  //     default:
  //         return <OnboardingIdentity /> // Render OnboardingIdentity by default
  // }
}

export default OnboardingPage;
