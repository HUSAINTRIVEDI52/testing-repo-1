import React, { useCallback } from "react";
import useRouteChangeExcludingPage from "../../hooks/useRouteChangeExcludingPage";
import posthog from "posthog-js";
import { useSearchParams } from "react-router-dom";

const CREATE_BLOG_PATH = "/theta-wave/app/createblog";

const RouteChangeListener: React.FC = () => {
  const onRouteChange = useCallback((prev: string, current: string,pageNumber:any) => {

    
    console.log("page",typeof pageNumber);

    const leavingCreateBlog =
      prev.startsWith(CREATE_BLOG_PATH) && !current.startsWith(CREATE_BLOG_PATH);

    // Get blog mode from localStorage
    const blogMode = localStorage.getItem('blog-mode');

    if (leavingCreateBlog && blogMode === 'create') {
      console.log("🚀 Leaving create blog page → trigger survey");

      // ✅ Trigger PostHog survey event
     posthog.displaySurvey(`${process.env.REACT_APP_POST_HOG_BLOG_LEAVING_SURVEY_ID}`);
    }
  }, []);

  useRouteChangeExcludingPage(onRouteChange);

  return null;
};

export default RouteChangeListener;
