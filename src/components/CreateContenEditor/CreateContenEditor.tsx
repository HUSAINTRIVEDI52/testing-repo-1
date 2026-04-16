import React, { useState } from 'react';
import Icon from '@ant-design/icons';
import './create-content-editor.scss';
import { ReactComponent as LeftSvg } from '../../assets/icons/Property 1=iconamoon_arrow-up-2.svg';
import { Button, Input } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateContenEditor = ({
  editorRef,
  handleEditorChange,
  initialContent,
  setInitialContent,
  inputPlaceholder,
  editorPlaceholder
}: any) => {
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState(false);
  const storePersona = async () => {
    if (!inputValue.trim()) {
      setInputError(true);
      return;
    }
    try {
      const body = {
        name: inputValue,
        content: initialContent
      };
      const data = await axios.post(`${process.env.REACT_APP_SERVER_URL}/ai-persona?userId=${userId}`, body, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      navigate('/blog-guideline');
    } catch (error: any) {
      console.log('err', error.message);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setInputError(false); // Clear the error when the user starts typing
  };

  return (
    <div className='create-content-editor-wrapper'>
      <div className='breadcrumbs-wrapper'>
        <div className='breadcrumbs-title'>
          <button onClick={() => navigate('/blog-guideline')} className='back'>
            <Icon component={LeftSvg} /> Back
          </button>
          <Input placeholder={inputPlaceholder} value={inputValue} onChange={handleInputChange} />
          {inputError && <span className='error-message'>This field is required.</span>}
        </div>
        <div className='btn-wrapper'>
          <Button onClick={storePersona}>Save</Button>
        </div>
      </div>
      <div className='reader-content'>
        <Editor
          apiKey={process.env.REACT_APP_EDITOR_KEY}
          onInit={(_evt: any, editor: any) => (editorRef.current = editor)}
          onEditorChange={handleEditorChange}
          init={{
            placeholder: editorPlaceholder,
            menubar: false,
            branding: false,
            plugins:
              'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
            toolbar:
              'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
            toolbar_mode: 'scrolling'
          }}
          initialValue={initialContent}
        />
      </div>
    </div>
  );
};

export default CreateContenEditor;
