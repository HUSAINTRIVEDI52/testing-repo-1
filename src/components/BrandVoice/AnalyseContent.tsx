import { Button } from 'antd';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';

const AnalyseContent = ({
  setUpdate,
  setEdit,
  update,
  analyse,
  brandVoice,
  formData,
  selectedRecord,
  setAnalyse,
  setIsEditMode,
  isEditMode,
  setBrandVoice,
  editBrandVoice,
  setEditBrandVoice,
  edit
}: any) => {
  const userId = localStorage.getItem('userId');
  const divRef = useRef<HTMLDivElement>(null);
  const [isEdited, setIsEdited] = useState(false);
  const saveBrandVoice = async () => {
    if (divRef.current) {
      const updatedText = Array.from(divRef.current.querySelectorAll('li'))
        .map((li) => `- ${li.innerText.trim()}`)
        .join('\n');
      if (!analyse) {
        let data = {
          content: updatedText,
          userId,
          id: selectedRecord.id,
          name: brandVoice.name
        };
        await axios.put(`${process.env.REACT_APP_SERVER_URL}/brand-voice`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        let data = {
          content: updatedText,
          userId,
          name: brandVoice.name
        };
        await axios.post(`${process.env.REACT_APP_SERVER_URL}/brand-voice`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }
    }
    setIsEditMode(false);
    setAnalyse(false);
    setUpdate(!update);
    setEdit(false);
    setBrandVoice('');
    setEditBrandVoice(false);
  };
  const backEvent = async () => {
    setIsEditMode(false);
    setAnalyse(false);
    setEdit(false);
    setBrandVoice('');
    setEditBrandVoice(false);
  };

  useEffect(() => {
    if (!editBrandVoice) {
      setIsEdited(true);
    }
    const handleInput = () => {
      if (divRef.current) {
        // Compare the current content with the original text
        const originalContent = (brandVoice.analyzedVoice || selectedRecord?.brandVoice || '')
          .split(/\r?\n|^- /gm)
          .filter((point: any) => point.trim() !== '' && point !== '-')
          .join('\n'); // Convert back to a string for comparison

        setIsEdited(divRef.current.innerText.trim() !== originalContent.trim());
      }
    };

    if (divRef.current) {
      divRef.current.addEventListener('input', handleInput);
    }

    return () => {
      if (divRef.current) {
        divRef.current.removeEventListener('input', handleInput);
      }
    };
  }, [selectedRecord, analyse, brandVoice]);

  return (
    <div className='analyse-content'>
      <div className='text-area'>
        {/* here will be conditionally divs */}

        {!selectedRecord && !analyse && (
          <div className='anylyse-title'>Your analysed brand voice will appear here.</div>
        )}
        {(selectedRecord || analyse) && (
          <div className='result-content' contentEditable='true' ref={divRef}>
            <ul>
              {(brandVoice.analyzedVoice || selectedRecord.brandVoice)
                ?.split(/\r?\n|^- /gm) // Handles both Windows (\r\n) & Unix (\n) formats, and dashes
                .filter((point: any) => point.trim() !== '' && point !== '-') // Remove empty & unnecessary dashes
                .map((point: any, index: any) => (
                  <li key={index}>{point.trim()}</li>
                ))}
            </ul>
          </div>
        )}
      </div>
      {
        <div className='btn-wrapper'>
          <Button type='primary' onClick={saveBrandVoice} disabled={!isEdited}>
            Save
          </Button>
          <Button className='cancel' onClick={backEvent}>
            Cancel
          </Button>
        </div>
      }
    </div>
  );
};

export default AnalyseContent;
