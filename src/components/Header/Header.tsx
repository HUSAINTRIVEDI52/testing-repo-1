import './Header.scss';
import logo from '../../assets/icons/Bloggr.ai.svg';
import Icon from '@ant-design/icons';
import { ReactComponent as blog_count } from '../../assets/icons/blogcount.svg';

import { ReactComponent as plagiarism } from '../../assets/icons/plagiarism.svg';
import { modelDropdown, languagesDropdown } from '../../constant';
import React, { useContext, useEffect, useState } from 'react';
import { Badge, Modal, Tooltip } from 'antd';
import { GlobalContext } from '../../Context';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NameConfirmation from './NameModel';
import MobileNumberConfirmation from './MobileNumberModel';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';

const Header = () => {
  const navigate = useNavigate();
  // const [userName, setUserName] = useState('demo');
  const [modelOpen, setModelOpen] = useState(false);
  const [mobileModelOpen, setMobileModelOpen] = useState(false);
  const userId = localStorage.getItem('userId');
  const { usage, setUsage, setUserLanguage, setUserModel, setUserName, userName, userLanguage, userModel, hasChanges, setHasChanges, userDetail, setUserDetail }: any =
    useContext(GlobalContext);
  const [run, setRun] = useState(false);

  const excludePathsHeaderBtn: any = /^\/(blog-edit(\/\d+)?)/;
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
  const steps: Step[] = [
    {
      target: 'body',
      placement: 'center',
      content: <h2>Welcome to the App Tour!</h2>,
      title: 'Step 1 of 10'
    },
    {
      target: '.create-btn-div',
      placement: 'right',
      content: 'This is where the magic begins! Click CREATE to start a new blog.',
      title: 'Step 2 of 10'
    },
    {
      target: '.my-blog',
      placement: 'right',
      content: 'This is the my-blog section which stores all blogs and drafts!',
      title: 'Step 3 of 10'
    },
    {
      target: '.brand-voice',
      placement: 'right',
      content:
        'Create a brand voice templates, you can select the template you need while creating a blog. it will reflect in your blogs.',
      title: 'Step 4 of 10'
    },
    {
      target: '.blog-guideline',
      placement: 'right',
      content: 'Create a blog guideline that system will remember.',
      title: 'Step 5 of 10'
    },
    {
      target: '.llm-model',
      placement: 'right',
      content: 'This is the model selection section, select a particular model for better results!',
      title: 'Step 6 of 10'
    },
    {
      target: '.language-selection',
      placement: 'right',
      content: 'This is the language selection section!',
      title: 'Step 7 of 10'
    },
    {
      target: '.submenu2 ul',
      placement: 'right',
      content: 'This is the profile section section!',
      title: 'Step 8 of 10'
    },
    {
      target: '.blog-icon',
      placement: 'right',
      content: 'Blog generation count available in account will display here',
      title: 'Step 9 of 10'
    },

    {
      target: '.plagiarism-icon',
      placement: 'right',
      content: 'Plagiarism check count available in account will display here',
      title: 'Step 10 of 10'
    }
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
  };
  const getUser = async () => {
    const user = await axios.get(`${process.env.REACT_APP_SERVER_URL}/getuser?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });

    const isNameDone = !!(user.data.name && user.data.name.trim());
    const isMobileDone = !!user.data.isMobileVerified;

    if (!isNameDone) {
      setModelOpen(true);
    } 
    // else if (!isMobileDone) {
    //   setMobileModelOpen(true);
    // }

    setUserName(user.data.name);
    setUserDetail({
       ...userDetail,
       name: user.data.name,
       email: user.data.email,
       firstName: user.data.firstName,
       lastName: user.data.lastName,
    });
    setUserModel(modelDropdown.find((item) => item.id == user.data.model)?.value);
    setUserLanguage(languagesDropdown.find((item) => item.id === user.data.language)?.value);

    // Only run tour if user is new AND finished mandatory onboarding (ignoring mobile for now)
    if (user.data.isNew === true && isNameDone) {
      setRun(true);
      let data = {
        isNew: false
      };
      await axios.put(`${process.env.REACT_APP_SERVER_URL}/update-user?userId=${userId}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
    }
  };
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token || token === 'null' || token === 'undefined' || !userId || userId === 'null') {
      console.log('Header: Skipping authenticated calls for guest');
      return;
    }
    getUsage();
    getUser();
  }, [userId]);
  // useEffect(() => {
  //   if (!userName || !userName.trim()) {
  //     console.log('here');
  //     setModelOpen(true);
  //   } else {
  //     setModelOpen(false);
  //   }
  // }, [userName]);
  return (
    <header>
      <img
        className='logo'
        src={logo}
        alt='logo'
        onClick={() => {
          if (hasChanges) {
            Modal.confirm({
              title: 'You have unsaved changes!',
              content: 'Are you sure you want to leave without saving your changes?',
              okText: 'Leave',
              cancelText: 'Stay',
              okButtonProps: { className: 'custom-ok-btn' },
              onOk: () => {
                setHasChanges(false);
                sessionStorage.removeItem('editData');
                navigate('/');
              }
            });
          } else {
            navigate('/');
          }
        }}
        style={{ cursor: 'pointer' }}
      />
      <div className='header-right'>
        <Tooltip title={`You have ${(usage?.totalBlog || 0) - (usage?.usedBlog || 0)} blog generations remaining`}>
          <Badge
            className='blog-icon'
            count={(usage?.totalBlog || 0) - (usage?.usedBlog || 0)}
            style={{ backgroundColor: '#ff6600', color: '#fff' }}
          >
            <Icon
              component={blog_count}
              style={{ fontSize: 25, cursor: 'pointer' }}
              onClick={() => {
                navigate('/account?tab=4');
              }}
            />
          </Badge>
        </Tooltip>
        {/* <Tooltip
          title={`You are remaining with ${usage?.totalRegeneration - usage?.usedRegeneration} Regeneration count`}
        >
          <Badge
            className='reg-icon'
            count={usage?.totalRegeneration - usage?.usedRegeneration || 0}
            style={{ backgroundColor: '#ff6600', color: '#fff' }}
          >
            <Icon
              component={regeneration}
              style={{ fontSize: 25, cursor: 'pointer' }}
              onClick={() => {
                navigate('/account?tab=4');
              }}
            />
          </Badge>
        </Tooltip> */}

        <Tooltip
          title={`You have ${(usage?.totalPlagiarism || 0) - (usage?.usedPlagiarism || 0)} plagiarism checks remaining`}
        >
          <Badge
            className='plagiarism-icon'
            count={(usage?.totalPlagiarism || 0) - (usage?.usedPlagiarism || 0)}
            style={{ backgroundColor: '#ff6600', color: '#fff' }}
          >
            <Icon
              component={plagiarism}
              style={{ fontSize: 25, cursor: 'pointer' }}
              onClick={() => {
                navigate('/account?tab=4');
              }}
            />
          </Badge>
        </Tooltip>
        <Modal
          open={modelOpen} // Display modal if onboarding is true
          footer={null} // Remove footer buttons
          closable={false} // Prevent manual closing
          centered // Center the modal
          className='onboarding-modal' // Optional: Add custom styles
        >
          <NameConfirmation setModelOpen={setModelOpen} />
        </Modal>
        {/* <Modal
          open={mobileModelOpen}
          footer={null}
          closable={false}
          centered
          className='onboarding-modal'
        >
          <MobileNumberConfirmation setMobileModelOpen={setMobileModelOpen} userDetail={userDetail} />
        </Modal> */}

        {/* {excludePathsHeaderBtn?.test(pathname) && (
          <div className='blog-upgrade'>
            <button className='remain-btn'>
              <Icon component={blog_count} /> 5 Blogs remaining
            </button>
            <button className='upgrade-btn'>
              <Icon component={regeneration} />
              Upgrade Now
            </button>
          </div>
        )} */}
        <Joyride
          callback={handleJoyrideCallback}
          continuous
          run={run}
          scrollToFirstStep
          scrollOffset={80}
          // showProgress
          showSkipButton
          steps={steps}
          styles={{
            options: {
              zIndex: 10000
            }
          }}
        />

        {/* Button to manually trigger the tour (optional) */}
        {/* <button onClick={startTour} style={{ position: 'fixed', top: 100, right: 10, zIndex: 9999 }}>
          Start Tour
        </button> */}
      </div>
    </header>
  );
};

export default Header;
