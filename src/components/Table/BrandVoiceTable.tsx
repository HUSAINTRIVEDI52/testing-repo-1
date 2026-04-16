import React, { useState } from 'react';
import { Table, Tooltip, Modal } from 'antd';
import Icon from '@ant-design/icons';
import { ReactComponent as VoiceSvg } from '../../assets/icons/Property 1=iconoir_voice.svg';
import { ReactComponent as EditSvg } from '../../assets/icons/outline-edit.svg';
import { ReactComponent as DeleteSvg } from '../../assets/icons/delete.svg';
import axios from 'axios';
import './table.scss';
import DeleteConfirmationModal from '../Model/ConfirmDeleteModel';

const BrandVoiceTable = ({
  data,
  setUpdate,
  update,
  setEdit,
  setSelectedRecord,
  setIsEditMode,
  setEditBrandVoice
}: any) => {

  const brandVoiceDataSource = data;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recordId, setRecordId] = useState(null);

  const deleteModel = (id: any) => {
    setRecordId(id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const data = await axios.delete(`${process.env.REACT_APP_SERVER_URL}/brand-voice?id=${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setUpdate(!update);
    } catch (error: any) {
      console.log('err', error.message);
    }
  };
  const handleEditClick = (record: any) => {
    setIsEditMode(true);
    setSelectedRecord(record); // Pass the selected record to the parent component
    setEdit(true); // Switch to the edit mode
    setEditBrandVoice(true);
  };



  const columns = [
    {
      title: 'Brand Voice',
      dataIndex: 'voice',
      key: 'brandVoiceName',
      render: (_: any, record: any) => {
        return (
          <div className='content-wrap'>
            <Icon component={VoiceSvg} />
            <span
              className='title'
              onClick={() => handleEditClick(record)}
              style={{ cursor: 'pointer', marginLeft: '8px' }}
            >
              {record?.name}
            </span>
          </div>
        );
      }
    },
    {
      title: 'Date Created',
      dataIndex: 'createdDate',
      key: 'brandVoiceCreatedDate',
      width: 160,
      render: (_: any, record: any) => {
        const dateObj = new Date(record.createdAt);
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = dateObj.toLocaleString('en-US', { month: 'short' });
        const year = dateObj.getFullYear();
        const dateString = `${day} ${month} ${year}`;
        return <div className='content-wrap'>{dateString}</div>;
      }
    },
    {
      title: 'Last Edited',
      dataIndex: 'lastEdited',
      key: 'brandVoiceLastEdited',
      width: 160,
      render: (_: any, record: any) => {
        const dateObj = new Date(record.updatedAt || record.createdAt);
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = dateObj.toLocaleString('en-US', { month: 'short' });
        const year = dateObj.getFullYear();
        const dateString = `${day} ${month} ${year}`;
        return <div className='content-wrap'>{dateString}</div>;
      }
    },
    {
      title: '',
      width: 45,
      key: 'brandVoiceActionEdit',
      render: (_: any, record: any) => {
        return (
          <div className='action-wrapper'>
            <Tooltip title='Edit'>
              <Icon component={EditSvg} className='edit-icon' onClick={() => handleEditClick(record)} />
            </Tooltip>
          </div>
        );
      }
    },
    {
      title: '',
      width: 45,
      key: 'brandVoiceActionDelete',
      render: (_: any, record: any) => {
        return (
          <div className='action-wrapper'>
            <Tooltip title='Delete'>
              <Icon component={DeleteSvg} data-testid='delete-blog' className='delete-icon' onClick={() => deleteModel(record.id)} />
            </Tooltip>
          </div>
        );
      }
    }
  ];

  return (
    <div className='table-wrapper brand-voice-table'>
      <Table
        sticky
        scroll={{ x: 800, y: window.innerWidth < 1441 ? 'calc(100vh - 240px)' : 'calc(100vh - 270px)' }}
        dataSource={brandVoiceDataSource}
        columns={columns}
        pagination={false}
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

export default BrandVoiceTable;
