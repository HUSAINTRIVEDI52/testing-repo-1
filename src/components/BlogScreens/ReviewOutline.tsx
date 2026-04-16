import { Alert, Button, Form, message, Modal } from 'antd';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import NestedDragDropEle from './NestedDragDropEle';
import Icon from '@ant-design/icons';
import { ReactComponent as RefreshSvg } from '../../assets/icons/refresh.svg';
import axios from 'axios';
import { GlobalContext } from '../../Context';
import { addUniqueIds } from '../../utils/CommonFunction';
import CreateOutlineWithFeedbackModal from './Modal/createOutlineWithFeedbackModel';
import closeIcon from '../../assets/icons/fontisto_close.svg';
import { v4 as uuidv4 } from 'uuid';
import Lottie from 'lottie-react';
import proBadgeAnimation from '../../assets/animations/pro-badge.json';

const ReviewOutline = () => {
  const {
    step1Data,
    step2Data,
    step3Data,
    setCategories,
    setBlogId,
    selectedBrandVoice,
    selectedBlogGuide,
    blogId,
    selectedModel,
    categories,
    setBlogContent,
    setCurrentScreen,
    step4Data,
    selectedLanguage,
    setUsage,
    draftId,
    draftData,
    setDraftData,
    setVisited,
    visited,
    setStepLoader,
    planDetails,
    trialExhausted,
    setTrialExhausted,
    lastOutlineInputs,
    setLastOutlineInputs
  }: any = useContext(GlobalContext);

  const [generateBlogLoader, setGenerateBlogLoader] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [comment, setComment] = useState(null);
  
  const userId = localStorage.getItem('userId');

  const isFreePlan = planDetails?.name === 'Free';
  const isTrialExhausted = (isFreePlan && draftData?.outlineRegeneratedCount > 0) || trialExhausted;

  // For ALL plans: disable Re-Generate after 1 use per blog
  const isRegenUsed = (draftData?.outlineRegeneratedCount > 0);

  const takeFeedback = () => {
    setIsModalOpen(true);
  };

  // 1. Core Generation Logic (Shared by both buttons)
  const generateBlogStructure = async (withFeedback = false) => {
    setLoader(true);
    setStepLoader(true);
    
    // Payload preparation
    let values = {
      title: step1Data.title,
      uniqueIdentifier: localStorage.getItem('userId'),
      primaryKeywords: step1Data.primaryKeyword,
      secondaryKeywords: step3Data.secondaryKeywords,
      feedback: withFeedback ? feedback : null,
      comment: withFeedback ? comment : null,
      categories,
      temp: withFeedback,
      language: selectedLanguage || 'english',
      draftId: draftId,
      urls: JSON.stringify((step2Data?.scrappedUrl || []).map((u: any) => u.baseurl)),
      fileCount: (step2Data?.files || []).length,
      brandVoice: selectedBrandVoice,
      aiPersona: selectedBlogGuide,
      llmModel: selectedModel
    };

    setFeedback(null);
    setComment(null);

    try {
      const result = await axios.post(`${process.env.REACT_APP_SERVER_URL}/headings`, values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (result.status === 200) {
        try {
          const parsedCategories = typeof result.data.text === 'string' ? JSON.parse(result.data.text) : result.data.text;
          if (parsedCategories[0]?.error) {
            message.error(parsedCategories[0].error);
          } else {
            const categoriesWithIds = addUniqueIds(parsedCategories);
            setCategories(categoriesWithIds);
            message.success(withFeedback ? 'Outline re-generated with feedback' : 'Outline synchronized with latest settings');
            
            // Record these inputs as the new baseline
            setLastOutlineInputs({
              title: step1Data.title,
              primaryKeyword: step1Data.primaryKeyword,
              secondaryKeywords: JSON.stringify(Array.isArray(step3Data?.secondaryKeywords) ? step3Data.secondaryKeywords : []),
              urls: JSON.stringify((step2Data?.scrappedUrl || []).map((u: any) => u.baseurl)),
              fileCount: (step2Data?.files || []).length,
              brandVoice: selectedBrandVoice,
              blogGuide: selectedBlogGuide,
              model: selectedModel,
              language: selectedLanguage
            });

            // Update count
            setDraftData((prev: any) => ({
              ...prev,
              outlineRegeneratedCount: result.data.outlineRegeneratedCount ?? (prev?.outlineRegeneratedCount || 0)
            }));
          }
        } catch (parseError: any) {
          message.error('Error parsing response data: ' + parseError.message);
        }

        // Save Draft update
        const payload = {
          id: draftId,
          userId: localStorage.getItem('userId'),
          outline: result.data.text,
          visited: 5
        };
        await axios.post(`${process.env.REACT_APP_SERVER_URL}/save-draft?userId=${userId}`, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
      }
    } catch (error: any) {
      if (error?.response?.data?.code === 'GUEST_LIMIT_REACHED') {
        setTrialExhausted(true);
      }
      message.error(error?.response?.data?.error || error?.message);
    } finally {
      setLoader(false);
      setStepLoader(false);
    }
  };

  // Re-Generate Logic (Feedback-based)
  const handleRegenerateWithFeedback = () => {
    generateBlogStructure(true);
  };

  // ... rest of the component

  // Auto-Save Logic
  useEffect(() => {
    // Skip if no data or during initial load/restore
    if (!categories || categories.length === 0 || loader) return;

    const autoSave = setTimeout(async () => {
      try {
        const payload = {
          id: draftId,
          userId: localStorage.getItem('userId'),
          outline: JSON.stringify(categories),
          visited: 5
        };

        const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/save-draft?userId=${userId}`, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        
        if (response.data?.result) {
          setDraftData((prev: any) => ({
            ...response.data.result,
            outlineRegeneratedCount: response.data.result.outlineRegeneratedCount ?? prev?.outlineRegeneratedCount ?? 0
          }));
        }
      } catch (error) {
        console.error("Auto-save failed", error);
      }
    }, 2000); // 2 second debounce

    return () => clearTimeout(autoSave);
  }, [categories, draftId, loader, userId]);

  //This api is for generating blog
  const generateBlog = async () => {
    if (categories.length <= 0) {
      message.error('Please provide outline of blog');
      return;
    }
    setGenerateBlogLoader(true);
    setStepLoader(true);

    try {
      let brandVoice: any = {};
      let blogGuide: any = {};

      if (selectedBrandVoice?.length > 0) {
        brandVoice = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/get-brand-voice?userId=${userId}&voiceId=${selectedBrandVoice}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
          }
        );
      }
      if (selectedBlogGuide?.length > 0) {
        blogGuide = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/get-ai-persona?userId=${userId}&guideId=${selectedBlogGuide}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
          }
        );
      }
      
      const blogPayLoad = {
        title: step1Data.title,
        primaryKeywords: step1Data.primaryKeyword,
        secondaryKeywords: step3Data.secondaryKeywords,
        brandVoice: brandVoice.data?.brandVoice || '',
        aiPersona: blogGuide.data?.aiPersona || '',
        links: step4Data.links,
        model: selectedModel,
        language: selectedLanguage,
        userId: userId, // Backend expects userId
        draftId: draftId,
        outline: categories,
        allStructures: categories,
        internalLinksCount: step4Data.links.length,
        referenceLinkCount: `${step2Data.scrappedUrl.length} URLs, ${step2Data.files.length} ${step2Data.files.length == 1 ? 'File' : 'Files'}`
      };

      // Use fetch for streaming
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/auto-create-stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(blogPayLoad)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to start blog generation');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';
      
      // Initialize view
      setBlogContent(['']);
      setCurrentScreen(6);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.trim().startsWith('data: ')) {
              try {
                const data = JSON.parse(line.trim().substring(6));
                if (data.type === 'content') {
                  accumulatedContent += data.chunk;
                  setBlogContent([accumulatedContent]);
                } else if (data.type === 'done') {
                  setBlogId(data.blogId);
                  message.success('Blog generated successfully');
                } else if (data.error) {
                  message.error(data.error);
                }
              } catch (e) {
                console.error('Error parsing SSE line:', line, e);
              }
            }
          }
        }
      }

    } catch (error: any) {
      message.error(error?.response?.data?.error ? error?.response?.data?.error : error?.message);
    } finally {
      setGenerateBlogLoader(false);
      setStepLoader(false);
    }
  };
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

  useEffect(() => {
    if (feedback || comment) {
      generateBlogStructure(true);
    }
  }, [feedback, comment]);

  const handleSignupRedirect = () => {
    const baseUrl = `${window.location.origin}/theta-wave/app`;
    window.open(`${baseUrl}/`, '_blank');
  };

  const token = localStorage.getItem('accessToken');

  return (
    <div className='title-container'>
      <div className='title-wrapper'>
        <div className='title-content'>
          <h1 className='title'>Tell us what topic are you targeting?</h1>
          <p>Define the topic to tailor your content for maximum impact</p>
        </div>
      </div>

      <Form layout='vertical'>
        <NestedDragDropEle loader={loader} isGenerating={generateBlogLoader} />

        <Form.Item className='drag-drop-btn'>
          <div className='btn-wrapper'>
            <div className='left-div'>
              <button
                className='re-generate'
                onClick={takeFeedback}
                disabled={!token || generateBlogLoader || loader || isRegenUsed}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Icon component={RefreshSvg} />
                <span>Re-Generate Outline</span>
              </button>
            </div>

            <Button 
                htmlType='button' 
                loading={generateBlogLoader} 
                onClick={token ? generateBlog : handleSignupRedirect} 
                disabled={loader}
            >
              {token ? 'Generate Blog!' : 'Sign up to Generate!'}
            </Button>
          </div>
        </Form.Item>
      </Form>
      <Modal
        centered
        className='keyword-model'
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        closable={false}
        width={1000}
      >
        <CreateOutlineWithFeedbackModal setFeedback={setFeedback} feedback={feedback} setIsModalOpen={setIsModalOpen} setComment={setComment} comment={comment} />
      </Modal>
    </div>
  );
};

export default ReviewOutline;
