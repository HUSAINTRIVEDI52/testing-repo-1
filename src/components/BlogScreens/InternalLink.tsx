import React, { useContext, useState, useEffect } from 'react';
import Icon from '@ant-design/icons/lib/components/Icon';
import { ReactComponent as LinkIcon } from '../../assets/icons/link.svg';
import { ReactComponent as CheckIcon } from '../../assets/icons/check.svg';
import { Form, Input, Button, message, Modal, Tooltip } from 'antd';
import { GlobalContext } from '../../Context';
import axios from 'axios';
import { CheckCircleFilled, InfoCircleOutlined } from '@ant-design/icons';
import InternalLinkConfirmationModal from '../Model/InternalLinkConfirmationModal';
const MAX_LINKS = 5;

const InternalLink = () => {
  const {
    step4Data,
    setStep4Data,
    setCurrentScreen,
    draftId,
    setVisited,
    setSelectedModel,
    setSelectedBlogGuide,
    setSelectedBrandVoice,
    visited,
    userModel,
    currentScreen,
    planDetails,
    setStepLoader,
    stepLoader,
    draftData
  }: any = useContext(GlobalContext);

  const [showNoLinkModal, setShowNoLinkModal] = useState(false);
  const [skipLoading, setSkipLoading] = useState(false);
  const [nextLoading, setNextLoading] = useState(false);

  // Initialize with 5 pairs, prefill with existing links if any
  const [fields, setFields] = useState(() => {
    const filled = step4Data.links || [];
    return Array.from({ length: MAX_LINKS }, (_, i) => ({
      keyword: filled[i]?.keyword || '',
      link: filled[i]?.link || '',
    }));
  });

  const isLocked = planDetails?.name === 'Free';

  useEffect(() => {
    const filled = step4Data.links || [];
    setFields(Array.from({ length: MAX_LINKS }, (_, i) => ({
      keyword: filled[i]?.keyword || '',
      link: filled[i]?.link || '',
    })));
  }, [step4Data.links]);

  // Validation helpers
  const isValidURL = (url: string) => {
    try {
      const parsed = new URL(url.trim());
      // Must be http/https and have a dot in the hostname (e.g., example.com)
      return (
        (parsed.protocol === 'http:' || parsed.protocol === 'https:') &&
        /^[^\s]+\.[^\s]+$/.test(parsed.hostname)
      );
    } catch {
      return false;
    }
  };

  const isValidKeyword = (keyword: string) =>
    keyword && keyword.length > 0 && keyword.length <= 50;

  const isDuplicateKeyword = (keyword: string, idx: number) => {
    const trimmedKeyword = keyword.trim();
    return (
      trimmedKeyword &&
      fields.some(
        (f, i) => i !== idx && f.keyword.trim() === trimmedKeyword
      )
    );
  };

  // Handle input change
  const handleFieldChange = (idx: number, key: 'keyword' | 'link', value: string) => {
    setFields(prev =>
      prev.map((item, i) =>
        i === idx ? { ...item, [key]: value } : item
      )
    );
  };

  const validLinksCount = fields.filter(
    (f, idx) =>
      isValidKeyword(f.keyword) &&
      isValidURL(f.link) &&
      !isDuplicateKeyword(f.keyword, idx)
  ).length;

  const handleProceed = async () => {
    setShowNoLinkModal(false);
    setSkipLoading(true);
    setStepLoader(true);
    
    // Clear the links in context so the sidebar (StepItem) updates correctly!
    setStep4Data({ ...step4Data, links: [] });

    try {
      const value = {
        userId: localStorage.getItem('userId'),
        id: draftId,
        links: [], // Save empty links to server
        visited: 4
      };
      await axios.post(`${process.env.REACT_APP_SERVER_URL}/save-draft?userId=${localStorage.getItem('userId')}`, value, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      if (currentScreen === visited) setVisited(4);
      setCurrentScreen(4);
    } catch (error) {
      console.error(error);
      message.error('Failed to save draft');
    } finally {
      setStepLoader(false);
      setSkipLoading(false);
    }
  };

  const skipHandler = async () => {
    if (!isLocked) {
        setShowNoLinkModal(true);
        return;
    }
    await handleProceed();
  };

  // Save all valid links on Next
  const nextHandler = async () => {
    setNextLoading(true);
    setStepLoader(true);
    const validLinks = fields
      .filter(
        (f, idx) =>
          isValidKeyword(f.keyword) &&
          isValidURL(f.link) &&
          !isDuplicateKeyword(f.keyword, idx)
      )
      .map(f => ({ keyword: f.keyword, link: f.link }));

    // Save only valid links to context
    setStep4Data({ ...step4Data, links: validLinks });

    const token = localStorage.getItem('accessToken');
    if (!token) {
      if (currentScreen === visited) setVisited(4);
      setCurrentScreen(4);
      setStepLoader(false);
      setNextLoading(false);
      return;
    }

    try {
      const value = {
        userId: localStorage.getItem('userId'),
        id: draftId,
        links: validLinks,
        visited: 4
      };
      await axios.post(`${process.env.REACT_APP_SERVER_URL}/save-draft?userId=${localStorage.getItem('userId')}`, value, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      if (currentScreen === visited) setVisited(4);
      setCurrentScreen(4);
    } catch (error) {
      console.error(error);
      message.error('Failed to save draft');
    } finally {
      setStepLoader(false);
      setNextLoading(false);
    }
  };

  return (
    <div className='title-container'>
      <h1 className='title'>Link to Your Related Articles</h1>
      <p>
        Add up to 5 related articles to improve SEO and keep readers engaged.
      </p>
      <Form layout={'vertical'} className='reference-form internal-link-from'>
        <div className={`reference-form-item interlinking w-100 ${isLocked ? 'blur' : ''}`}>
          <Form.Item
            label={
              <div className='cus-label'>
                <Icon component={LinkIcon} /> Set Internal URLs
              </div>
            }
            tooltip={isLocked ? {
                title: 'Upgrade your plan to provide internal links',
                icon: (
                    <InfoCircleOutlined
                        style={{
                            cursor: 'pointer',
                        }}
                    />
                ),
            } : undefined}
          >
            {fields.map((field, idx) => {
              const validKeyword = isValidKeyword(field.keyword);
              const validLink = isValidURL(field.link);
              const duplicate = isDuplicateKeyword(field.keyword, idx);
              const showCheck = validKeyword && validLink && !duplicate;

              // Show error only if user has typed something and it's invalid
              const keywordError = field.keyword && !validKeyword;
              const linkError = field.link && !validLink;

              return (
                <div className='input-inline' key={idx} style={{ marginBottom: 12, alignItems: 'center' }}>
                  <Input
                    disabled={isLocked}
                    placeholder='Keyword'
                    value={field.keyword}
                    maxLength={50}
                    onChange={e => handleFieldChange(idx, 'keyword', e.target.value)}
                    style={{ width: '30%', marginRight: 8 }}
                    status={keywordError ? 'error' : undefined}
                  />
                  <Input
                    disabled={isLocked}
                    placeholder='Add links here'
                    value={field.link}
                    onChange={e => handleFieldChange(idx, 'link', e.target.value)}
                    style={{ width: '50%', marginRight: 8 }}
                    status={linkError ? 'error' : undefined}
                  />
                  {showCheck ? (
                    <CheckCircleFilled style={{ color: '#52c41a', fontSize: 28, marginLeft: 8 }} />
                  ) : (
                    <CheckCircleFilled style={{ color: '#bbb', fontSize: 28, marginLeft: 8 }} />
                  )}
                  {duplicate && (
                    <span style={{ color: 'red', fontSize: 14, marginLeft: 4 }}>
                      Duplicate keyword
                    </span>
                  )}
                </div>
              );
            })}

            {/* Common note at the end */}
            <div style={{ marginTop: 12, fontSize: 14 }}>
              <div style={{ fontWeight: 500, marginBottom: 4 }}>Note:</div>
              <span style={{ marginRight: 16, verticalAlign: 'middle' }}>
                <CheckCircleFilled style={{ color: '#52c41a', fontSize: 22, marginRight: 4, verticalAlign: 'middle' }} />
                Green means both keyword and link are valid.
              </span>
              <br />

              <span style={{ marginRight: 16, verticalAlign: 'middle' }}>
                <CheckCircleFilled style={{ color: '#bbb', fontSize: 22, marginRight: 4, verticalAlign: 'middle' }} />
                Grey means either keyword or link is not valid.
              </span>
            </div>
          </Form.Item>
        </div>
        <div className='btn-wrapper'>
          <Form.Item className='skip-btn'>
            <Button
              type='default'
              onClick={skipHandler}
              disabled={stepLoader || nextLoading || validLinksCount > 0}
              loading={skipLoading}
            >
              Skip
            </Button>
          </Form.Item>
          <Form.Item className='next-btn'>
            <Button
              type='primary'
              onClick={nextHandler}
              loading={nextLoading}
              disabled={skipLoading || stepLoader || validLinksCount === 0}
            >
              Next
            </Button>
          </Form.Item>
        </div>
      </Form>
      <Modal
        centered
        className='keyword-model'
        open={showNoLinkModal}
        onCancel={() => setShowNoLinkModal(false)}
        footer={null}
        closable={false}
      >
        <InternalLinkConfirmationModal
          setIsModalOpen={setShowNoLinkModal}
          handleProceed={handleProceed}
        />
      </Modal>
    </div>
  );
};

export default InternalLink;
