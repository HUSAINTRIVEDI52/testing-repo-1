import React, { useEffect, useState } from 'react';
import { Button, Input, message } from 'antd';
import axios from 'axios';
const { TextArea } = Input;

const CreateAiPersona = ({
  setEdit,
  selectedData,
  setUpdate,
  update,
  setSelectedData,
  setEditBlogGuide,
  editBlogGuide,
  setLoader
}: any) => {
  const inputPlaceholder = `Example: Include HTML formatting for headings\nUse more numbered lists.\nAt least 1 subhead per 200 words\nAll statistics should be appropriately referenced with a link, year/period, and publisher.\nDo not include quotes.`;
  const userId = localStorage.getItem('userId');

  // Store initial values when editing an existing persona
  const [initialInputValue, setInitialInputValue] = useState('');
  const [initialInputContent, setInitialInputContent] = useState('');

  // Form fields
  const [inputValue, setInputValue] = useState('');
  const [inputContent, setInputContent] = useState('');

  // Error states
  const [inputValueError, setInputValueError] = useState(false);
  const [inputContentError, setInputContentError] = useState(false);

  // Disable button if no changes
  const [disableBtn, setDisableBtn] = useState(true);

  useEffect(() => {
    if (selectedData) {
      setInputValue(selectedData.name || '');
      setInputContent(selectedData.aiPersona || '');
      setInitialInputValue(selectedData.name || '');
      setInitialInputContent(selectedData.aiPersona || '');
    }
  }, [selectedData]);

  useEffect(() => {
    // Disable button if values are unchanged
    if (!inputContent.trim() || !inputValue.trim()) {
      setDisableBtn(true);
    } else {
      setDisableBtn(
        inputValue.trim() === initialInputValue.trim() && inputContent.trim() === initialInputContent.trim()
      );
    }
  }, [inputValue, inputContent, initialInputValue, initialInputContent]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setInputValueError(!e.target.value.trim());
  };

  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputContent(e.target.value);
    setInputContentError(!e.target.value.trim());
  };

  const validateForm = () => {
    let isValid = true;
    if (!inputValue.trim()) {
      setInputValueError(true);
      isValid = false;
    }
    if (!inputContent.trim()) {
      setInputContentError(true);
      isValid = false;
    }
    return isValid;
  };

  const handleCancel = () => {
    setEdit(false);
    setSelectedData(null);
  };

  const storePersona = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token || token === 'null' || token === 'undefined') {
      message.warning('Please log in to save a Blog Guideline.');
      return;
    }

    if (!validateForm()) return;

    try {
      if (setLoader) setLoader(true);
      const body = {
        name: inputValue.trim(),
        content: inputContent.trim(),
        ...(selectedData && { id: selectedData.id }) // Include ID if updating
      };

      const url = `${process.env.REACT_APP_SERVER_URL}/ai-persona?userId=${userId}`;
      const method = selectedData ? axios.put : axios.post;

      await method(url, body, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      setUpdate(!update);
      setEdit(false);
      setSelectedData(null);
    } catch (error: any) {
      console.error('Error saving persona:', error.message);
      message.error('Something went wrong. Please try again.');
    } finally {
      if (setLoader) setLoader(false);
    }
  };

  return (
    <div className='create-content-editor-wrapper'>
      <div className='blog-guide-content'>
        <div className='title-wrapper-box'>
          <label>
            Title <span className='required'>*</span>
          </label>
          <Input
            name='personaTitle'
            placeholder='Enter your blog guideline title'
            value={inputValue}
            onChange={handleInputChange}
            style={{ height: '48px', borderRadius: '10px' }}
          />
          {inputValueError && (
            <span style={{ color: '#ff4d4f', fontSize: '14px', display: 'block', marginTop: '4px' }}>
              ** Title is required.
            </span>
          )}
        </div>
        <div className='blog-guide-content-inner' style={{ marginTop: '20px' }}>
          <label>
            Description <span className='required'>*</span>
          </label>
          <TextArea
            name='personaDescription'
            placeholder={inputPlaceholder}
            value={inputContent}
            onChange={handleEditorChange}
            rows={8}
            style={{ borderRadius: '10px', resize: 'none' }}
          />
          {inputContentError && (
            <span style={{ color: '#ff4d4f', fontSize: '14px', display: 'block', marginTop: '4px' }}>
              ** Content is required.
            </span>
          )}
        </div>

        <div className='btn-wrapper'>
          <Button className='primary-btn' onClick={storePersona} disabled={disableBtn}>
            Save
          </Button>
          <Button className='light-btn' onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateAiPersona;
