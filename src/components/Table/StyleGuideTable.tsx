import React, { useState } from 'react';
import { Modal, Table, Tooltip } from 'antd';
import Icon from '@ant-design/icons';
import { ReactComponent as VoiceSvg } from '../../assets/icons/Property 1=iconoir_voice.svg';
import { ReactComponent as EditSvg } from '../../assets/icons/outline-edit.svg';
import { ReactComponent as DeleteSvg } from '../../assets/icons/delete.svg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DeleteConfirmationModal from '../Model/ConfirmDeleteModel';

const StyleGuideTable = ({ data, setUpdate, update }: any) => {
  const styleGuideDataSource = data;
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recordId, setRecordId] = useState(null);

  const deleteModel = (id: any) => {
    setRecordId(id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: any) => {
    try {
      const data = await axios.delete(`${process.env.REACT_APP_SERVER_URL}/style-guide?id=${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setUpdate(!update);
    } catch (error: any) {
      console.log('err', error.message);
    }
  };

  const columns = [
    {
      title: 'Style Guide Name',
      dataIndex: 'voice',
      key: 'styleGuideName',
      render: (_: any, record: any) => {
        return (
          <div className='content-wrap'>
            <Icon component={VoiceSvg} />
            {record?.name}
          </div>
        );
      }
    },
    {
      title: 'Date Created',
      dataIndex: 'createdDate',
      key: 'styleGuideCreatedDate',
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
      key: 'styleGuideLastEdited',
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
      key: 'styleGuideActionEdit',
      render: (_: any, record: any) => {
        const handleEditClick = () => {
          navigate('/create-style-guide', { state: { data: record, edit: true } });
        };

        return (
          <div className='action-wrapper' onClick={handleEditClick}>
            <Tooltip title='Edit'>
              <Icon component={EditSvg} className='edit-icon' />
            </Tooltip>
          </div>
        );
      }
    },
    {
      title: '',
      width: 45,
      key: 'styleGuideActionDelete',
      render: (_: any, record: any) => {
        return (
          <Tooltip title='Delete'>
            <Icon
              component={DeleteSvg}
              data-testid='delete-blog'
              className='delete-icon'
              onClick={() => deleteModel(record.id)}
            />
          </Tooltip>
        );
      }
    }
  ];

  return (
    <div className='table-wrapper brand-voice-table'>
      <Table sticky scroll={{ x: 800 }} dataSource={styleGuideDataSource} columns={columns} pagination={false} />
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

export default StyleGuideTable;
