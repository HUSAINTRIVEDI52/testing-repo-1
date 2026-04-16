import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ConfigProvider } from 'antd';
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import RouteChangeListener from './components/PostHog/RouteChangeListener';
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

posthog.init(`${process.env.REACT_APP_POSTHOG_API_KEY}`, {
  api_host: 'https://us.i.posthog.com',
  defaults: '2025-05-24',

    before_send: (event: any) => {
      const completionSurveyId = process.env.REACT_APP_POST_HOG_BLOG_COMPLETION_SURVEY_ID;
    
      if (
        (event.event === 'survey sent' || event.event === 'survey dismissed') &&
        event.properties.$survey_id === completionSurveyId
      ) {
        window.location.href = '/theta-wave/app/my-blog'; // overrides the setTimeout
      }
    
      return event;
    }
})

root.render(
  <BrowserRouter basename='/theta-wave/app'>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#FF7C02'
        }
      }}
    >
        <RouteChangeListener />
     <PostHogProvider client={posthog}>
      <App />
    </PostHogProvider>
    </ConfigProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
