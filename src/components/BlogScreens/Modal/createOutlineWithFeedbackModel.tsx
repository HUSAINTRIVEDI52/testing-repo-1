import React, { useEffect, useState } from 'react';
import { Input } from 'antd';
import './common-modal.scss';

const { TextArea } = Input;

export default function CreateOutlineWithFeedbackModal({ setFeedback, setComment, setIsModalOpen, feedback }: any) {
  const [dislikeInput, setDislikeInput] = useState('');
  const [promptInput, setPromptInput] = useState('');

  const handleClick = async () => {
    setFeedback(promptInput);
    setComment(dislikeInput);
    setDislikeInput('');
    setPromptInput('');
    setIsModalOpen(false);
  };

  useEffect(() => { }, [feedback]);

  return (
    <div className='Generation-content-wrapper' style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingTop: '16px', minHeight: '600px' }}>
      <div className='body-content' style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px' }}>Regenerate Outline</h2>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ marginBottom: '8px', fontWeight: 600, fontSize: '16px', color: '#1a1a1a' }}>What didn't work for you in this outline? <span style={{ color: 'red' }}>*</span></div>
          <Input
            className='input-area'
            placeholder='e.g. key technical details were missing, structure was too simple...'
            value={dislikeInput}
            onChange={(e) => setDislikeInput(e.target.value)}
            style={{ height: '44px', borderRadius: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '8px', fontWeight: 600, fontSize: '16px', color: '#1a1a1a' }}>Guide how to improve the outline <span style={{ color: 'red' }}>*</span></div>
          <div style={{ color: '#666', marginBottom: '12px' }}>Provide specific instructions or new topics to include.</div>
          <TextArea
            className='input-area'
            rows={10}
            placeholder='e.g. Please add a section on best practices using the new framework and expand the introduction with recent statistics...'
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            style={{ borderRadius: '8px', resize: 'none', flex: 1 }}
          />
        </div>

      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: 'auto' }}>
        <button
          onClick={() => {
            setDislikeInput('');
            setPromptInput('');
            setIsModalOpen(false);
          }}
          className='light-btn'
        >
          Cancel
        </button>
        <button
          className='btn-regenerate'
          onClick={handleClick}
          disabled={!dislikeInput || !promptInput}
        >
          Regenerate Outline
        </button>
      </div>
    </div>
  );
}
