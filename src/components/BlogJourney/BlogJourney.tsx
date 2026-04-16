import React, { useContext, useEffect, useState } from 'react';
import { Steps, Tooltip } from 'antd';
import './blog-journey.scss';
import { GlobalContext } from '../../Context';
import TitleScreen from '../BlogScreens/TitleScreen/TitleScreen';
import ReferenceArticle from '../BlogScreens/ReferenceArticle';
import InternalLink from '../BlogScreens/InternalLink';
import WritingStyle from '../BlogScreens/WritingStyle';
import ReviewOutline from '../BlogScreens/ReviewOutline';
import BlogReady from '../BlogScreens/BlogReady';
import Lottie from 'lottie-react';
import upgradeAnimation from '../../assets/animations/upgrade.json';
import logo from '../../assets/icons/Bloggr.ai.svg';

export default function BlogJourney() {
  const {
    currentScreen,
    setCurrentScreen,
    step1Data,
    step2Data,
    step4Data,
    selectedModel,
    selectedLanguage,
    setVisited,
    visited,
    setDraftId,
    setDraftData,
    setPlanDetails,
    planDetails,
    setUsage,
    stepLoader,
    categories
  }: any = useContext(GlobalContext);

  const [loading, setLoading] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const isLocked = planDetails?.name === 'Free';

  useEffect(() => {
    setAnimateIn(true);
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('accessToken');

    if (!token || token === 'null' || token === 'undefined' || !userId || userId === 'null') {
      // Guest mode: ensure we are at step 1 and provide mock plan/usage
      setCurrentScreen(1);
      const guestPlan = {
        name: 'Free',
        maxCount: 2,
        individualBlogLimit: 0,
        imageGenerationCount: 0
      };
      const guestUsage = {
        usedBlog: 0,
        totalBlog: 2,
        usedPlagiarism: 0,
        totalPlagiarism: 0,
        usedRegeneration: 0,
        totalRegeneration: 0
      };
      
      // Update context with guest defaults
      if (setPlanDetails) setPlanDetails(guestPlan);
      if (setUsage) setUsage(guestUsage);
      
      return;
    }

    const fetchLatestDraft = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${serverUrl}/allblogs?id=${userId}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: ''
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        const drafts: any[] = (data.drafts || []).filter(
          (d: any) => d.visitedstep && d.visitedstep > 0
        );
        if (drafts.length > 0) {
          const latestDraft = drafts[0];
          setDraftId(latestDraft.id);
          setDraftData(latestDraft);
          setVisited(latestDraft.visitedstep);
          setCurrentScreen(latestDraft.visitedstep);
        }
      } catch (e) {
        console.error('Draft fetch error:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestDraft();
  }, [serverUrl, setCurrentScreen, setDraftData, setDraftId, setVisited, setPlanDetails, setUsage]);

  const onChange = (value: number) => {
    if (stepLoader) return;
    
    // index is 0-based, currentScreen is 1-based
    const targetStep = value + 1;

    // Prevent navigation to restricted steps (Step 2 and Step 3) for guest/free
    if (isLocked && (targetStep === 2 || targetStep === 3)) return;
    

    // Only allow navigation if it's within visited steps or moving backwards
    if (targetStep < visited || targetStep === visited) {
      setCurrentScreen(targetStep);
    }
  };

  const stepItems = [
    {
      title: 'Title',
      description: step1Data.title || step1Data.topic || '',
      status: (currentScreen > 1 ? 'finish' : (currentScreen === 1 ? 'process' : 'wait')) as any
    },
    {
      title: isLocked ? (
        <Tooltip title="Please upgrade your plan">
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'not-allowed' }}>
            <span style={{ opacity: 0.6, filter: 'blur(0.5px)' }}>Reference Articles</span>
            <Lottie animationData={upgradeAnimation} loop={true} style={{ width: 70, height: 70 }} />
          </span>
        </Tooltip>
      ) : 'Reference Articles',
      className: isLocked ? 'locked-step' : '',
      description: (step2Data?.scrappedUrl?.length > 0 || step2Data?.files?.length > 0)
        ? `${step2Data.scrappedUrl.length} URLs, ${step2Data.files.length} Files`
        : '',
      status: (isLocked ? 'wait' : (currentScreen > 2 ? 'finish' : (currentScreen === 2 ? 'process' : 'wait'))) as any
    },
    {
      title: isLocked ? (
        <Tooltip title="Please upgrade your plan">
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'not-allowed' }}>
            <span style={{ opacity: 0.6, filter: 'blur(0.5px)' }}>Interlinking</span> 
            <Lottie animationData={upgradeAnimation} loop={true} style={{ width: 70, height: 70 }} />
          </span>
        </Tooltip>
      ) : 'Interlinking',
      className: isLocked ? 'locked-step' : '',
      description: step4Data?.links?.length > 0 ? `${step4Data.links.length} Interlinking` : '',
      status: (isLocked ? 'wait' : (currentScreen > 3 ? 'finish' : (currentScreen === 3 ? 'process' : 'wait'))) as any
    },
    {
      title: 'Writing Style',
      description: [selectedModel, selectedLanguage].filter(Boolean).join(', '),
      status: (currentScreen > 4 ? 'finish' : (currentScreen === 4 ? 'process' : 'wait')) as any
    },
    {
      title: 'Review Outline',
      description: '',
      status: (currentScreen > 5 ? 'finish' : (currentScreen === 5 ? 'process' : 'wait')) as any
    },
    {
      title: (!localStorage.getItem('accessToken') || localStorage.getItem('accessToken') === 'null' || localStorage.getItem('accessToken') === 'undefined') ? (
        <Tooltip title="Sign up to Generate!">
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'not-allowed' }}>
            <span style={{ opacity: 0.6, filter: 'blur(0.5px)' }}>Your Blog Is Ready!</span>
            <Lottie animationData={upgradeAnimation} loop={true} style={{ width: 70, height: 70 }} />
          </span>
        </Tooltip>
      ) : 'Your Blog Is Ready!',
      className: (!localStorage.getItem('accessToken') || localStorage.getItem('accessToken') === 'null' || localStorage.getItem('accessToken') === 'undefined') ? 'locked-step' : '',
      description: '',
      status: (currentScreen === 6 ? 'process' : 'wait') as any
    }
  ];

  if (loading) {
    return (
      <div className="bj-wrapper bj-loading-state">
        <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '15px' }}>Loading your journey...</div>
      </div>
    );
  }

  return (
    <div className={`bj-wrapper create-blog-wrapper ${animateIn ? 'bj-visible' : ''}`}>
      <div className='create-blog-content'>
        <div className={`left-content ${stepLoader ? 'disabled-steps' : ''}`}>
          <div className="bj-header-mini">
             <img src={logo} alt="Bloggr.ai" className="bj-logo-img" />
          </div>
          <Steps 
            direction="vertical" 
            size="small" 
            current={currentScreen - 1} 
            items={stepItems} 
            onChange={onChange}
          />
        </div>
        <div className='right-content'>
          <div className='step-content'>
            {currentScreen === 1 && <TitleScreen />}
            {currentScreen === 2 && <ReferenceArticle />}
            {currentScreen === 3 && <InternalLink />}
            {currentScreen === 4 && <WritingStyle />}
            {currentScreen === 5 && <ReviewOutline />}
            {currentScreen === 6 && <BlogReady />}
          </div>
        </div>
      </div>
    </div>
  );
}
