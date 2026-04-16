import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, Button, message } from 'antd';
import { PictureOutlined } from '@ant-design/icons';
import axios from 'axios';

const { TextArea } = Input;
const { Option } = Select;

interface BlogImageGeneratorModalProps {
  open: boolean;
  onClose: () => void;
  onInsert: (imageUrl: string) => void;
  blogTitle?: string;
  blogId?: string;
  imageGenerationCount?: number;
  onGenerationSuccess?: (newCount: number) => void;
}

const BlogImageGeneratorModal: React.FC<BlogImageGeneratorModalProps> = ({
  open,
  onClose,
  onInsert,
  blogTitle,
  blogId,
  imageGenerationCount = 0,
  onGenerationSuccess
}) => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState('1024x1024');
  const [quality, setQuality] = useState('standard');
  const [style, setStyle] = useState('vivid');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [revisedPrompt, setRevisedPrompt] = useState<string | null>(null);
  const isLimitReached = imageGenerationCount >= 2;

  // Reset display state every time modal opens — prompt starts empty
  useEffect(() => {
    if (open) {
      setGeneratedImage(null);
      setRevisedPrompt(null);
      setSize('1024x1024');
      setQuality('standard');
      setStyle('vivid');
      setPrompt('');
    }
  }, [open]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      message.warning('Please enter a prompt.');
      return;
    }

    if (isLimitReached) {
      message.error('You have reached the maximum limit of 2 image generations for this blog.');
      return;
    }

    setLoading(true);
    setGeneratedImage(null);
    setRevisedPrompt(null);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/generate-image`,
        { prompt: prompt.trim(), size, quality, style, blogId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      if (response.data?.images?.[0]) {
        setGeneratedImage(response.data.images[0]);
        setRevisedPrompt(response.data.revisedPrompt || null);
        if (onGenerationSuccess) {
          onGenerationSuccess(imageGenerationCount + 1);
        }
        message.success('Image generated!');
      } else {
        message.error('No image returned. Please try again.');
      }
    } catch (error: any) {
      message.error(
        error?.response?.data?.error || 'Failed to generate image.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInsert = () => {
    if (generatedImage) {
      onInsert(generatedImage);
      // Reset state and close
      setGeneratedImage(null);
      setRevisedPrompt(null);
      setPrompt('');
      onClose();
    }
  };

  const handleCancel = () => {
    if (!loading) {
      setGeneratedImage(null);
      setRevisedPrompt(null);
      onClose();
    }
  };

  return (
    <Modal
      title={
        <span style={{ fontSize: '18px', fontWeight: 600 }}>
          <PictureOutlined style={{ marginRight: 8, color: '#ff7c02' }} />
          Generate AI Image
        </span>
      }
      open={open}
      onCancel={handleCancel}
      width={720}
      centered
      maskClosable={!loading}
      closable={!loading}
      className="blog-image-generator-modal"
      footer={null}
    >
      <div className="bimg-modal-body">
        {/* Prompt */}
        <div className="bimg-field">
          <label>Prompt</label>
          <TextArea
            placeholder={blogTitle 
              ? `e.g. A featured image for "${blogTitle}" — modern, clean style`
              : 'Describe the image you want to generate...'
            }
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            maxLength={4000}
            showCount
            autoSize={{ minRows: 3, maxRows: 5 }}
            disabled={loading}
          />
        </div>

        {/* Settings row */}
        <div className="bimg-settings-row">
          <div className="bimg-field">
            <label>Size</label>
            <Select value={size} onChange={setSize} disabled={loading} style={{ width: '100%' }}>
              <Option value="1024x1024">Square (1:1)</Option>
              <Option value="1792x1024">Landscape (16:9)</Option>
              <Option value="1024x1792">Portrait (9:16)</Option>
            </Select>
          </div>
          <div className="bimg-field">
            <label>Quality</label>
            <Select value={quality} onChange={setQuality} disabled={loading} style={{ width: '100%' }}>
              <Option value="standard">Standard</Option>
              <Option value="hd">HD</Option>
            </Select>
          </div>
          <div className="bimg-field">
            <label>Style</label>
            <Select value={style} onChange={setStyle} disabled={loading} style={{ width: '100%' }}>
              <Option value="vivid">✨ Vivid</Option>
              <Option value="natural">🌿 Natural</Option>
            </Select>
          </div>
        </div>

        {/* Generate button */}
        <Button
          type="primary"
          icon={<PictureOutlined />}
          onClick={handleGenerate}
          loading={loading}
          disabled={loading || !prompt.trim() || isLimitReached}
          block
          size="large"
          className="bimg-generate-btn"
        >
          {loading ? 'Generating...' : (isLimitReached ? 'Generation Limit Reached (2/2)' : 'Generate Image')}
        </Button>

        {/* Status message */}
        {isLimitReached && !loading && (
          <div style={{ marginBottom: '16px', textAlign: 'center', color: '#ff4d4f', fontWeight: 500 }}>
            Maximum 2 image generations allowed per blog post.
          </div>
        )}

        {/* Loading message */}
        {loading && (
          <div className="bimg-loading">
            <span> Creating your image.. it will take 10–20 seconds…</span>
          </div>
        )}

        {/* Generated image preview */}
        {!loading && generatedImage && (
          <div className="bimg-preview">
            <div className="bimg-preview-card">
              <img src={generatedImage} alt="Generated" />
            </div>

            {/* Revised prompt — shown only after first generation (1/2) */}
            {imageGenerationCount === 1 && revisedPrompt && revisedPrompt !== prompt && (
              <div className="bimg-revised">
                <strong>AI Enhanced Prompt:</strong> {revisedPrompt}
              </div>
            )}

            {/* Insert button + Regenerate (only if not reached limit) */}
            <div className="bimg-insert-actions">
              {!isLimitReached && (
                <Button onClick={handleGenerate} disabled={loading}>
                  Regenerate
                </Button>
              )}
              <Button type="primary" onClick={handleInsert} className="bimg-insert-btn">
                Insert into Blog
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default BlogImageGeneratorModal;
