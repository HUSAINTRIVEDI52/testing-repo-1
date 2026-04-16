import React, { useContext, useEffect, useState } from 'react';
import './lets-start.scss';
import working from '../../assets/images/working.svg';
import writeimg from '../../assets/icons/jam_write-f.svg';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GlobalContext } from '../../Context';

function LetsStart() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const { usage,
    setUsage,
    userName,
    setStep4Data,
    setStep2Data,
    setStep1Data,
    setParsona,
    setBrandVoice,
    setStep3Data,
    step3Data,
    setDraftId,
    setCurrentScreen,
    setRegenerate,
    setVisited,
    userLanguage,
    setSelectedLanguage,
    userModel,
    setSelectedModel,
    setDraftData // Added to reset draft data
  }: any = useContext(GlobalContext);
  const [onboard, setOnboard] = useState(false);
  const [name, setName] = useState('');

  const getUsage = async () => {
    const usage = await axios.get(`${process.env.REACT_APP_SERVER_URL}/usage?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    setUsage({
      usedBlog: usage.data?.blogCreated || 0,
      totalBlog: usage.data?.blogLimit || 0,
      usedPlagiarism: usage.data?.plagarismChecked || 0,
      totalPlagiarism: usage.data?.plagarismCheckLimit || 0
    });
  };

  // const getUser = async () => {
  //   const user = await axios.get(`${process.env.REACT_APP_SERVER_URL}/getuser?userId=${userId}`, {
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem('accessToken')}`
  //     }
  //   });
  //   setOnboard(user.data.isNew);
  //   setName(user.data.name);
  //   };
  useEffect(() => {
    getUsage();
    // getUser();
  }, []);

  return (
    <div className='lets-start-container'>
      <div className='lets-start-content'>
        {/* <Modal
          visible={onboard} // Display modal if onboarding is true
          footer={null} // Remove footer buttons
          closable={false} // Prevent manual closing
          centered // Center the modal
          className='onboarding-modal' // Optional: Add custom styles
        >
          <Onboarding setOnboard={setOnboard} name={name} />
        </Modal> */}
        <img src={working} alt='working' />
        <h1>
          Hi {userName}, Create blog with<span>Bloggr.ai</span>
        </h1>
        <p>
          AI generated, 100% unique and totally based on the input data including your reference URLs or documents.
          Strictly follows your brand voice. Try it!
        </p>
        <button
          onClick={() => {
            localStorage.setItem('blog-mode', 'create');

            // Reset all draft data for new blog
            setDraftData({
              id: '',
              userId: userId,
              topic: '',
              title: '',
              primaryKeyword: '',
              location: null,
              secondaryKeywords: [],
              brandVoice: null,
              aiPersona: null,
              internalLinks: [],
              referencedata: [],
              outline: '',
              visitedstep: 0,
              outlineRegeneratedCount: 0 // KEY: Initialize to 0 for new blogs
            });

            setStep1Data({
              topic: '',
              selectedLocation: null,
              primaryKeyword: '',
              title: ''
            });
            setStep2Data({ scrappedUrl: [], files: [] });
            setStep3Data({ ...step3Data, secondaryKeywords: [] });
            setStep4Data({ links: [] });
            setBrandVoice([]);
            setParsona([]);
            setCurrentScreen(1);
            setDraftId('');
            setRegenerate(false);
            setVisited(0);
            setSelectedLanguage(userLanguage);
            setSelectedModel(userModel);
            navigate('/createblog');
          }}
        // id='lets-start-button'
        >
          <img src={writeimg} alt='write' />
          Yes, lets start!
        </button>
      </div>
    </div>
  );
}

export default LetsStart;
