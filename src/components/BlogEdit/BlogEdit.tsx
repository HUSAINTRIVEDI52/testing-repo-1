import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, ConfigProvider, Spin, Tabs, Tooltip, message, Modal, Dropdown, Radio } from 'antd';
import './blog-edit.scss';
import Icon from '@ant-design/icons';
import { ReactComponent as CopySvg } from '../../assets/icons/copy.svg';
import { ReactComponent as LeftSvg } from '../../assets/icons/Property 1=iconamoon_arrow-up-2.svg';
import { DownOutlined, ExclamationCircleOutlined, DownloadOutlined, PictureOutlined } from '@ant-design/icons';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import SidebarBlog from './SidebarBlog';
import BlogContentEditor from './BlogContentEditor';
import PlagrismCheck from './PlagrismCheck';
import axios from 'axios';
import { GlobalContext } from '../../Context';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import BlogImageGeneratorModal from './BlogImageGeneratorModal';

const BlogEdit = () => {
  const turndownService = React.useMemo(() => {
    const service = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced'
    });
    service.use(gfm);
    return service;
  }, []);
  const { editorContent, setHasChanges, hasChanges }: any = useContext(GlobalContext);
  const [copyTooltip, setCopyTooltip] = useState<string>('');
  const navigate = useNavigate();
  const [copyTooltipVisible, setCopyTooltipVisible] = useState(false);
  const [blogDetails, setBlogDetails] = useState<any>();
  const [saveLoader, setSaveLoader] = useState<boolean>(false);
  const [current, setCurrent] = useState(1);
  const location = useLocation();
  const { newBlog } = location.state || {};
  const [copy, setCopy] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('markdown');
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const editorInstanceRef = useRef<any>(null);
  const blogEditLeftData = [
    {
      title: 'Title',
      description: `${blogDetails?.title}`
    },
    {
      title: 'Reference Articles & Links',
      description: `${blogDetails?.referenceLink}`
    },
    {
      title: 'Primary Keyword',
      description: blogDetails?.primaryKeyword || 'N/A'
    },
    {
      title: 'Secondary keyword',
      description: Array.isArray(blogDetails?.secondaryKeywords) 
        ? blogDetails.secondaryKeywords.join(', ') 
        : (blogDetails?.secondaryKeywords && blogDetails.secondaryKeywords !== 'null' 
            ? blogDetails.secondaryKeywords
            : 'N/A')
    },
    {
      title: 'Interlinking',
      description: blogDetails?.internalLinks || '0'
    },
    {
      title: 'Writing Style',
      description: `BrandVoice: ${blogDetails?.brandVoice || 'N/A'} , Blog Guide: ${blogDetails?.aiPersona || 'N/A'}`
    },
    {
      // Dynamic label based on language (Words vs Characters)
      title: blogDetails?.primaryMetric === 'characters' ? 'Characters (字符)' : 'Words',
      description: blogDetails?.displayValue || blogDetails?.words
    },
    {
      title: 'Your Blog Is Ready!',
      description: 'Completed'
    }
  ];
  const [blogContent, setBlogContent] = useState<any>(null); //This state is for getting blog data from database
  const { id } = useParams();

  // Reset hasChanges on mount/unmount to ensure clean state
  useEffect(() => {
    setHasChanges(false);
    return () => setHasChanges(false);
  }, []);

  //This function will get blog
  const getBlog = async () => {
    try {
      const result = await axios.post(`${process.env.REACT_APP_SERVER_URL}/blog?blogId=${id}`, '', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      if (result.status == 200) {
           //  Parse each item in the content array
      let contentArray = result?.data?.content;
      
      if (Array.isArray(contentArray)) {
        contentArray = contentArray.map(item => {
          // Each item is a JSON string, parse it
          if (typeof item === 'string') {
            try {
              return JSON.parse(item);
            } catch (e) {
              console.error('Failed to parse item:', e);
              return item;
            }
          }
          return item;
        });
      }

        const savedData = sessionStorage.getItem('editData');
        if (newBlog) {
          setBlogContent(contentArray);
          sessionStorage.setItem('editData', JSON.stringify(contentArray));
        } else if (savedData) {
          setBlogContent(JSON.parse(savedData));
        } else {
          setBlogContent(contentArray);
          sessionStorage.setItem('editData', JSON.stringify(contentArray));
        }
        setBlogDetails(result?.data);
      } else {
        message.error(result?.data?.error);
      }
    } catch (error: any) {
      message.error(error?.response?.data?.error ? error?.response?.data?.error : error?.message);
    }
  };

  const onChange = (key: string) => {
    setCurrent(Number(key));
  };

  const convertToMarkdown = () => {
    if (editorContent) {
      const markdown = turndownService.turndown(editorContent);
      return markdown;
    }
  };

  // Function to save the blog in the database
  const saveBlog = async () => {
    setSaveLoader(true);
    const content = sessionStorage.getItem('editData');
    if (!content) {
      message.error('something went wrong..');
      setSaveLoader(false);
      return;
    }
    let values = {
      content: JSON.parse(content)
    };
    try {
      const result = await axios.post(`${process.env.REACT_APP_SERVER_URL}/editblog/${id}`, values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      if (result.status == 200) {
        message.success('Blog updated successfully');
        setHasChanges(false); // Reset the changes state after successful save
      } else {
        message.error(result?.data?.error);
      }
    } catch (error: any) {
      message.error(error?.response?.data?.error ? error?.response?.data?.error : error?.message);
    }
    setSaveLoader(false);
  };

  const handleEditorCopy = () => {
    setCopy(!copy);
  };

  const handleDownload = async () => {
    // Check if there are unsaved changes
    if (hasChanges) {
      message.warning('Please save your changes before downloading.');
      return;
    }

    setDownloadLoading(true);
    setExportDropdownOpen(false); // Close dropdown after clicking download
    const hideLoading = message.loading('Download started...', 0);
    
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/download-blog`, {
        params: { id: id, format: selectedFormat },
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      const href = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = href;

      const extension = selectedFormat === 'markdown' ? 'md' : selectedFormat;
      // Sanitize title for filename
      const safeTitle = blogDetails?.title 
        ? blogDetails.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() 
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

  useEffect(() => {
    getBlog();
    document.title = 'Bloggr Ai | Blog Edit';
  }, []);

  const handleRedirect = () => {
    if (hasChanges) {
      Modal.confirm({
        title: 'You have unsaved changes!',
        content: 'Are you sure you want to leave without saving your changes?',
        okText: 'Leave',
        cancelText: 'Stay',
        okButtonProps: { className: 'custom-ok-btn' }, // Customize OK button
        onOk: () => {
          setHasChanges(false);
          if (newBlog) {
            sessionStorage.removeItem('editData');
            navigate('/createblog');
          } else {
            sessionStorage.removeItem('editData');

            navigate('/my-blog');
          }
        }
      });
    } else {
      if (newBlog) {
        sessionStorage.removeItem('editData');

        navigate('/createblog');
      } else {
        sessionStorage.removeItem('editData');

        navigate('/my-blog');
      }
    }
  };

  return (
    <div className='blog-edit-wrapper' data-testid='blog-edit-wrapper'>
      {blogContent ? (
        <>
          <div className='breadcrumbs-wrapper'>
            <div className='breadcrumbs-title'>
              <button onClick={handleRedirect} className='back'>
                <Icon component={LeftSvg} /> Back
              </button>
              <h1>{blogDetails?.title || 'Editing Blog'}</h1>
            </div>
            <div className='btn-wrapper'>
              <Tooltip title={copyTooltip} open={copyTooltipVisible} placement='bottom'>
                <Button onClick={handleEditorCopy} className='light-btn' data-testid='mit'>
                  <Icon component={CopySvg} /> Copy
                </Button>
              </Tooltip>

              <Tooltip 
                title={blogDetails?.imageGenerationCount >= 2 ? "Generation limit reached for this blog" : "Generate AI Image and insert into blog"} 
                placement='bottom'
              >
                <Button 
                  className='ai-image-btn'
                  onClick={() => setImageModalOpen(true)}
                  icon={<PictureOutlined />}
                  disabled={blogDetails?.imageGenerationCount >= 2}
                >
                  AI Image
                </Button>
              </Tooltip>
              
              <Tooltip 
                title={hasChanges ? "Please save your changes before downloading" : ""}
                placement='bottom'
              >
                <Dropdown
                  open={exportDropdownOpen}
                  onOpenChange={setExportDropdownOpen}
                  dropdownRender={() => (
                    <div className="export-dropdown-content">
                      <Radio.Group 
                        value={selectedFormat} 
                        onChange={(e) => setSelectedFormat(e.target.value)}
                        className="format-radio-group"
                      >
                        <Radio value="markdown" className="format-radio-item">
                          Markdown
                        </Radio>
                        <Radio value="html" className="format-radio-item">
                          HTML
                        </Radio>
                        <Radio value="docx" className="format-radio-item">
                          Word (.docx)
                        </Radio>
                      </Radio.Group>
                      <Button 
                        type="primary"
                        icon={<DownloadOutlined />}
                        onClick={handleDownload}
                        loading={downloadLoading}
                        className="download-btn-inside"
                        block
                      >
                        Download
                      </Button>
                    </div>
                  )}
                  trigger={['click']}
                  disabled={hasChanges}
                  overlayClassName="export-dropdown-overlay"
                >
                  <Button 
                    className="export-btn"
                    disabled={hasChanges}
                  >
                    Export <DownOutlined />
                  </Button>
                </Dropdown>
              </Tooltip>

              <Button 
                data-testid='save-button' 
                loading={saveLoader} 
                onClick={saveBlog}
                type='primary'
                disabled={!hasChanges}
              >
                {hasChanges ? 'Save Changes' : 'Save'}
              </Button>
            </div>
          </div>
          <div className='blog-content-wrapper'>
            <div className='side-blog-content'>
              <SidebarBlog data={blogEditLeftData} current={current} setBlogContent={setBlogContent} />
            </div>
            <div className='middle-blog-content'>
              <ConfigProvider
                theme={{
                  components: {
                    Tabs: {
                      cardBg: '#f1f4f8',
                      cardGutter: 5,
                      itemColor: '#000',
                      itemHoverColor: '#000',
                      colorBorderSecondary: '#f1f4f8',
                      titleFontSize: 18
                    }
                  }
                }}
              >
                <Tabs
                  onChange={onChange}
                  type='card'
                  items={new Array(blogContent.length).fill(null).map((_, i) => ({
                    label: `Version ${i + 1}`,
                    key: `${i + 1}`
                  }))}
                  style={{ width: '100%' }}
                />
              </ConfigProvider>
              <BlogContentEditor
                blogContent={blogContent}
                current={current}
                setHasChanges={setHasChanges}
                setCopy={setCopy}
                copy={copy}
                onEditorReady={(editor: any) => { editorInstanceRef.current = editor; }}
              />
            </div>
            <div className='right-blog-content'>
              <PlagrismCheck blogId={id} content={blogContent} current={current} blogDetails={blogDetails} />
            </div>
          </div>
        </>
      ) : (
        <Spin />
      )}

      {/* AI Image Generator Modal */}
      <BlogImageGeneratorModal
        open={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        blogTitle={blogDetails?.title}
        blogId={id}
        imageGenerationCount={blogDetails?.imageGenerationCount || 0}
        onGenerationSuccess={(newCount) => {
          setBlogDetails((prev: any) => ({ ...prev, imageGenerationCount: newCount }));
        }}
        onInsert={(imageUrl: string) => {
          if (editorInstanceRef.current) {
            editorInstanceRef.current.insertContent(
              `<p><img src="${imageUrl}" alt="AI Generated Image" style="max-width: 100%; height: auto;" /></p>`
            );
            setHasChanges(true);
            message.success('Image inserted into blog!');
          }
        }}
      />
    </div>
  );
};

export default BlogEdit;
