// routes.ts
import React from 'react';

import AccountPage from './pages/Account/AccountPage';
import AiModelPage from './pages/AiModel/AiModelPage';
import AiPersonaPage from './pages/AiPersona/AiPersonaPage';
import BlogEditPage from './pages/BlogEdit/BlogEditPage';
import BrandVoicePage from './pages/BrandVoice/BrandVoicePage';
import CreateAiPersonaPage from './pages/CreateAiPersona/CreateAiPersonaPage';
import CreateBlogPage from './pages/CreateBlog/CreateBlogPage';
import CreateStyleGuidePage from './pages/CreateStyleGuidePage/CreateStyleGuidePage';
import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/Login/LoginPage';
import MyBlogPage from './pages/MyBlog/MyBlogPage';
// import OnboardingPage from "./pages/Onboarding/OnboardingPage";
import RegisterPage from './pages/Register/RegisterPage';
import StyleGuidePage from './pages/StyleGuide/StyleGuidePage';
import VerifyEmail from './pages/VerifyEmailPage/VerifyEmailPage';
import CardDetails from './pages/PlanCheckout/PlanCheckout';
import CreateBlogIframe from './components/CreateBlogIframe/CreateBlogIframe';
import BlogJourneyPage from './pages/BlogJourney/BlogJourneyPage';

export interface RouteInterface {
  id: number;
  path: string;
  label: string;
  element: React.ReactNode;
  layout: string;
}

const routes: RouteInterface[] = [
  {
    id: 1,
    path: '/',
    label: 'Home',
    element: <HomePage />,
    layout: 'private'
  },
  {
    id: 2,
    path: '/login',
    label: 'Login',
    element: <LoginPage />,
    layout: 'public'
  },
  {
    id: 3,
    path: '/register',
    label: 'Register',
    element: <RegisterPage />,
    layout: 'public'
  },
  // {
  //   id: 4,
  //   path: "/onboarding",
  //   label: "Onboarding",
  //   element: <OnboardingPage />,
  //   layout: "public",
  // },
  {
    id: 5,
    path: '/createblog',
    label: 'CreateBlog',
    element: <CreateBlogPage />,
    layout: 'private'
  },
  {
    id: 6,
    path: '/blog-edit/:id',
    label: 'Blog Edit',
    element: <BlogEditPage />,
    layout: 'private'
  },
  {
    id: 7,
    path: '/my-blog',
    label: 'My Blog',
    element: <MyBlogPage />,
    layout: 'private'
  },
  {
    id: 8,
    path: '/brand-voice',
    label: 'Brand Voice',
    element: <BrandVoicePage />,
    layout: 'private'
  },
  {
    id: 9,
    path: '/blog-guideline',
    label: 'Ai Persona',
    element: <AiPersonaPage />,
    layout: 'private'
  },
  {
    id: 10,
    path: '/create-blog-guideline',
    label: 'Create Ai Persona',
    element: <CreateAiPersonaPage />,
    layout: 'private'
  },
  // {
  //   id: 11,
  //   path: "/style-guide",
  //   label: "Style Guide",
  //   element: <StyleGuidePage />,
  //   layout: "private",
  // },
  // {
  //   id: 12,
  //   path: "/create-style-guide",
  //   label: "Create Style Guide",
  //   element: <CreateStyleGuidePage />,
  //   layout: "private",
  // },
  {
    id: 13,
    path: '/ai-model',
    label: 'Ai Model',
    element: <AiModelPage />,
    layout: 'private'
  },
  {
    id: 14,
    path: '/account',
    label: 'Account',
    element: <AccountPage />,
    layout: 'private'
  },
  {
    id: 15,
    path: '/verify-email',
    label: 'Verify Email',
    element: <VerifyEmail />,
    layout: 'private'
  },
  {
    id: 15,
    path: '/plan-checkout',
    label: 'Checkout',
    element: <CardDetails />,
    layout: 'private'
  },
  {
    id: 16,
    path: '/blog-journey',
    label: 'Blog Journey',
    element: <BlogJourneyPage />,
    layout: 'public'
  }
];

export default routes;
