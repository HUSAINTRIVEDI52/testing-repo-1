import React, { useContext, useEffect, useState, useRef } from 'react';
import '../blog-screen.scss';
import { Form, Input, Modal, Alert, Select, message, Radio, Button, Tooltip, Skeleton, Spin } from 'antd';
import closeIcon from '../../../assets/icons/fontisto_close.svg';
import KeywordExplorerModal from '../Modal/KeywordExplorerModal';
import Icon from '@ant-design/icons/lib/components/Icon';
import { ReactComponent as RefreshIcon } from '../../../assets/icons/refresh.svg';
import Lottie from 'lottie-react';
import proBadgeAnimation from '../../../assets/animations/pro-badge.json';


import { ReactComponent as DownIcon } from '../../../assets/icons/Property 1=material-symbols_arrow-drop-down.svg';
import { ReactComponent as SprinkleIcon } from '../../../assets/icons/Sprinkle.svg';
import axios from 'axios';
import { InfoCircleOutlined } from '@ant-design/icons';
import { countryData } from '../../../countryConstant';
import { GlobalContext } from '../../../Context';
import { handleKeywordHandler, addUniqueIds } from '../../../utils/CommonFunction';
import { useNavigate } from 'react-router-dom';
import validateField from '../../../utils/ValidateInput';
import SecondaryKeyword from '../SecondaryKeyword';

import ConfirmResetModal from '../Modal/resetFieldModel';

