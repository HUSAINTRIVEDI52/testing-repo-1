import React, { useContext, useEffect, useState } from 'react';
import './sidebar.scss';
import Icon from '@ant-design/icons';
import { modelDropdown, sidebarMenu1, sidebarMenu2, languagesDropdown, plans } from '../../constant';
import create from '../../assets/icons/jam_write-f.svg';
import { ReactComponent as twinkle_icon } from '../../assets/icons/Sprinkle.svg';
import { ReactComponent as ProfileSvg } from '../../assets/icons/profile-svg.svg';
import { ReactComponent as BillingSvg } from '../../assets/icons/Property 1=Bill.svg';
import { ReactComponent as LogoutSvg } from '../../assets/icons/logout.svg';
import { ReactComponent as DownArrow } from '../../assets/icons/DownArrow.svg';
import { ReactComponent as Info } from '../../assets/icons/Info.svg';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import open_sidebar from '../../assets/icons/open_sidebar.svg';
import close_sidebar from '../../assets/icons/fontisto_close.svg';
import { Avatar, Button, Collapse, message, Radio, Tooltip } from 'antd';
import axios from 'axios';
import { GlobalContext } from '../../Context';
import packageJson from '../../../package.json';

function Sidebar() {
  const [visible, setVisible] = useState(false);
  const userId = localStorage.getItem('userId');
  const [email, setEmail] = useState('');
  const [remBlog, setRemBlog] = useState(0);
  const [planDetails, setPlanDetails] = useState<any>([]);
  const [plan, setPlans] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState<any>();
  const {
    setStep4Data,
    setStep2Data,
    setStep1Data,
    setParsona,
    setBrandVoice,
    setStep3Data,
    setDraftId,
    setRegenerate,
    setCurrentScreen,
    step3Data,
    setVisited,
    userLanguage,
    userModel,
    setSelectedModel,
    setSelectedLanguage,
    setDraftData, // Added to reset draft data
    stepLoader
  }: any = useContext(GlobalContext);

  const handleButtonClick = () => {
    setVisible(!visible); // Toggle visibility on click
  };
  const { setUserLanguage, setUserModel, userName }: any = useContext(GlobalContext);

  const navigate = useNavigate();
  const toggleCollapsed = () => {
    setCollapsed((prev) => !prev);
  };

  const { pathname } = useLocation();
  const [selectedModelValue, setSelectedModelValue] = useState('Gemini-1.5 Flash');
  const [selectedLanguage, setSelectedLanguageValue] = useState('English');
  const handleRadioChange = (item: any) => {
    setSelectedModelValue(item.value);
    setUserModel(item.value);
    let value = {
      model: item.id
    };
    axios
      .post(`${process.env.REACT_APP_SERVER_URL}/change-model?userId=${userId}`, value, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      .then((res) => {
        message.success({
          content: res.data.message,
          key: 'change-model'
        });
      })
      .catch((err) => {
        console.log(err);
        message.error('Unable to change Model. Please, try again later.');
      });
  };

  //for language
  const handleLanguageRadioChange = (item: any) => {
    setSelectedLanguageValue(item.value);
    setUserLanguage(item.value);
    let value = {
      language: item.id
    };
    axios
      .post(`${process.env.REACT_APP_SERVER_URL}/change-language?userId=${userId}`, value, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      .then((res) => {
        message.success({
          content: res.data.message,
          key: 'change-language'
        });
      })
      .catch((err) => {
        console.log(err);
        message.error('Unable to change language. Please, try again later.');
      });
  };
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token || token === 'null' || token === 'undefined' || !userId || userId === 'null') {
      console.log('Sidebar: Skipping authenticated calls for guest');
      return;
    }
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/plan-details?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        setPlanDetails(res.data);
      })
      .catch((err) => {
        console.log(err);
        message.error('Unable to fetch plan details. Please, try again later.');
      });

    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/plans`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        setPlans(res.data);
      })
      .catch((err) => {
        console.log(err);
        message.error('Unable to fetch plan details. Please, try again later.');
      });
  }, [userId]);

  const dropdownContent = (
    <div className='radio-buttons-parent-sidebar llm-model'>
      <Radio.Group value={selectedModelValue}>
        {modelDropdown.map((item, key) => {
          return (
            <Radio
              name={item.id}
              key={item.id}
              value={item.value}
              className={`${item?.value === selectedModelValue ? 'sidebar-radio-content' : ''}    `}
              onChange={(e) => handleRadioChange(item)}
              disabled={stepLoader || !planDetails || !plans[planDetails.name]?.includes(item.type)}
            >
              {item.value}
              {!planDetails ||
                (!plans[planDetails.name]?.includes(item.type) && (
                  <span className='info-radio-dropdown'>
                    <Tooltip title={`To access ${item?.value}, you need to upgrade your plan.`}>
                      <Icon component={Info} />
                    </Tooltip>
                  </span>
                ))}
              <span className={`${item?.type ? 'free-container' : ''}`}>{item?.type ? item?.type : ''}</span>
            </Radio>
          );
        })}
      </Radio.Group>
    </div>
  );

  //language
  const dropdownLanguageContent = (
    <div className='radio-buttons-parent-sidebar language-selection'>
      <Radio.Group value={selectedLanguage}>
        {languagesDropdown.map((item: any) => {
          return (
            <Radio
              key={item.id}
              value={item.value}
              className={`${item?.value === selectedLanguage ? 'sidebar-radio-content' : ''}    `}
              onChange={(e) => handleLanguageRadioChange(item)}
              disabled={stepLoader || !planDetails || !plans[planDetails.name]?.includes(item.type)}
            >
              {item.value}

              {/* <span className={`${item?.type ? 'free-container' : ''}`}>{item?.type ? item?.type : ''}</span> */}
            </Radio>
          );
        })}
      </Radio.Group>
    </div>
  );
  //collapse  items
  const items: any = [
    {
      key: '1',
      label: <>LLM Model</>,
      children: dropdownContent
    },
    {
      key: '2',
      label: (
        <>
          Languages{' '}
          <span>
            {(planDetails.name === 'Free' || planDetails.name === 'Basic') && (
              <Tooltip title='Upgrade to Pro OR Agency plan to generate Blogs in different languages'>
                <Icon component={Info} />
              </Tooltip>
            )}
          </span>
        </>
      ),
      children: dropdownLanguageContent
    }
  ];
  //onChange for for collapse
  const onChange = (key: string | string[]) => {};

  const createInitialsImage = (name: any, size = 100, bgColor = '#ff7c02', textColor = '#ffffff') => {
    // Extract initials
    const getInitials = (name: string) => {
      if (!name) return '';
      const nameParts = name.split(' ');
      return nameParts
        .map((part) => part.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('');
    };

    const initials = getInitials(name);

    // Create a canvas element
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Draw background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);

    // Draw initials
    ctx.fillStyle = textColor;
    ctx.font = `${size / 2}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials, size / 2, size / 2);

    setImageDataUrl(canvas.toDataURL('image/png'));
  };
  const getUsage = async () => {
    const usage = await axios.get(`${process.env.REACT_APP_SERVER_URL}/usage?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    setRemBlog(usage?.data?.blogLimit - usage?.data?.blogCreated);
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const isGuest = !token || token === 'null' || token === 'undefined' || !userId || userId === 'null';
    
    setSelectedModelValue(modelDropdown.find((item) => item.value === userModel)?.value || '');
    setSelectedLanguageValue(languagesDropdown.find((item) => item.value === userLanguage)?.value || '');
    
    if (!isGuest) {
        getUsage();
    }
    
    createInitialsImage(userName);
    if (pathname.includes('/createblog')) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }, [pathname, userName, userLanguage, userModel, userId]);

  const content = (
    <div className='list-profile'>
      <div className='profile-item'>
        <div className='user-detail'>
          <span className='user'>{userName}</span>
          <span className='mail'>{email}</span>
        </div>
      </div>
      <div className='profile-item'>
        <button
          onClick={() => {
            handleButtonClick();
            navigate('/account?tab=1');
          }}
        >
          <Icon component={ProfileSvg} />
          <span data-testid='profile'>Profile</span>
        </button>
      </div>
      <div className='profile-item'>
        <button onClick={() => { handleButtonClick(); navigate('/account?tab=2'); }}>
          <Icon component={BillingSvg} />
          <span>Plans & Billing</span>
        </button>
      </div>
      <div className='profile-item'>
        <button
          onClick={() => {
            handleButtonClick();
            localStorage.clear();
            window.location.reload();
            navigate('/login');
          }}
        >
          <Icon component={LogoutSvg} />
          <span>Sign-Out</span>
        </button>
      </div>
      <div></div>
    </div>
  );

  const handleWidth = () => {
    if (collapsed) {
      return 0;
    } else if (window.innerWidth < 1441 && window.innerWidth > 1201) {
      return 270;
    } else if (window.innerWidth < 1200) {
      return 275;
    } else {
      return 270;
    }
  };

  return (
    <div className={`sidebar-content ${pathname.includes('/createblog') ? 'close-sidebar' : ''}`}>
      <div
        className={`sidebar-wrapper ${collapsed ? 'collapsed' : ''}`}
        style={{
          // width: collapsed ? 0 : 270,
          width: handleWidth()
        }}
      >
        <div className='create-btn-div'>
          <Button
            disabled={remBlog == 0 || stepLoader ? true : false}
            className='create-btn'
            onClick={() => {
            localStorage.setItem('blog-mode','create')
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

              setStep2Data({
                scrappedUrl: [],
                files: []
              });

              setStep3Data({
                secondaryKeywords: [],
                temp: [],
                removedRows: [],
                hasGeneratedSecondaryKeywords: false
              });

              setStep4Data({
                links: []
              });
              setRegenerate(false);
              setBrandVoice([]);
              setParsona([]);
              setDraftId('');
              setCurrentScreen(1);
              setVisited(0);
              setSelectedLanguage(userLanguage);
              setSelectedModel(userModel);
              navigate('/createblog');
            }}
          >
            <img src={create} alt='create' />
            <span>Create</span>
          </Button>
        </div>

        <div className='submenu-items'>
          <div className='submenu1'>
            <ul>
              {sidebarMenu1.map((item: any) => {
                return (
                  <li
                    key={item.key}
                    className={`${pathname.split('/').at(-1) === item?.url ? 'active' : ''} ${item?.url} ${stepLoader ? 'disabled-sidebar-item' : ''}`}
                    style={stepLoader ? { pointerEvents: 'none', opacity: 0.6 } : {}}
                  >
                    {' '}
                    <Tooltip placement='left' title={item.tooltip}>
                      <Link to={stepLoader ? '#' : `/${item?.url}`} onClick={(e) => stepLoader && e.preventDefault()}>
                        <Icon component={item?.icon} /> {item.label}
                      </Link>
                    </Tooltip>
                  </li>
                );
              })}
            </ul>
            <hr className='horizontal-rule-sidebar' />
            <div className='sidebar-collapse-parent-container'>
              <Collapse
                collapsible={stepLoader ? 'disabled' : undefined}
                expandIcon={() => <Icon component={DownArrow} />}
                items={items}
                defaultActiveKey={['1', '2']}
                onChange={onChange}
              />
            </div>
          </div>

          <div className='submenu2'>
            <div className='blog-upgrade'>
              <button 
                className='upgrade-btn' 
                onClick={() => !stepLoader && navigate('/account?tab=2')}
                disabled={stepLoader}
                style={stepLoader ? { cursor: 'not-allowed', opacity: 0.6 } : {}}
              >
                <Icon component={twinkle_icon} />
                Upgrade Now
              </button>
            </div>
            <ul>
              {sidebarMenu2.map((item: any) => {
                return (
                  <li
                    key={item.key}
                    onClick={() => {
                      if (!stepLoader) {
                        handleButtonClick();
                        navigate('/account?tab=1');
                      }
                    }}
                    style={stepLoader ? { cursor: 'not-allowed', opacity: 0.6 } : {}}
                  >
                    {item?.dropdown ? <Avatar size={38} src={imageDataUrl} /> : <Icon component={item?.icon} />}

                    {item?.dropdown ? (
                      <button className='arrow-label'>
                        <span className='label'>{userName}</span>
                      </button>
                    ) : (
                      // </Popover>
                      <span className='label'>{item?.label}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
          <span style={{ fontSize: '12px', color: 'gray' }}>Version: {packageJson?.version}</span>
        </div>
      </div>

      {pathname.includes('/createblog') && (
        <button className='collapse-btn' onClick={toggleCollapsed} style={{ marginBottom: 16 }}>
          {collapsed ? <img src={open_sidebar} alt='' /> : <img src={close_sidebar} alt='' />}
        </button>
      )}
    </div>
  );
}

export default Sidebar;
