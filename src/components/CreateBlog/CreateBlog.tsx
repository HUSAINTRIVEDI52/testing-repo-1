import React, { useContext, useEffect } from 'react';
import './create-blog.scss';
import { Steps, Tooltip } from 'antd';
import TitleScreen from '../BlogScreens/TitleScreen/TitleScreen';
import InternalLink from '../BlogScreens/InternalLink';
import { GlobalContext } from '../../Context';
import WritingStyle from '../BlogScreens/WritingStyle';
import ReviewOutline from '../BlogScreens/ReviewOutline';
import ReferenceArticle from '../BlogScreens/ReferenceArticle';
import BlogReady from '../BlogScreens/BlogReady';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import upgradeAnimation from '../../assets/animations/upgrade.json';

export default function CreateBlog() {
  const {
    currentScreen,
    step1Data,
    step2Data,
    step4Data,
    setCurrentScreen,
    selectedModel,
    visited,
    stepLoader,
    selectedLanguage,
    planDetails
  }: any = useContext(GlobalContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isLocked = planDetails?.name === 'Free';

  const stepItem = [
    {
      title: 'Title',
      description: step1Data.title ? step1Data.title : '',
      status: (currentScreen > 1 ? 'finish' : undefined) as 'finish' | undefined
    },
    {
      title: isLocked ? (
        <Tooltip title="Please upgrade your plan">
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'not-allowed' }}>
            <span style={{ opacity: 0.6, filter: 'blur(0.5px)' }}>
              Reference Articles
            </span>
            <Lottie 
              animationData={upgradeAnimation} 
              loop={true}
              style={{ width: 70, height: 70 }}
            />
          </span>
        </Tooltip>
      ) : (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Reference Articles</span>
        </span>
      ),
      className: isLocked ? 'locked-step' : '',
      description:
        step2Data?.scrappedUrl.length > 0 || step2Data?.files.length > 0
          ? `${step2Data.scrappedUrl.length} URLs, ${step2Data.files.length} ${step2Data.files.length === 1 ? 'File' : 'Files'
          }`
          : '',
      status: (isLocked ? 'wait' : (currentScreen > 2 ? 'finish' : undefined)) as 'wait' | 'finish' | undefined
    },

    {
      title: isLocked ? (
        <Tooltip title="Please upgrade your plan">
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'not-allowed' }}>
            <span style={{ opacity: 0.6, filter: 'blur(0.5px)' }}>
              Interlinking
            </span> 
            <Lottie 
              animationData={upgradeAnimation} 
              loop={true}
              style={{ width: 70, height:70 }}
            />
          </span>
        </Tooltip>
      ) : (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
           <span>Interlinking</span>
        </span>
      ),
      className: isLocked ? 'locked-step' : '',
      description: step4Data?.links?.length > 0 ? `${step4Data?.links?.length} Interlinking` : '',
      status: (isLocked ? 'wait' : (currentScreen > 3 ? 'finish' : undefined)) as 'wait' | 'finish' | undefined
    },
    {
      title: 'Writing Style',
      description: [selectedModel, selectedLanguage].filter(Boolean).join(', '),
      status: (currentScreen > 4 ? 'finish' : undefined) as 'finish' | undefined
    },
    { 
      title: 'Review Outline', 
      description: '',
      status: (currentScreen > 5 ? 'finish' : undefined) as 'finish' | undefined
    },
    { 
      title: 'Your Blog Is Ready! ', 
      description: '',
      status: undefined
    }
  ];

  //This code is for empty scrapped previous url
  const emptyScrappedUrl = async () => {
    try {
      await axios.get(`${process.env.REACT_APP_SERVER_URL}/emptyscrappedurl`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
    } catch (error: any) {
      console.log('err', error.message);
    }
  };

  const onChange = (value: number) => {
    if (stepLoader) {
      return;
    }
    // Prevent navigation to restricted steps (Step 2 and Step 3 have indices 1 and 2)
    if (isLocked && (value === 1 || value === 2)) {
      return;
    }
    
    if (value < visited && currentScreen !== 6) {
      setCurrentScreen(value + 1);
    }
  };
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    params.set('page', String(currentScreen));
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScreen, navigate, location.pathname]);

  // ✅ Read page param on first load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pageParam = params.get('page');
    if (pageParam) {
      const pageNumber = Number(pageParam);
      if (isNaN(pageNumber) || pageNumber < 1) {
        setCurrentScreen(1);
      } else if (pageNumber > 6) {
        setCurrentScreen(6);
      } else {
        setCurrentScreen(pageNumber);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    emptyScrappedUrl();
    document.title = 'Bloggr Ai | Create Blog';
  }, []);

  return (
    <div className='create-blog-wrapper'>
      <div className='create-blog-content'>
        <div className={`left-content ${stepLoader ? 'disabled-steps' : ''}`} style={stepLoader ? { pointerEvents: 'none', opacity: 0.6 } : {}}>
          <Steps direction='vertical' size='small' onChange={onChange} current={currentScreen - 1} items={stepItem} />
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
