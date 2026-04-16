import React, { useEffect, useState } from 'react';
import { Button, Input } from 'antd';
import Icon from '@ant-design/icons';
import axios from 'axios';
import { ReactComponent as LeftSvg } from '../../assets/icons/Property 1=iconamoon_arrow-up-2.svg';
import { useLocation, useNavigate } from 'react-router-dom';

const CreateStyleGuide = () => {
  let inputPlaceholder = 'Enter your persona here...';
  const userId = localStorage.getItem('userId');
  const location = useLocation();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [inputContent, setInputContent] = useState('');
  const [inputError, setInputError] = useState(false);
  const [initialContent, setInitialContent] = useState<any>('');
  const handleEditorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputContent(e.target.value);
    setInitialContent(e.target.value);
  };
  const storePersona = async () => {
    if (!inputValue.trim()) {
      setInputError(true);
      return;
    }
    if (!inputContent.trim()) {
      setInputError(true);
      return;
    }
    try {
      if (location.state.edit) {
        const body = {
          name: inputValue,
          content: initialContent,
          id: location.state.data.id
        };
        await axios.put(`${process.env.REACT_APP_SERVER_URL}/style-guide?userId=${userId}`, body, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
      } else {
        const body = {
          name: inputValue,
          content: initialContent
        };
        await axios.post(`${process.env.REACT_APP_SERVER_URL}/style-guide?userId=${userId}`, body, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
      }

      navigate('/style-guide');
    } catch (error: any) {
      console.log('err', error.message);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setInputError(false); // Clear the error when the user starts typing
  };
  useEffect(() => {
    if (location.state.data) {
      setInputValue(location.state.data.name);
      setInputContent(location.state.data.styleGuide);
    }
  }, []);

  return (
    <div className='create-content-editor-wrapper'>
      <div className='breadcrumbs-wrapper'>
        <div className='breadcrumbs-title'>
          <button onClick={() => navigate('/style-guide')} className='back'>
            <Icon component={LeftSvg} /> Back
          </button>
          <Input placeholder={inputPlaceholder} value={inputValue} onChange={handleInputChange} required />
          {inputError && <span className='error-message'>This field is required.</span>}
        </div>
        <div className='btn-wrapper'>
          <Button onClick={storePersona}>Save</Button>
        </div>
      </div>
      <div className='reader-content'>
        <Input placeholder={inputPlaceholder} value={inputContent} onChange={handleEditorChange} required />
        {inputError && <span className='error-message'>This field is required.</span>}
      </div>
    </div>
  );
};

export default CreateStyleGuide;