function TitleScreen() {
  const {
    step1Data,
    setStep1Data,
    setCurrentScreen,
    usage,
    step3Data,
    setDraftId,
    draftId,
    setVisited,
    visited,
    setStep4Data,
    setStep2Data,
    setSelectedModel,
    setSelectedBlogGuide,
    setSelectedBrandVoice,
    setCategories,
    setDraftData,
    userModel,
    currentScreen,
    setStep3Data,
    planDetails,
    stepLoader,
    setStepLoader,
    categories,
    draftData,
    trialExhausted,
    setTrialExhausted,
    titleOptions,
    setTitleOptions,
    lastOutlineInputs
  }: any = useContext(GlobalContext);

  const isFreePlan = planDetails?.name === 'Free';
  const isTrialExhausted = (isFreePlan && draftData?.outlineRegeneratedCount > 0) || trialExhausted;

  const isRegenerationLocked = isFreePlan && (
    step1Data?.hasGeneratedTitle || 
    step1Data?.hasGeneratedPrimaryKeywords || 
    step3Data?.hasGeneratedSecondaryKeywords
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const [keywordExplorerLoader, setKeywordExplorerLoader] = useState<boolean>(false);
  const [generateTitleLoader, setGenerateTitleLoader] = useState<boolean>(false);
  const [nextBtnLoader, setNextBtnLoader] = useState<boolean>(false);
  const [keywordData, setKeywordData] = useState<any>();
  const [search, setSearch] = useState<string>('');
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  // const [planDetails, setPlanDetails] = useState<any>([]);
  const [showNoTokenModal, setShowNoTokenModal] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true); // ✅ New state
  const lastConfirmedKeywordRef = useRef(step1Data.primaryKeyword);
  const isConfirmModalOpenRef = useRef(false);
  const [form] = Form.useForm();

  // Initialize lastConfirmedKeyword when step1Data.primaryKeyword is first loaded
  useEffect(() => {
    if (step1Data.primaryKeyword && !lastConfirmedKeywordRef.current) {
      lastConfirmedKeywordRef.current = step1Data.primaryKeyword;
    }
  }, [step1Data.primaryKeyword]);

  const locationData = countryData.map((country) => ({
    label: country.name,
    value: country.name,
    countryCode: country.countryCode
  }));

  const onChange = (value: string) => {
    if (visited > 1 || step1Data.primaryKeyword) {
      Modal.confirm({
        title: 'Changing this will reset your data',
        content: 'Changing your location will clear title, primary keyword, secondary keywords, and reference data. Your current outline may need to be regenerated. Do you want to continue?',
        okText: 'Yes, Continue',
        cancelText: 'Cancel',
        okButtonProps: { danger: true },
        onOk: () => {
          setVisited(1);
          setStep1Data((prevData: any) => ({ ...prevData, selectedLocation: value }));
          setStep1Data((prevData: any) => ({ ...prevData, primaryKeyword: '' }));
          setStep1Data((prevData: any) => ({ ...prevData, title: '' }));
          setStep2Data({ scrappedUrl: [], files: [] });
          setStep3Data({ ...step3Data, secondaryKeywords: [] });
          setStep4Data({ links: [] });
          setSelectedBrandVoice([]);
          setSelectedBlogGuide([]);
          setSelectedModel(userModel);
          setCategories([]);
          setDraftData((prev: any) => ({
            ...prev,
            outlineRegeneratedCount: 0,
            outlineLastInputs: null
          }));
        },
        onCancel: () => {
          form.setFieldValue('location', step1Data.selectedLocation);
        }
      });
      return;
    }
    setStep1Data((prevData: any) => ({ ...prevData, selectedLocation: value }));
    setStep1Data((prevData: any) => ({
      ...prevData,
      primaryKeyword: ''
    }));
    setStep1Data((prevData: any) => ({
      ...prevData,
      title: ''
    }));

    setStep2Data({
      scrappedUrl: [],
      files: []
    });
    setStep3Data({
      ...step3Data,
      secondaryKeywords: []
    });

    setStep4Data({
      links: []
    });
    setSelectedBrandVoice([]);
    setSelectedBlogGuide([]);
    setSelectedModel(userModel);
    setCategories([]);
    setDraftData((prev: any) => ({
      ...prev,
      outlineRegeneratedCount: 0,
      outlineLastInputs: null
    }));
    if (visited < currentScreen) setVisited(currentScreen);
  };

  useEffect(() => {
    const checkTrialStatus = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token || token === 'null' || token === 'undefined') {
        try {
          const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/guest-trial-status`);
          if (response.data.trialCount >= response.data.limit) {
            setTrialExhausted(true);
          }
        } catch (error) {
          console.error('Failed to fetch trial status on mount', error);
        }
      }
    };
    checkTrialStatus();
  }, []);
  const onSearch = (value: string) => { };

  // Filter `option.label` match the user type `input`
  // const filterOption = (input: string, option?: { label: string; value: string }) =>
  //   (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
  const filterOption = (input: string, option?: { label: string; value: string; countryCode?: string }) =>
    (option?.label ?? '').toLowerCase().startsWith(input.toLowerCase()) ||
    (option?.countryCode ?? '').toLowerCase().startsWith(input.toLowerCase());

  //code for generating blog titles
  const generateSecondaryKeywords = async (keyword: string, skipIfNotEmpty: boolean = false) => {
    // Prevent auto-generation if skipIfNotEmpty is true and we already have keywords
    if (skipIfNotEmpty && step3Data.secondaryKeywords.length > 0) {
        return;
    }

    // Prevent auto-generation for Free plan if already generated
    if (planDetails?.name === 'Free' && step3Data.hasGeneratedSecondaryKeywords) {
        return;
    }

    let values = {
      keyword: keyword,
      country: step1Data.selectedLocation,
      type: 'secondary',
      draftId: draftId
    };

    try {
      const result: any = await axios.post(`${process.env.REACT_APP_SERVER_URL}/getKeywords`, values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (result.status === 200) {
        const candidates = result?.data?.candidates || [];
        // Select top 3, filtering out the primary keyword itself
        const filteredCandidates = candidates.filter((item: any) => item.text.toLowerCase() !== keyword.toLowerCase());
        const top3 = filteredCandidates.slice(0, 3).map((item: any) => item.text);

        setStep3Data((prev: any) => ({
          ...prev,
          secondaryKeywords: top3,
          hasGeneratedSecondaryKeywords: true
        }));
      }
    } catch (error) {
      console.error('Error generating secondary keywords', error);
    }
  };

  const generateBlogTitle = async (keywordOverride?: string, skipSecondary: boolean = false) => {

    // Prevent generation when trial is already exhausted (total tokens used)
    if (trialExhausted) {
        return;
    }
    
    // For free/guest users, only block RE-generation if they are clicking the button
    // (i.e., NO keywordOverride is present).
    if (planDetails?.name === 'Free' && step1Data.hasGeneratedTitle && !keywordOverride) {
        return;
    }

    setGenerateTitleLoader(true);
    setStepLoader(true);
    const keywordToUse = keywordOverride || step1Data.primaryKeyword;
    // check for empty values
    if (!step1Data.topic || !keywordToUse) {
      // Don't show error on auto-trigger (blur) if fields are empty, just return
      // message.error({ content: 'Please enter both topic and primary keyword', key: 'keyword error' });
      setGenerateTitleLoader(false);
      setStepLoader(false);
      return;
    }

    // Trigger secondary keyword generation
    if (!skipSecondary) {
        generateSecondaryKeywords(keywordToUse, true); // Added true to skip if already has manually selected keywords
    }

    let values = {
      topic: step1Data.topic,
      primaryKeyword: keywordToUse
    };
    try {
      const result = await axios.post(`${process.env.REACT_APP_SERVER_URL}/generatetitle`, values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      if (result.status !== 200) {
        message.error(result?.data?.error);
      } else {
        const filteredTitles = result?.data?.title?.filter((title: any) => title !== ''); // Remove empty values
        setTitleOptions(filteredTitles);
        setStep1Data((prev: any) => ({ ...prev, hasGeneratedTitle: true }));
        // If a title was already selected, we clear it only if it's NOT in the new options
        // This ensures the user sees the "newness" of the generation
        setStep1Data((prev: any) => ({ ...prev, title: '' }));
        if (visited < currentScreen) setVisited(currentScreen);
      }
    } catch (error: any) {
      if (error?.response?.data?.code === 'GUEST_LIMIT_REACHED') {
        setTrialExhausted(true);
      }
      message.error(error?.response?.data?.error ? error?.response?.data?.error : error?.message);
    }
    setGenerateTitleLoader(false);
    setStepLoader(false);
  };

  //This code is for generating keywords
  const keywordHandler = async () => {
    setKeywordExplorerLoader(true);
    setStepLoader(true);
    let values = {
      keyword: search !== '' ? search : step1Data.topic,
      country: step1Data.selectedLocation,
      draftId: draftId // Ensure draftId is passed
    };
    
    // Trigger title generation as well
    if (step1Data.primaryKeyword) {
        generateBlogTitle();
    }
    
    const success = await handleKeywordHandler(
      values, 
      setKeywordExplorerLoader, 
      setKeywordData, 
      setIsModalOpen, 
      'primary',
      () => setTrialExhausted(true)
    );
    
    if (success) {
        lastConfirmedKeywordRef.current = step1Data.primaryKeyword;
        setStep1Data((prev: any) => ({ ...prev, hasGeneratedPrimaryKeywords: true }));
    }
    
    setKeywordExplorerLoader(false);
    setStepLoader(false);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the default Enter key behavior
    }
  };
  //This function is when user clicks next btn
  const onFinish = async (values: any) => {
    setNextBtnLoader(true);
    setStepLoader(true);
    
    // Determine next step based on plan
    const isFreePlan = planDetails?.name === 'Free';
    const nextStep = isFreePlan ? 4 : 2;

    const token = localStorage.getItem('accessToken');
    if (!token || token === 'null' || token === 'undefined') {
      // Guest Mode: Just advance UI state
      if (currentScreen === visited) {
        setVisited(nextStep);
      }
      setCurrentScreen(nextStep);
      setNextBtnLoader(false);
      setStepLoader(false);
      return;
    }

    const value = {
      title: step1Data.title,
      uniqueIdentifier: localStorage.getItem('userId'),
      userId: localStorage.getItem('userId'),
      primaryKeywords: step1Data.primaryKeyword,
      secondaryKeywords: step3Data.secondaryKeywords,
      location: step1Data.selectedLocation,
      topic: step1Data.topic,
      id: draftId,
      visited: nextStep,
      // Persist generation flags and regeneration count
      hasGeneratedTitle: step1Data.hasGeneratedTitle,
      hasGeneratedPrimaryKeywords: step1Data.hasGeneratedPrimaryKeywords,
      hasGeneratedSecondaryKeywords: step3Data.hasGeneratedSecondaryKeywords,
      outlineRegeneratedCount: draftData.outlineRegeneratedCount,
      outlineLastInputs: draftData.outlineLastInputs
    };
    const data = await axios.post(`${process.env.REACT_APP_SERVER_URL}/save-draft?userId=${userId}`, value, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    if (data?.data?.result?.id) {
      setDraftId(data.data.result.id);
    }
    
    // Update visited state if progressing forward
    if (currentScreen === visited) {
      setVisited(nextStep);
    } else if (isFreePlan && visited < 4) {
      // Ensure visited is at least 4 for free plan users
      setVisited(4);
    }

    setCurrentScreen(nextStep);
    setNextBtnLoader(false);
    setStepLoader(false);
  };
  
  useEffect(() => {
    // Only set modal state if ALL data is loaded AND it's not the initial load
    if (
      usage?.totalBlog !== undefined &&
      usage?.usedBlog !== undefined &&
      planDetails?.name !== undefined
    ) {
      const remainingBlogs = usage.totalBlog - usage.usedBlog;
      console.log('TitleScreen: Setting modal state', {
        totalBlog: usage.totalBlog,
        usedBlog: usage.usedBlog,
        remaining: remainingBlogs,
        isInitialLoad
      });
      
      // Mark initial load as complete
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
      
      setShowNoTokenModal(remainingBlogs === 0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usage, planDetails]); // Don't include isInitialLoad in dependencies

  // ✅ Show skeleton while data is loading OR during initial load
  if (
    isInitialLoad ||
    !planDetails ||
    !planDetails.name ||
    !usage ||
    usage.totalBlog === undefined ||
    usage.usedBlog === undefined
  ) {
    console.log('TitleScreen: Showing skeleton loader', { 
      isInitialLoad,
      planDetails, 
      usage,
      hasPlanName: planDetails?.name,
      hasTotalBlog: usage?.totalBlog,
      hasUsedBlog: usage?.usedBlog
    });
    
    return (
      <div className='title-container'>
        {/* Header Section */}
        <div style={{ marginBottom: '32px' }}>
          <Skeleton
            active
            title={{ width: '50%', style: { height: '32px', marginBottom: '12px' } }}
            paragraph={{ rows: 1, width: ['70%'] }}
          />
        </div>

        {/* Form Fields */}
        <div className='input-groups'>
          {/* Topic Field */}
          <div className='topic-container' style={{ marginBottom: '24px' }}>
            <Skeleton.Input
              active
              size='small'
              style={{ width: '60px', height: '14px', marginBottom: '8px' }}
            />
            <Skeleton.Input active size='large' block style={{ height: '40px' }} />
          </div>

          {/* Target Location Field */}
          <div className='target-location-container' style={{ marginBottom: '24px' }}>
            <Skeleton.Input
              active
              size='small'
              style={{ width: '110px', height: '14px', marginBottom: '8px' }}
            />
            <Skeleton.Input active size='large' block style={{ height: '40px' }} />
          </div>

          {/* Primary Keyword Field with Button */}
          <div className='primary-keyword-container' style={{ marginBottom: '24px' }}>
            <Skeleton.Input
              active
              size='small'
              style={{ width: '120px', height: '14px', marginBottom: '8px' }}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <Skeleton.Input active size='large' style={{ flex: 1, height: '40px' }} />
              <Skeleton.Button active size='large' style={{ width: '180px', height: '40px' }} />
            </div>
          </div>

          {/* Generate Title Field with Button */}
          <div className='generate-title-container' style={{ marginBottom: '24px' }}>
            <Skeleton.Input
              active
              size='small'
              style={{ width: '280px', height: '14px', marginBottom: '8px' }}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <Skeleton.Input active size='large' style={{ flex: 1, height: '40px' }} />
              <Skeleton.Button active size='large' style={{ width: '180px', height: '40px' }} />
            </div>
          </div>

          {/* Secondary Keywords Field */}
          <div style={{ marginBottom: '24px' }}>
            <Skeleton.Input
              active
              size='small'
              style={{ width: '200px', height: '14px', marginBottom: '8px' }}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <Skeleton.Input active size='large' style={{ flex: 1, height: '40px' }} />
              <Skeleton.Button active size='large' style={{ width: '180px', height: '40px' }} />
            </div>
          </div>
        </div>

        {/* Footer Button */}
        <div className='btn-wrapper' style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
          <Skeleton.Button active size='large' style={{ width: '100px', height: '40px' }} />
        </div>
      </div>
    );
  }

  // ✅ DATA LOADED - Now we can safely check blog counts
  const remainingBlogs = usage.totalBlog - usage.usedBlog;
  console.log('TitleScreen: Rendering with data', {
    planDetails,
    usage,
    remainingBlogs,
    showModal: showNoTokenModal
  });

  return (
    <>
      {/* Show modal only when user has 0 tokens */}
      {showNoTokenModal && (
        <Modal
          centered
          className='keyword-model'
          open={true}
          onCancel={() => navigate('/my-blog')}
          footer={null}
          width={1000}
          closable={false}
          maskClosable={false}
          style={{
            maxWidth: '600px',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            backgroundColor: '#fff'
          }}
        >
          <div
            style={{
              justifyContent: 'center',
              textAlign: 'center',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ fontSize: '40px', color: '#ffcc00', marginBottom: '20px' }}>⚠️</div>
            <p style={{ fontSize: '20px', color: '#333', marginBottom: '20px' }}>
              You don't have a Blog Generation Token. Please purchase an add-on or upgrade your plan to proceed.
            </p>
            <Button
              type='primary'
              size='large'
              onClick={() => navigate('/my-blog')}
              style={{ width: '150px', margin: '0 auto' }}
            >
              My Blogs
            </Button>
          </div>
        </Modal>
      )}
      <div className='title-container'>
        <h1 className='title'>Tell us what topic are you targeting?</h1>
        <p>Define the topic to tailor your content for maximum impact</p>
        <Form
          form={form}
          layout={'vertical'}
          onFinish={onFinish}
          onKeyDown={handleKeyDown}
          fields={[
            {
              name: ['topic'],
              value: step1Data?.topic
            },
            {
              name: ['location'],
              value: step1Data?.selectedLocation
            },
            {
              name: 'primaryKeyword',
              value: step1Data?.primaryKeyword
            },
            {
              name: ['selectedTitle'],
              value: step1Data?.title
            }
          ]}
        >
          <div className='input-groups'>
            <div className='topic-container'>
              <Form.Item
                label='Topic'
                name='topic'
                required
                rules={[
                  {
                    required: true,

                    validator: validateField('topic', form, 'Topic')
                  }
                ]}
                tooltip={{
                  title: 'Topic will be the driving force for your blog, provide appropriate topic as per your need',
                  icon: <InfoCircleOutlined style={{ cursor: 'pointer' }} />
                }}
              >
                <Input
                  disabled={showNoTokenModal || nextBtnLoader || generateTitleLoader || keywordExplorerLoader || stepLoader}
                  placeholder='Example: AI in healthcare'
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (visited > 4) {
                      Modal.confirm({
                        title: 'Confirmation Required',
                        content: 'As you are changing the topic, your generated outline will become outdated and you will have to do these steps again. Do you want to continue?',
                        okText: 'Yes, Continue',
                        cancelText: 'Cancel',
                        okButtonProps: { danger: true },
                        onOk: () => {
                          setVisited(1);
                          setStep1Data((prevData: any) => ({
                            ...prevData,
                            topic: newValue,
                            primaryKeyword: '',
                            title: ''
                          }));
                          setStep2Data({ scrappedUrl: [], files: [] });
                          setStep3Data({ ...step3Data, secondaryKeywords: [] });
                        },
                        onCancel: () => {
                          form.setFieldValue('topic', step1Data.topic);
                        }
                      });
                      return;
                    }
                    setStep1Data((prevData: any) => ({
                      ...prevData,
                      topic: newValue,
                      primaryKeyword: '',
                      title: ''
                    }));
                    if (visited < currentScreen) setVisited(currentScreen);
                  }}
                />
              </Form.Item>
            </div>
            <div className='target-location-container'>
              <Form.Item
                label=' Target Location'
                name='location'
                required
                rules={[
                  {
                    required: true,
                    validator: validateField('location', form, 'Location')
                  }
                ]}
                tooltip={{
                  title: 'Country selection would search keywords to selected territory.',
                  icon: <InfoCircleOutlined style={{ cursor: 'pointer' }} />
                }}
              >
                <Select
                  showSearch
                  disabled={showNoTokenModal || nextBtnLoader || generateTitleLoader || keywordExplorerLoader || stepLoader}
                  placeholder='Example: United States of America'
                  optionFilterProp='children'
                  onChange={onChange}
                  onSearch={onSearch}
                  filterOption={filterOption}
                  options={locationData}
                  suffixIcon={<Icon component={DownIcon} />}
                />
              </Form.Item>
            </div>
            <div className='primary-keyword-container'>
              <div className='primary-keyword-section'>
                <div className='input-keyword'>
                  <Form.Item
                    label='Primary keyword'
                    name='primaryKeyword'
                    rules={[
                      {
                        required: true,

                        validator: validateField('primaryKeyword', form, 'Primary Key word')
                      }
                    ]}
                    tooltip={{
                      title: 'This keyword would have 2-3% density in your final blog.',
                      icon: <InfoCircleOutlined style={{ cursor: 'pointer' }} />
                    }}
                    required
                  >
                    <Input
                      disabled={!step1Data.topic || !step1Data.selectedLocation || nextBtnLoader || generateTitleLoader || keywordExplorerLoader || stepLoader}
                      placeholder='Example: Generative AI in healthcare or AI in surgery etc'
                      value={step1Data.primaryKeyword}
                      onBlur={() => { 
                        if (isTrialExhausted) return;
                        if (isConfirmModalOpenRef.current) return; // 🔒 Skip if modal is already open from onChange
                        
                        const newValue = step1Data.primaryKeyword;
                        
                        // Only proceed if the keyword actually changed and we are in early steps
                        if (newValue !== lastConfirmedKeywordRef.current) {
                          lastConfirmedKeywordRef.current = newValue;
                          generateBlogTitle(newValue);
                          if (visited < currentScreen) setVisited(currentScreen);
                        }
                      }}
                      onChange={(e: any) => {
                        const value = e.target.value;
                        form.setFieldValue('primaryKeyword', value);
                        form.validateFields(['primaryKeyword']);

                        if (visited > 4 && value !== lastConfirmedKeywordRef.current) {
                          isConfirmModalOpenRef.current = true; // 🔒 Block onBlur while modal is open
                          Modal.confirm({
                            title: 'Confirmation Required',
                            content: 'As you are changing the primary keyword, your generated outline will become outdated and you will have to do these steps again. Do you want to continue?',
                            okText: 'Yes, Continue',
                            cancelText: 'Cancel',
                            okButtonProps: { danger: true },
                            onOk: () => {
                              isConfirmModalOpenRef.current = false;
                              lastConfirmedKeywordRef.current = value;
                              setVisited(1);
                              setStep1Data((prevData: any) => ({
                                ...prevData,
                                primaryKeyword: value,
                                title: '' // Reset title on change
                              }));
                              generateBlogTitle(value);
                            },
                            onCancel: () => {
                              isConfirmModalOpenRef.current = false;
                              // Revert to the last confirmed keyword
                              setStep1Data((prevData: any) => ({
                                ...prevData,
                                primaryKeyword: lastConfirmedKeywordRef.current
                              }));
                              form.setFieldValue('primaryKeyword', lastConfirmedKeywordRef.current);
                            }
                          });
                          return;
                        }

                        // Just update state if not on a "confirmed" screen or no change detected
                        setStep1Data((prevData: any) => ({
                          ...prevData,
                          primaryKeyword: value
                        }));
                      }}
                    />
                  </Form.Item>
                  <Tooltip
                    placement='left'
                    title={
                      !step1Data.topic || !step1Data.selectedLocation
                        ? 'Please fill in Topic and Target Location first'
                        : isRegenerationLocked
                        ? 'Suggesting is limited to 1 time per blog for Free/Guest plans'
                        : ''
                    }
                  >
                    <Button
                      disabled={
                        !step1Data.topic ||
                        !step1Data.selectedLocation ||
                        keywordExplorerLoader ||
                        generateTitleLoader ||
                        nextBtnLoader ||
                        isRegenerationLocked
                      }
                      loading={keywordExplorerLoader}
                      onClick={() => {
                        if (visited > 4) {
                          Modal.confirm({
                            title: 'Confirmation Required',
                            content: 'As you are changing the primary keyword, your generated outline will become outdated and you will have to do these steps again. Do you want to continue?',
                            okText: 'Yes, Continue',
                            cancelText: 'Cancel',
                            okButtonProps: { danger: true },
                            onOk: () => {
                              setVisited(1);
                              keywordHandler();
                            }
                          });
                        } else {
                          keywordHandler();
                        }
                      }}
                      className={step1Data?.hasGeneratedPrimaryKeywords ? 're-generate-btn' : 'keyword-btn'}
                    >
                      {step1Data?.hasGeneratedPrimaryKeywords ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                          <Icon component={RefreshIcon} /> 
                          <span>Re-Generate</span>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                          <Icon component={SprinkleIcon} style={{ fontSize: '16px' }} /> 
                          <span>Suggest with AI</span>
                        </div>
                      )}
                      
                      {isRegenerationLocked && (
                        <div style={{ display: 'flex', alignItems: 'center', width: '28px', height: '28px', flexShrink: 0 }}>
                          <Lottie 
                            animationData={proBadgeAnimation} 
                            loop={true}
                            style={{ width: '100%', height: '100%' }}
                          />
                        </div>
                      )}
                    </Button>
                  </Tooltip>
                </div>
              </div>
            </div>
            <div className='generate-title-container'>
              <div className='generate-title-section'>
                <div className='input-title'>
                  <Form.Item
                    name='selectedTitle'
                    rules={[
                      {
                        required: true,
                        validator: validateField('selectedTitle', form, 'Title')
                      }
                    ]}
                    label='Generate Your Blog Title (or Enter Manually)'
                    required
                  >
                    <Input
                      disabled={!step1Data.primaryKeyword || nextBtnLoader || generateTitleLoader || keywordExplorerLoader || stepLoader}
                      placeholder='Example: How Generative AI is helping Healthcare professionals up-skill their talent?'
                      onChange={(e: any) => {
                        const newTitle = e.target.value;
                        if (visited > 4) {
                          Modal.confirm({
                            title: 'Confirmation Required',
                            content: 'As you are changing the title, your generated outline will become outdated and you will have to do these steps again. Do you want to continue?',
                            okText: 'Yes, Continue',
                            cancelText: 'Cancel',
                            okButtonProps: { danger: true },
                            onOk: () => {
                              setVisited(1);
                              setStep1Data((prevData: any) => ({
                                ...prevData,
                                title: newTitle
                              }));
                            }
                          });
                          return;
                        }
                        
                        setStep1Data((prevData: any) => ({
                          ...prevData,
                          title: newTitle
                        }));
                        setVisited(currentScreen);
                      }}
                    />
                  </Form.Item>

                </div>
                {(step1Data.topic && step1Data.primaryKeyword) && (
                  <div style={{ marginLeft: '12px' }}>
                    <Tooltip
                      placement='left'
                      title={
                        isRegenerationLocked
                          ? 'Suggesting titles is limited to 1 time per blog for Free/Guest plans'
                          : ''
                      }
                    >
                      <Button
                        disabled={
                          !step1Data.topic ||
                          !step1Data.primaryKeyword ||
                          generateTitleLoader ||
                          keywordExplorerLoader ||
                          nextBtnLoader ||
                          isRegenerationLocked
                        }
                        onClick={() => {
                          if (visited > 4) {
                            Modal.confirm({
                              title: 'Confirmation Required',
                              content: 'As you are changing the title, your generated outline will become outdated and you will have to do these steps again. Do you want to continue?',
                              okText: 'Yes, Continue',
                              cancelText: 'Cancel',
                              okButtonProps: { danger: true },
                              onOk: () => {
                                setVisited(1);
                                generateBlogTitle();
                              }
                            });
                          } else {
                            generateBlogTitle();
                          }
                        }}
                        className={step1Data.hasGeneratedTitle ? 're-generate-btn' : 'keyword-btn'}
                      >
                        {step1Data.hasGeneratedTitle ? (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <Icon component={RefreshIcon} />
                            <span>Re-Generate</span>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <Icon component={SprinkleIcon} style={{ fontSize: '16px' }} />
                            <span>Suggest Titles</span>
                          </div>
                        )}
                        {isRegenerationLocked && (
                          <div style={{ display: 'flex', alignItems: 'center', width: '28px', height: '28px', flexShrink: 0 }}>
                            <Lottie
                              animationData={proBadgeAnimation}
                              loop={true}
                              style={{ width: '100%', height: '100%' }}
                            />
                          </div>
                        )}
                      </Button>
                    </Tooltip>
                  </div>
                )}
              {generateTitleLoader && (
                <div style={{ textAlign: 'center', margin: '20px 0', width: '100%' }}>
                  <Spin tip='Generating Titles...' />
                </div>
              )}
              </div>
              {!generateTitleLoader && titleOptions?.length > 0 && (
                <Form.Item label='Choose a Title'>
                  <Radio.Group
                    className='choose-title-wrapper'
                    disabled={nextBtnLoader || generateTitleLoader || keywordExplorerLoader || stepLoader}
                    value={step1Data.title}
                    onChange={(e: any) => {
                      form.setFieldValue('selectedTitle', e.target.value);
                      form.validateFields(['selectedTitle']);
                      setStep1Data((prevData: any) => ({
                        ...prevData,
                        title: e.target.value
                      }));
                      setVisited(currentScreen);
                    }}
                  >
                    {titleOptions?.map((option: any) => (
                      <Form.Item key={option}>
                        <Radio.Button value={option}>{option}</Radio.Button>
                      </Form.Item>
                    ))}
                  </Radio.Group>
                </Form.Item>
              )}

            <SecondaryKeyword form={form} />
          </div>
          </div>
          <div className='btn-wrapper'>
            <Form.Item className='next-btn'>
              <Button type='primary' htmlType='submit' loading={nextBtnLoader} disabled={keywordExplorerLoader || generateTitleLoader || nextBtnLoader}>
                Next
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>

      <KeywordExplorerModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        data={keywordData}
        search={search}
        setSearch={setSearch}
        onSearch={keywordHandler}
        location={step1Data.selectedLocation}
        onGenerateTitles={generateBlogTitle}
      />
      <Modal
        centered
        className='keyword-model'
        open={isResetModalOpen}
        onCancel={() => setIsResetModalOpen(false)}
        afterOpenChange={() => setSearch('')}
        footer={null}
        closeIcon={<img src={closeIcon} alt='closeIcon' onClick={() => setIsModalOpen(false)} className='img-cancle' />}
      >
        <ConfirmResetModal isResetModalOpen={isResetModalOpen} setIsResetModalOpen={setIsResetModalOpen} />
      </Modal>
    </>
  );
};


export default TitleScreen;
