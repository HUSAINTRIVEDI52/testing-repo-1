import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Input, Select, Spin, message, Skeleton } from 'antd';
import './my-blog.scss';
import BlogTable from '../Table/BlogTable';
import { ReactComponent as SearchSvg } from '../../assets/icons/search.svg';
import Icon from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../Context';

const { Option } = Select;

const MyBlog = () => {
  const {
    setStep4Data,
    setStep2Data,
    setStep1Data,
    setParsona,
    setBrandVoice,
    setStep3Data,
    step3Data,
    setDraftId,
    setCurrentScreen,
    setRegenerate,
    setVisited,
    userLanguage,
    setSelectedLanguage,
    userModel,
    setSelectedModel,
    setDraftData  // Added to reset draft data for new blogs
  }: any = useContext(GlobalContext);

  const [blogData, setBlogData] = useState<any[]>([]);
  const [draft, setDraft] = useState<any[]>([]);
  const [mergedData, setMergedData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [filterType, setFilterType] = useState<string>('all'); // all, blog, draft

  const userId = localStorage.getItem('userId');
  const [searchTitle, setSearchTitle] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const [remBlog, setRemBlog] = useState<number>();
  const [blogLoader, setBlogLoader] = useState<boolean>(false);

  const handleClickOutside = (event: MouseEvent) => {
    if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
      setIsExpanded(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setSearchTitle(searchValue);
    filterData(filterType, searchValue);
  };

  const filterData = (type: string, searchValue: string) => {
    let filtered = mergedData;

    if (type === 'blog') {
      filtered = mergedData.filter((item) => item.type === 'blog');
    } else if (type === 'draft') {
      filtered = mergedData.filter((item) => item.type === 'draft');
    }

    if (searchValue) {
      filtered = filtered.filter((item) => item?.title?.toLowerCase().includes(searchValue.toLowerCase()));
    }

    setFilteredData(filtered);
  };

  const handleFilterChange = (value: string) => {
    setFilterType(value);
    filterData(value, searchTitle);
  };

  const fetchBlogData = async () => {
    setBlogLoader(true);
    const userId = localStorage.getItem('userId');
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/allblogs?id=${userId}`, '', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (response.status === 200) {
        const blogs = response.data.blogs.map((b: any) => ({
          ...b,
          type: 'blog'
        }));
        const drafts = response.data.drafts.map((d: any) => ({
          ...d,
          type: 'draft'
        }));

        const merged = [...drafts, ...blogs];
        setBlogData(blogs);
        setDraft(drafts);
        setMergedData(merged);
        setFilteredData(merged);
      } else {
        message.error(response?.data?.error || 'Error fetching blogs');
      }
    } catch (error: any) {
      message.error(error?.response?.data?.error || error?.message);
    }
    setBlogLoader(false);
  };

  useEffect(() => {
    fetchBlogData();
    // Fetch remaining blog count for Create button
    axios.get(`${process.env.REACT_APP_SERVER_URL}/usage?userId=${userId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    }).then((res) => {
      setRemBlog((res.data?.blogLimit || 0) - (res.data?.blogCreated || 0));
    }).catch(console.error);
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className='my-blog-wrapper'>
      <div className='blog-header'>
        <h1>My Blogs</h1>
        <div className={`search ${isExpanded ? 'expanded' : ''}`} ref={searchRef} onClick={() => setIsExpanded(true)}>
          <Input
            prefix={<Icon component={SearchSvg} />}
            placeholder={isExpanded ? 'Search Blog...' : ''}
            value={searchTitle}
            onChange={handleSearchChange}
            className='search-input'
          />
        </div>
        <Select value={filterType} onChange={handleFilterChange} style={{ width: 120, marginLeft: '10px' }}>
          <Option value='all'>All</Option>
          <Option value='blog'>Blogs</Option>
          <Option value='draft'>Drafts</Option>
        </Select>
        <Button
          disabled={remBlog === 0}
          className='create-btn'
          onClick={() => {
            localStorage.setItem('blog-mode', 'create');
            
            // Reset all draft data for new blog (KEY: outlineRegeneratedCount starts at 0)
            setDraftData({
              id: '',
              userId: userId,
              topic: '',
              title: '',
              primaryKeyword: '',
              location: null,
              secondaryKeywords: [],
              brandVoice: null,
              aiPersona: null,
              internalLinks: [],
              referencedata: [],
              outline: '',
              visitedstep: 0,
              outlineRegeneratedCount: 0  // KEY: Initialize to 0 for new blogs
            });
            
            setStep1Data({
              topic: '',
              selectedLocation: null,
              primaryKeyword: '',
              title: ''
            });
            setStep2Data({ scrappedUrl: [], files: [] });
            setStep3Data({ ...step3Data, secondaryKeywords: [] });
            setStep4Data({ links: [] });
            setBrandVoice([]);
            setParsona([]);
            setCurrentScreen(1);
            setDraftId('');
            setRegenerate(false);
            setVisited(0);
            setSelectedLanguage(userLanguage);
            setSelectedModel(userModel);
            navigate('/createblog');
          }}
        >
          Create
        </Button>
      </div>
      {blogLoader ? (
        <div style={{ padding: '20px', background: '#fff', borderRadius: '8px' }}>
          {/* Table Header Skeleton */}
          <div style={{ display: 'flex', marginBottom: '20px', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>
            <Skeleton.Input active style={{ width: '200px', height: '24px', marginRight: '20px' }} />
            <Skeleton.Input active style={{ width: '150px', height: '24px', marginRight: '20px' }} />
            <Skeleton.Input active style={{ width: '150px', height: '24px', marginRight: '20px' }} />
            <Skeleton.Input active style={{ width: '100px', height: '24px' }} />
          </div>
          
          {/* Table Rows Skeleton */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={{ display: 'flex', marginBottom: '16px', borderBottom: '1px solid #f0f0f0', paddingBottom: '16px' }}>
              <Skeleton.Input active style={{ width: '200px', height: '20px', marginRight: '20px' }} />
              <Skeleton.Input active style={{ width: '150px', height: '20px', marginRight: '20px' }} />
              <Skeleton.Input active style={{ width: '150px', height: '20px', marginRight: '20px' }} />
              <Skeleton.Input active style={{ width: '100px', height: '20px' }} />
            </div>
          ))}
        </div>
      ) : (
        <BlogTable blogData={filteredData} fetchBlogData={fetchBlogData} />
      )}
    </div>
  );
};

export default MyBlog;
