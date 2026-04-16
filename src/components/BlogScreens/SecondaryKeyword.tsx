import React, { useState, useEffect, useRef, useContext } from 'react';
import { Form, Button, Input, InputRef, Tag, Tooltip, Modal, message } from 'antd';
import Icon, { InfoCircleOutlined } from '@ant-design/icons';
import KeywordExplorerModal from './Modal/KeywordExplorerModal';
import { GlobalContext } from '../../Context';
import { ReactComponent as CloseIcon } from '../../assets/icons/fontisto_close.svg';
import Lottie from 'lottie-react';
import proBadgeAnimation from '../../assets/animations/pro-badge.json';

import { ReactComponent as SprinkleIcon } from '../../assets/icons/Sprinkle.svg';
import { ReactComponent as RefreshIcon } from '../../assets/icons/refresh.svg';

import { handleKeywordHandler } from '../../utils/CommonFunction';


const tagInputStyle: React.CSSProperties = {
  width: 64,
  height: 22,
  marginInlineEnd: 8,
  verticalAlign: 'top'
};

const SecondaryKeyword = ({ form }: any) => {
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState('');
  const inputRef = useRef<InputRef>(null);
  const editInputRef = useRef<InputRef>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [keywordData, setKeywordData] = useState<any>();
  const [search, setSearch] = useState<string>('');
  const [keywordExplorerLoader, setKeywordExplorerLoader] = useState<boolean>(false);

  const { step1Data, step3Data, setStep3Data, planDetails, draftId, stepLoader, draftData, trialExhausted, setTrialExhausted, setVisited, currentScreen, visited }: any = useContext(GlobalContext);

  const isFreePlan = planDetails?.name === 'Free';
  const isTrialExhausted = (isFreePlan && draftData?.outlineRegeneratedCount > 0) || trialExhausted;


  const isRegenerationLocked = isFreePlan && (
    step1Data?.hasGeneratedTitle || 
    step1Data?.hasGeneratedPrimaryKeywords || 
    step3Data?.hasGeneratedSecondaryKeywords
  );


  const handleClose = (removedTag: string) => {
    const applyClose = () => {
      // code for filtering secondary keywords  from context
      const filteredSecondaryKeywords = step3Data?.secondaryKeywords?.filter((keyword: any) => keyword !== removedTag);

      setStep3Data((prev: any) => ({
        ...prev,
        secondaryKeywords: filteredSecondaryKeywords
      }));
    };

    if (visited > 4) {
      Modal.confirm({
        title: 'Confirmation Required',
        content: 'As you are changing the keywords, your generated outline will become outdated and you will have to do these steps again. Do you want to continue?',
        okText: 'Yes, Continue',
        cancelText: 'Cancel',
        okButtonProps: { danger: true },
        onOk: () => {
          setVisited(1);
          applyClose();
        }
      });
      return;
    }

    applyClose();
    if (visited < currentScreen) setVisited(currentScreen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.trim()) {
      setInputValue(e.target.value);
    } else {
      setInputValue(e.target.value.trim());
    }
  };

  const handleInputConfirm = () => {
    if (!inputValue.trim()) {
      setInputValue('');
      return;
    }
    if (inputValue && step3Data.secondaryKeywords.length >= 5) {
      message.error('You can only add up to 5 secondary keywords.');
      setInputValue('');
      return;
    }

    const applyConfirm = () => {
      if (inputValue && !step3Data.secondaryKeywords.includes(inputValue)) {
        setStep3Data((prev: any) => ({
          ...prev,
          secondaryKeywords: [...prev.secondaryKeywords, inputValue]
        }));
      }
      setInputValue('');
      setInputVisible(false);
    };

    if (visited > 4) {
      Modal.confirm({
        title: 'Confirmation Required',
        content: 'As you are changing the keywords, your generated outline will become outdated and you will have to do these steps again. Do you want to continue?',
        okText: 'Yes, Continue',
        cancelText: 'Cancel',
        okButtonProps: { danger: true },
        onOk: () => {
          setVisited(1);
          applyConfirm();
        },
        onCancel: () => {
          setInputValue('');
          setInputVisible(false);
        }
      });
      return;
    }

    applyConfirm();
    if (visited < currentScreen) setVisited(currentScreen);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setEditInputValue(e.target.value);
  };

  const handleEditInputConfirm = () => {
    const applyEditConfirm = () => {
      // code for editing existing tags
      const newKeywords = [...step3Data.secondaryKeywords];
      newKeywords[editInputIndex] = editInputValue;
      setStep3Data((prev: any) => ({
        ...prev,
        secondaryKeywords: newKeywords
      }));
      setEditInputIndex(-1);
      setEditInputValue('');
    };

    if (visited > 4) {
      Modal.confirm({
        title: 'Confirmation Required',
        content: 'As you are changing the keywords, your generated outline will become outdated and you will have to do these steps again. Do you want to continue?',
        okText: 'Yes, Continue',
        cancelText: 'Cancel',
        okButtonProps: { danger: true },
        onOk: () => {
          setVisited(1);
          applyEditConfirm();
        }
      });
      return;
    }

    applyEditConfirm();
    if (visited < currentScreen) setVisited(currentScreen);
  };

  const keywordHandler = async () => {
    setKeywordExplorerLoader(true);

    let values = {
      keyword: search !== '' ? search : step1Data.primaryKeyword,
      country: step1Data.selectedLocation,
      type: 'secondary',
      draftId: draftId
    };
    const success = await handleKeywordHandler(
      values, 
      setKeywordExplorerLoader, 
      setKeywordData, 
      setIsModalOpen, 
      'secondary', 
      () => setTrialExhausted(true)
    );
    
    if (success) {
        setStep3Data((prev: any) => ({ ...prev, hasGeneratedSecondaryKeywords: true }));
    }

    setKeywordExplorerLoader(false);
  };

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  useEffect(() => {
    editInputRef.current?.focus();
  }, [editInputValue]);

  return (
    <>
      <div className='title-container secondary-keyword-form'>
        <Form.Item
          label='Secondary Keywords (Max 5 allowed)'
          name='secondaryKeyword'
          className='secondary-keyword-help'
          tooltip={{
            title: `i: These keyword would have around 1% density in your final blog, but we leave to AI to decide on it.\n ii:  To add a keyword, type it in the input field and press "Enter" to confirm and save it.`,
            icon: <InfoCircleOutlined style={{ cursor: 'pointer' }} />
          }}
          rules={[
            {
              validator: (_, value) => {
                if (value && value.trim().length === 0) {
                  // return Promise.reject('Please enter valid keyword');
                }
                if (value && !/^[a-zA-Z0-9\s]+$/.test(value)) {
                  // return Promise.reject('Only letters, numbers, and spaces are allowed!');
                }
                return Promise.resolve();
              }
            }
          ]}
        >
          <div className='keyword-inner'>
            <div className='input-tags'>
              {step3Data?.secondaryKeywords?.map((tag: any, index: any) => {
                if (editInputIndex === index) {
                  return (
                    <Input
                      ref={editInputRef}
                      key={tag}
                      size='small'
                      style={tagInputStyle}
                      value={editInputValue}
                      onChange={handleEditInputChange}
                      onBlur={handleEditInputConfirm}
                      onPressEnter={handleEditInputConfirm}
                    />
                  );
                }
                const isLongTag = tag?.length > 20;
                const tagElem = (
                  <Tag key={tag} closable={!stepLoader && !keywordExplorerLoader} style={{ userSelect: 'none' }} onClose={() => handleClose(tag)}>
                    <button
                      disabled={stepLoader || keywordExplorerLoader}
                      onClick={(e) => {
                        setEditInputIndex(index);
                        setEditInputValue(tag);
                        e.preventDefault();
                      }}
                    >
                      {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                    </button>
                  </Tag>
                );
                return isLongTag ? (
                  <Tooltip title={tag} key={tag}>
                    {tagElem}
                  </Tooltip>
                ) : (
                  tagElem
                );
              })}
              {step3Data.secondaryKeywords.length === 0 && !inputVisible && (
                <span className='placeholder'>Example: Generative AI in healthcare or AI in surgery etc</span>
              )}
              <Input
                ref={inputRef}
                disabled={!step1Data?.primaryKeyword || stepLoader || keywordExplorerLoader}
                type='text'
                size='small'
                style={tagInputStyle}
                value={inputValue}
                onChange={handleInputChange}
                onMouseDown={() => {
                    if (!stepLoader && !keywordExplorerLoader) {
                        setInputVisible(true);
                    }
                }}
                onBlur={handleInputConfirm}
                onPressEnter={handleInputConfirm}
              />
            </div>
              <Tooltip
              placement='left'
              title={
                !step1Data?.primaryKeyword
                  ? 'Please enter a Primary Keyword first'
                  : isRegenerationLocked
                  ? 'Suggesting keywords is limited to 1 time per blog for Free/Guest plans'
                  : ''
              }
            >
              <Button
                disabled={
                  !step1Data?.primaryKeyword ||
                  stepLoader ||
                  keywordExplorerLoader ||
                  isRegenerationLocked
                }
                loading={keywordExplorerLoader}
                onClick={() => {
                  if (visited > 4) {
                    Modal.confirm({
                      title: 'Confirmation Required',
                      content: 'As you are changing the keywords, your generated outline will become outdated and you will have to do these steps again. Do you want to continue?',
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
                className={step3Data.secondaryKeywords.length > 0 ? 're-generate-btn' : 'keyword-btn'}
              >
                {step3Data.secondaryKeywords.length > 0 ? (
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
        </Form.Item>
      </div>
      <KeywordExplorerModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        data={keywordData}
        search={search}
        setSearch={setSearch}
        onSearch={keywordHandler}
        location={step1Data.selectedLocation}
      />
    </>
  );
};

export default SecondaryKeyword;
