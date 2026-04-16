import React, { useContext, useState } from 'react';
import { Table, Tooltip, message, Modal } from 'antd';
import './table.scss';
import Icon from '@ant-design/icons';
import { ReactComponent as BlogSvg } from '../../assets/icons/blogsvg.svg';
import { ReactComponent as DeleteSvg } from '../../assets/icons/delete.svg';
import { ReactComponent as EditSvg } from '../../assets/icons/outline-edit.svg';
import { ReactComponent as Dot } from '../../assets/icons/dot.svg';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { GlobalContext } from '../../Context';
import DeleteConfirmationModal from '../Model/ConfirmDeleteModel';
import { addUniqueIds } from '../../utils/CommonFunction';


const BlogTable = ({ blogData, fetchBlogData }: any) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recordId, setRecordId] = useState(null);

  const deleteModel = (id: any) => {
    setRecordId(id);
    setIsModalOpen(true);
  };
  const {
    setStep4Data,
    setStep1Data,
    setParsona,
    setBrandVoice,
    setStep3Data,
    step3Data,
    setDraftId,
    setCurrentScreen,
    setStep2Data,
    setRegenerate,
    setVisited,
    setSelectedBrandVoice,
    setSelectedBlogGuide,
    setCategories,
    setDraftData  // Added to sync full draft data including outlineRegeneratedCount
  }: any = useContext(GlobalContext);

  const handleEdit = (record: any) => {
    console.log(record.visitedstep);
    localStorage.setItem('blog-mode', 'edit');
    if (record.type == 'blog') {
      sessionStorage.removeItem('editData');

      navigate(`/blog-edit/${record?.id}`);
    } else {
      // Set full draft data to Context (includes outlineRegeneratedCount from DB)
      setDraftData({
        id: record.id,
        userId: record.userId,
        topic: record.topic,
        title: record.title,
        primaryKeyword: record.primaryKeyword,
        location: record.location,
        secondaryKeywords: record.secondaryKeywords,
        brandVoice: record.brandVoice,
        aiPersona: record.aiPersona,
        internalLinks: record.internalLinks,
        referencedata: record.referencedata,
        outline: record.outline,
        visitedstep: record.visitedstep,
        outlineRegeneratedCount: record.outlineRegeneratedCount || 0  // KEY: Sync from DB
      });
      
      setStep1Data((prevData: any) => ({
        ...prevData,
        topic: record.topic,
        title: record.title,
        selectedLocation: record.location,
        primaryKeyword: record.primaryKeyword,
        // Restore generation flags
        hasGeneratedTitle: record.hasGeneratedTitle || false,
        hasGeneratedPrimaryKeywords: record.hasGeneratedPrimaryKeywords || false
      }));
      setParsona(record.aiPersona);
      setBrandVoice(record.brandVoice);
      setStep4Data({ links: record.internalLinks ? record.internalLinks : [] });
      setStep3Data({ 
        ...step3Data, 
        secondaryKeywords: record.secondaryKeywords,
        // Restore generation flags
        hasGeneratedSecondaryKeywords: record.hasGeneratedSecondaryKeywords || false
      });
      setDraftId(record.id);
      setRegenerate(false);
      setCurrentScreen(record.visitedstep);
      setStep2Data(record.referencedata && record.referencedata.length > 0 ? record.referencedata[0] : { scrappedUrl: [], files: [] });
      setVisited(record.visitedstep);
      navigate(`/createblog`);
      setSelectedBlogGuide(record.aiPersona);
      setSelectedBrandVoice(record.brandVoice);
      if (record.outline) {
        try {
          setCategories(addUniqueIds(JSON.parse(record.outline)));
        } catch (e) {
          console.error('Failed to parse outline:', e);
          setCategories([]);
        }
      } else {
        setCategories([]);
      }
    }
  };

  const columns = [
    {
      title: 'Blog Title',
      dataIndex: 'title',
      key: 'title',
      render: (_: any, record: any) => {
        return (
          <div className='content-wrap'>
            <Icon component={BlogSvg} />{' '}
            <span className='title' onClick={() => handleEdit(record)} style={{ cursor: 'pointer' }}>
              {record?.title}
            </span>
          </div>
        );
      }
    },
    {
      title: 'Status',
      dataIndex: 'type',
      key: 'type',
      width: 100,

      render: (_: any, record: any) => {
        {
          return (
            <div className='content-wrap'>
              {record.type == 'draft' && (
                <span className='title'>
                  Draft
                </span>
              )}
            </div>
          );
        }
      }
    },
    {
      title: 'Date Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (_: any, record: any) => {
        const dateObj = new Date(record.createdAt);
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = dateObj.toLocaleString('en-US', { month: 'short' });
        const year = dateObj.getFullYear();
        const dateString = `${day} ${month} ${year}`;
        return (
          <div className='content-wrap'>
            <span>{dateString}</span>
          </div>
        );
      }
    },
    {
      title: 'Last Edited',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 160,
      render: (_: any, record: any) => {
        const dateObj = new Date(record.updatedAt);
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = dateObj.toLocaleString('en-US', { month: 'short' });
        const year = dateObj.getFullYear();
        const dateString = `${day} ${month} ${year}`;
        return (
          <div className='content-wrap'>
            <span>{dateString}</span>
          </div>
        );
      }
    },
    {
      title: '',
      width: 45,
      render: (_: any, record: any) => {
        return (
          <div className='table-action'>
            <Tooltip title='Edit'>
              <Icon
                component={EditSvg}
                className='edit-icon'
                onClick={() => handleEdit(record)}
              />
            </Tooltip>
          </div>
        );
      }
    },

    {
      title: '',
      width: 45,
      render: (_: any, record: any) => {
        return (
          <div className='table-action'>
            <Tooltip title='Delete'>
              <Icon
                component={DeleteSvg}
                data-testid='delete-blog'
                className='delete-icon'
                onClick={() => deleteModel(record)}
              />
            </Tooltip>
          </div>
        );
      }
    }
  ];
  //This function is for deleting blog
  const handleDelete = async (record: any) => {
    try {
      let result;
      if (record.type == 'blog') {
        result = await axios.post(`${process.env.REACT_APP_SERVER_URL}/deleteblog?id=${record?.id}`, '', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
      } else {
        result = await axios.post(`${process.env.REACT_APP_SERVER_URL}/delete-draft?id=${record?.id}`, '', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
      }
      if (result.status === 200) {
        message.success(result?.data?.message);
        fetchBlogData();
      } else {
        message.error(result?.data?.error);
      }
    } catch (error: any) {
      message.error(error?.response?.data?.error ? error?.response?.data?.error : error?.message);
    }
  };

  return (
    <div className='table-wrapper table-blog'>
      <Table
        sticky
        scroll={{ x: 750, y: window.innerWidth < 1441 ? 'calc(100vh - 240px)' : 'calc(100vh - 270px)' }}
        dataSource={blogData}
        columns={columns}
        pagination={false}
        rowKey={(record) => record.key}
      />
      <Modal
        centered
        className='keyword-model'
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        closable={false}
      >
        <DeleteConfirmationModal
          setIsModalOpen={setIsModalOpen}
          handleDelete={handleDelete}
          recordId={recordId}
        />
      </Modal>
    </div>
  );
};

export default BlogTable;
