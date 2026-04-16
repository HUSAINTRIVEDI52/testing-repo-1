import React, { useContext, useEffect, useState } from 'react';
import CreateBrandVoiceModal from '../BrandVoice/CreateBrandVoiceModal';
import CreateAiPersonaModal from '../CreateAiPersona/CreateAiPersonaModal';
import './blog-screen.scss';
import { Form, Select, Button, message, Modal, Alert } from 'antd';
import Icon from '@ant-design/icons/lib/components/Icon';
import { ReactComponent as DownIcon } from '../../assets/icons/Property 1=material-symbols_arrow-drop-down.svg';
import { GlobalContext } from '../../Context';
import { modelDropdown, languagesDropdown, plans } from '../../constant';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import { addUniqueIds } from '../../utils/CommonFunction';

const WritingStyle = () => {
  const {
    setCurrentScreen,
    brandVoice,
    parsona,
    setBrandVoice,
    setParsona,
    selectedBrandVoice,
    setSelectedBrandVoice,
    selectedBlogGuide,
    setSelectedBlogGuide,
    selectedModel,
    setSelectedModel,
    selectedLanguage,
    userModel,
    userLanguage,
    setSelectedLanguage,
    draftId,
    setVisited,
    currentScreen,
    categories,
    setCategories,
    setDraftData,
    planDetails,
    setPlanDetails,
    stepLoader,
    setStepLoader,
    step1Data,
    step2Data,
    step3Data,
    lastOutlineInputs,
    setLastOutlineInputs,
    visited
  }: any = useContext(GlobalContext);
  const userId = localStorage.getItem('userId');
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [modalLoading, setModalLoading] = useState<boolean>(false);
  const [isBrandVoiceModalOpen, setIsBrandVoiceModalOpen] = useState(false);
  const [isParsonaModalOpen, setIsParsonaModalOpen] = useState(false);
  const [isBrandVoiceOpen, setIsBrandVoiceOpen] = useState(false);
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const [updateBrandVoice, setUpdateBrandVoice] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();


  const onFinish = async (values: any) => {
    setStepLoader(true);
    
    try {
      // Compare current key inputs against what was used in the last outline generation.
      // If anything changed (or no outline exists), the headings API must be called again.
      const currentTitle = step1Data?.title || '';
      const currentPK = step1Data?.primaryKeyword || '';
      const currentSK = JSON.stringify(
        Array.isArray(step3Data?.secondaryKeywords) ? step3Data.secondaryKeywords : []
      );
      // Step 2: reference URLs and file count
      const currentUrls = JSON.stringify(
        (step2Data?.scrappedUrl || []).map((u: any) => u.baseurl)
      );
      const currentFileCount = (step2Data?.files || []).length;
      // Step 4: writing style inputs
      const currentBrandVoice = selectedBrandVoice || '';
      const currentBlogGuide = selectedBlogGuide || '';
      const currentModel = selectedModel || '';
      const currentLanguage = selectedLanguage || '';

      const inputsChanged =
        categories.length === 0 ||
        !lastOutlineInputs ||
        lastOutlineInputs.title !== currentTitle ||
        lastOutlineInputs.primaryKeyword !== currentPK ||
        lastOutlineInputs.secondaryKeywords !== currentSK ||
        lastOutlineInputs.urls !== currentUrls ||
        lastOutlineInputs.fileCount !== currentFileCount ||
        lastOutlineInputs.brandVoice !== currentBrandVoice ||
        lastOutlineInputs.blogGuide !== currentBlogGuide ||
        lastOutlineInputs.model !== currentModel ||
        lastOutlineInputs.language !== currentLanguage;

      // 1. First, call /headings to generate the outline when inputs changed
      let categoriesFromApi = null;
      let outlineTextRaw = null;
      
      if (inputsChanged) {
        // Clear stale outline before generating a fresh one
        setCategories([]);

        const formData = new FormData();
        formData.append('title', currentTitle);
        formData.append('uniqueIdentifier', localStorage.getItem('userId') || '');
        formData.append('language', selectedLanguage || 'English');
        formData.append('primaryKeywords', currentPK);
        formData.append('draftId', draftId || '');
        formData.append('feedback', '');
        
        // Add new parameters for brand voice and AI persona
        formData.append('brandVoice', selectedBrandVoice || '');
        formData.append('aiPersona', selectedBlogGuide || '');
        formData.append('llmModel', selectedModel || '');
        
        // Append secondary keywords
        const secondaryKeywords = Array.isArray(step3Data?.secondaryKeywords)
          ? step3Data.secondaryKeywords
          : step3Data?.secondaryKeywords ? [step3Data.secondaryKeywords] : [];
        formData.append('secondaryKeywords', JSON.stringify(secondaryKeywords));
        
        // Append URLs
        const urls = (step2Data?.scrappedUrl || []).map((u: any) => u.baseurl);
        formData.append('urls', JSON.stringify(urls));
        
        // Append files if any
        let fileIndex = 1;
        (step2Data?.files || []).forEach((fileItem: any) => {
          if (fileItem instanceof File) {
            formData.append(`file${fileIndex}`, fileItem, fileItem.name);
            fileIndex += 1;
          }
        });

        formData.append('userConfirmed', 'true');

        const headingsResponse = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/headings/`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
          }
        );
        
        outlineTextRaw = headingsResponse?.data?.text || headingsResponse?.data?.outline || headingsResponse?.data;
        if (outlineTextRaw) {
            const parsedCategories = typeof outlineTextRaw === 'string' ? JSON.parse(outlineTextRaw) : outlineTextRaw;
            categoriesFromApi = addUniqueIds(parsedCategories);
            setCategories(categoriesFromApi);
        }

        // Update draft data with count from server (handles structural resets)
        setDraftData((prev: any) => ({
          ...prev,
          outlineRegeneratedCount: headingsResponse.data.outlineRegeneratedCount ?? (prev?.outlineRegeneratedCount || 0)
        }));

        // Record ALL inputs used so future Next clicks can detect any change
        setLastOutlineInputs({
          title: currentTitle,
          primaryKeyword: currentPK,
          secondaryKeywords: currentSK,
          urls: currentUrls,
          fileCount: currentFileCount,
          brandVoice: currentBrandVoice,
          blogGuide: currentBlogGuide,
          model: currentModel,
          language: currentLanguage
        });
      }

      // 2. Save Draft with Writing Style and New Outline
      const token = localStorage.getItem('accessToken');
      const isGuest = !token || token === 'null' || token === 'undefined' || !userId || userId === 'null';

      if (isGuest) {
          console.log('WritingStyle: Skipping save-draft for guest user');
          setVisited(5);
          setCurrentScreen(5);
          return;
      }

      const value = {
        uniqueIdentifier: userId,
        userId: userId,
        id: draftId,
        writingStyle: {
          brandVoice: selectedBrandVoice,
          aiPersona: selectedBlogGuide,
          model: selectedModel
        },
        language: selectedLanguage,
        outline: outlineTextRaw ? (typeof outlineTextRaw === 'string' ? outlineTextRaw : JSON.stringify(outlineTextRaw)) : undefined,
        visited: 5
      };

      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/save-draft?userId=${userId}`, value, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Update outline if auto-generated by backend fallback (just in case)
      if (!categoriesFromApi && response.data && response.data.result && response.data.result.outline) {
         let outlineData = response.data.result.outline;
         if (typeof outlineData === 'string') {
             try {
                outlineData = JSON.parse(outlineData);
             } catch(e) {
                 console.error("Error parsing outline from fallback in WritingStyle", e);
             }
         }
         if (setCategories && outlineData) {
             setCategories(addUniqueIds(outlineData));
         }
      }

      setVisited(5);
      setCurrentScreen(5);
    } catch (error: any) {
      console.error(error);
      if (error?.response?.status === 403) {
          message.error(error?.response?.data?.error || 'Feature not available on your plan. Please upgrade.');
      } else {
          message.error(error?.response?.data?.error ? error?.response?.data?.error : 'Failed to save draft and generate outline');
      }
    } finally {
      setStepLoader(false);
    }
  };

  const getBrandVoice = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token || token === 'null' || token === 'undefined' || !userId || userId === 'null') return;
    try {
      const data = await axios.get(`${process.env.REACT_APP_SERVER_URL}/brand-voice?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setBrandVoice(data.data.map((item: any) => ({ value: item?.id, label: item?.name })));
    } catch (error: any) {
      console.log('err', error.message);
    }
  };
  const getAiPersona = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token || token === 'null' || token === 'undefined' || !userId || userId === 'null') return;
    try {
      const data = await axios.get(`${process.env.REACT_APP_SERVER_URL}/ai-persona?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setParsona(data.data.map((item: any) => ({ value: item?.id, label: item?.name })));
    } catch (error: any) {
      console.log('err', error.message);
    }
  };

  const onChange = (value: string, name: string) => {
    switch (name) {
      case 'brandVoice':
        setSelectedBrandVoice(value);
        break;
      case 'parsona':
        setSelectedBlogGuide(value);
        break;
      case 'styleGuide':
        setSelectedModel(value);
        break;
      case 'language':
        setSelectedLanguage(value);
        break;
      default:
        break;
    }
  };

  const onSearch = (value: string) => { };

  useEffect(() => {
    const loadData = async () => {
      setLoadingData(true);
      try {
        await Promise.all([getBrandVoice(), getAiPersona()]);
        setSelectedLanguage(selectedLanguage ? selectedLanguage : userLanguage);
        setSelectedModel(selectedModel ? selectedModel : userModel);
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
  }, [userLanguage, userModel, updateBrandVoice]);
  return (
    <div className='title-container'>
      <h1 className='title'>Writing Style</h1>
      <p>Choose the right brand voice, persona & style guide as defined under global settings</p>
      <Form
        data-testid='formwrite'
        form={form}
        layout={'vertical'}
        onFinish={onFinish}
        className='writing-style-form'
        fields={[
          {
            name: 'brandVoice',
            value: selectedBrandVoice
          },
          {
            name: 'parsona',
            value: selectedBlogGuide
          },
          {
            name: 'styleGuide',
            value: selectedModel
          },
          {
            name: 'language',
            value: selectedLanguage
          }
        ]}
      >
        <Form.Item label='Brand Voice' name='brandVoice'>
          <Select
            showSearch
            disabled={loadingData || modalLoading || stepLoader}
            placeholder='Select from different brand voice'
            optionFilterProp='label'
            onChange={(value) => {
              if (visited > 4) {
                Modal.confirm({
                  title: 'Confirmation Required',
                  content: 'As you are changing the brand voice, your generated outline will become outdated and you will have to do these steps again. Do you want to continue?',
                  okText: 'Yes, Continue',
                  cancelText: 'Cancel',
                  okButtonProps: { danger: true },
                  onOk: () => {
                    setVisited(1);
                    onChange(value, 'brandVoice');
                  },
                  onCancel: () => {
                    form.setFieldValue('brandVoice', selectedBrandVoice);
                  }
                });
                return;
              }
              if (visited < currentScreen) setVisited(currentScreen);
              onChange(value, 'brandVoice');
            }}
            onSearch={onSearch}
            suffixIcon={<Icon component={DownIcon} />}
            popupClassName='custom-select-dropdown'
            open={isBrandVoiceOpen}
            onDropdownVisibleChange={(open) => setIsBrandVoiceOpen(open)}
            // rootClassName='custom-select-dropdown'
            dropdownRender={menu => {
              // const brandVoiceOptions = Array.isArray(brandVoice) ? brandVoice : [];
              return (
                <>
                  {menu}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: 8,
                      cursor: 'pointer',
                      borderTop: '1px solid #f0f0f0'
                    }}
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => {
                      setIsBrandVoiceModalOpen(true);
                      setIsBrandVoiceOpen(false);
                    }}
                  >
                    <PlusOutlined style={{ marginRight: 8 }} />
                    Add Brand Voice
                  </div>
                </>
              );
            }}
            options={[
              { value: '', label: 'Select brand voice', disabled: false },
              ...(Array.isArray(brandVoice) ? brandVoice : [])
            ]}
          />
        </Form.Item>
        <Form.Item label='Blog Guideline' name='parsona'>
          <Select
            showSearch
            disabled={loadingData || modalLoading || stepLoader}
            placeholder='Select blog guideline'
            optionFilterProp='label'
            onChange={(value) => {
              if (visited > 4) {
                Modal.confirm({
                  title: 'Confirmation Required',
                  content: 'As you are changing the blog guideline, your generated outline will become outdated and you will have to do these steps again. Do you want to continue?',
                  okText: 'Yes, Continue',
                  cancelText: 'Cancel',
                  okButtonProps: { danger: true },
                  onOk: () => {
                    setVisited(1);
                    onChange(value, 'parsona');
                  },
                  onCancel: () => {
                    form.setFieldValue('parsona', selectedBlogGuide);
                  }
                });
                return;
              }
              if (visited < currentScreen) setVisited(currentScreen);
              onChange(value, 'parsona');
            }}
            onSearch={onSearch}
            suffixIcon={<Icon component={DownIcon} />}
            popupClassName='custom-select-dropdown'
            open={isPersonaOpen}
            onDropdownVisibleChange={(open) => setIsPersonaOpen(open)}
            options={[
              { value: '', label: 'Select blog guideline', disabled: false },
              ...(Array.isArray(parsona) ? parsona : [])
            ]}
            dropdownRender={menu => {
              const parsonaOptions = Array.isArray(parsona) ? parsona : [];
              return (
                <>
                  {menu}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: 8,
                      cursor: 'pointer',
                      borderTop: '1px solid #f0f0f0'
                    }}
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => {
                      setIsParsonaModalOpen(true);
                      setIsPersonaOpen(false);
                    }}
                  >
                    <PlusOutlined style={{ marginRight: 8 }} />
                    Add Blog Guideline
                  </div>
                </>
              );
            }}
          />
        </Form.Item>
        <Form.Item label='LLM model' name='styleGuide' required rules={[{ required: true }]}>
          <Select
            showSearch
            disabled={loadingData || modalLoading || stepLoader}
            placeholder='Choose llm model'
            optionFilterProp='label'
            onChange={(value) => {
              if (visited > 4) {
                Modal.confirm({
                  title: 'Confirmation Required',
                  content: 'As you are changing the LLM model, your generated outline will become outdated and you will have to do these steps again. Do you want to continue?',
                  okText: 'Yes, Continue',
                  cancelText: 'Cancel',
                  okButtonProps: { danger: true },
                  onOk: () => {
                    setVisited(1);
                    onChange(value, 'styleGuide');
                  },
                  onCancel: () => {
                    form.setFieldValue('styleGuide', selectedModel);
                  }
                });
                return;
              }
              if (visited < currentScreen) setVisited(currentScreen);
              onChange(value, 'styleGuide');
            }}
            onSearch={onSearch}
            suffixIcon={<Icon component={DownIcon} />}
            options={modelDropdown.map((model) => ({
              label: model.value,
              value: model.value,
              type: model.type,
              disabled: !plans[planDetails?.name || 'Free']?.includes(model.type)
            }))}
            optionRender={(option) => (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{option.data.label}</span>
                {option.data.type && (
                  <span className='lang-plan-badge' data-type={option.data.type}>
                    {option.data.type}
                  </span>
                )}
              </div>
            )}
            defaultValue={userModel}
          />
        </Form.Item>
        <Form.Item label='Language' name='language' required rules={[{ required: true }]}>
          <Select
            showSearch
            disabled={loadingData || modalLoading || stepLoader}
            placeholder='Choose Language'
            optionFilterProp='label'
            onChange={(value) => {
              if (visited > 4) {
                Modal.confirm({
                  title: 'Confirmation Required',
                  content: 'As you are changing the language, your generated outline will become outdated and you will have to do these steps again. Do you want to continue?',
                  okText: 'Yes, Continue',
                  cancelText: 'Cancel',
                  okButtonProps: { danger: true },
                  onOk: () => {
                    setVisited(1);
                    onChange(value, 'language');
                  },
                  onCancel: () => {
                    form.setFieldValue('language', selectedLanguage);
                  }
                });
                return;
              }
              if (visited < currentScreen) setVisited(currentScreen);
              onChange(value, 'language');
            }}
            onSearch={onSearch}
            suffixIcon={<Icon component={DownIcon} />}
            optionLabelProp='label'
            options={languagesDropdown.map((language) => ({
              label: language.value,
              value: language.value,
              type: language.type,
              disabled: !plans[planDetails?.name || 'Free']?.includes(language.type)
            }))}
            optionRender={(option) => (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{option.data.label}</span>
                {option.data.type && (
                  <span className='lang-plan-badge' data-type={option.data.type}>
                    {option.data.type}
                  </span>
                )}
              </div>
            )}
          />
        </Form.Item>
        <div className='btn-wrapper'>
          <Form.Item className='next-btn'>
            <Button 
                type='primary' 
                htmlType='submit' 
                loading={stepLoader}
                disabled={loadingData || modalLoading || stepLoader}
            >
              next
            </Button>
          </Form.Item>
        </div>
      </Form>

      {/* Ant Design Modal for confirmation */}
      {isBrandVoiceModalOpen && (
        <CreateBrandVoiceModal
          visible={isBrandVoiceModalOpen}
          onCancel={() => setIsBrandVoiceModalOpen(false)}
          setAnalyse={() => { }}
          setLoader={setModalLoading}
          setBrandVoice={setBrandVoice}
          setUpdate={setUpdateBrandVoice}
          update={updateBrandVoice}
          setIsEditMode={() => { }}
          setEdit={() => { }}
          setFormData={() => { }}
        />
      )}

      <React.Fragment>
        {isParsonaModalOpen && (
          <CreateAiPersonaModal
            visible={isParsonaModalOpen}
            onCancel={() => setIsParsonaModalOpen(false)}
            setUpdate={setUpdateBrandVoice}
            update={updateBrandVoice}
            setLoader={setModalLoading}
          />
        )}
      </React.Fragment>
    </div>
  );
};

export default WritingStyle;
