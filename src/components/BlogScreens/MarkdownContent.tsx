import React, { useContext, useEffect, useState } from "react";
import { Button, Skeleton, Dropdown, message } from "antd";
import Markdown from "markdown-to-jsx";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../Context";
import axios from "axios";
import posthog from "posthog-js";
import { DownOutlined, FileTextOutlined, FileWordOutlined, CodeOutlined } from '@ant-design/icons';

const MarkdownContent = ({ setIsModalOpen, current }: any) => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const { blogContent, blogId, usage, setUsage, draftId, step1Data, stepLoader }: any = useContext(GlobalContext);

  const markdownContent = blogContent;
  const isWaitingForStream = markdownContent && markdownContent[current - 1] === '';
  const [downloadLoading, setDownloadLoading] = useState(false);

  const handleDownload = async (format: string) => {
    // ... existing download logic ...
    setDownloadLoading(true);
    const hideLoading = message.loading('Download started...', 0);
    
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/download-blog`, {
        params: { id: blogId, format: format },
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      const href = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = href;

      const extension = format === 'markdown' ? 'md' : format;
      const safeTitle = step1Data?.title 
        ? step1Data.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() 
        : 'blog-content';
      
      link.setAttribute('download', `${safeTitle}.${extension}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(href);
      
      hideLoading();
      message.success('Download completed successfully');
      
    } catch (error) {
      console.error('Download failed', error);
      hideLoading();
      message.error('Failed to download blog. Please try again.');
    } finally {
      setDownloadLoading(false);
    }
  };

const handleDoneClick = () => {
  localStorage.setItem('blog-completed', 'true');
  posthog.capture('blog_done_clicked', { draftId });

  // ✅ Give PostHog enough time to render the survey
  setTimeout(() => {
    navigate('/my-blog');
  }, 2000);
};

  const getUsage = async () => {
    try {
      const usage = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/usage?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setUsage({
        usedBlog: usage.data?.blogCreated || 0,
        totalBlog: usage.data?.blogLimit || 0,
        usedRegeneration: usage.data?.blogRegenerated || 0,
        totalRegeneration: usage.data?.blogRegenerationLimit || 0,
        usedPlagiarism: usage.data?.plagarismChecked || 0,
        totalPlagiarism: usage.data?.plagarismCheckLimit || 0,
      });
    } catch(e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getUsage();
  }, []);

  return (
    <div className="markdown-wrapper">
      {isWaitingForStream ? (
        <div style={{ padding: '20px 0' }} className="stream-loading-skeleton">
          <Skeleton 
            active 
            paragraph={{ rows: 12, width: ['100%', '95%', '100%', '85%', '90%', '100%', '95%', '85%', '90%', '100%', '80%', '90%'] }} 
            title={{ width: '40%' }}
          />
        </div>
      ) : (
        <Markdown>{(markdownContent && markdownContent[current - 1]) || 'No content found for this version.'}</Markdown>
      )}
      
      {!stepLoader && (
        <div className="btn-wrapper">
          <div className="left-btn">
            <Button
              onClick={() =>
                navigate(`/blog-edit/${blogId}`, {
                  state: { newBlog: true },
                })
              }
            >
              Start Editing
            </Button>

            <Dropdown
              menu={{
                items: [
                  {
                    key: 'html',
                    label: 'Download HTML',
                    icon: <CodeOutlined style={{ color: '#E34F26' }} />,
                    onClick: () => !downloadLoading && handleDownload('html'),
                    disabled: downloadLoading
                  },
                  {
                    key: 'markdown',
                    label: 'Download Markdown',
                    icon: <FileTextOutlined style={{ color: '#000000' }} />,
                    onClick: () => !downloadLoading && handleDownload('markdown'),
                    disabled: downloadLoading
                  },
                  {
                    key: 'docx',
                    label: 'Download Word',
                    icon: <FileWordOutlined style={{ color: '#2B579A' }} />,
                    onClick: () => !downloadLoading && handleDownload('docx'),
                    disabled: downloadLoading
                  }
                ]
              }}
              trigger={['click']}
              overlayClassName="download-dropdown-overlay"
              disabled={downloadLoading}
            >
              <Button loading={downloadLoading} className="download-dropdown-btn">
                Download <DownOutlined />
              </Button>
            </Dropdown>
          </div>
          <Button onClick={handleDoneClick}>Done</Button>
        </div>
      )}
    </div>
  );
};

export default MarkdownContent;
