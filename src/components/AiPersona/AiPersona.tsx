import React, { useEffect, useState } from 'react';
import SideTitleInfo from '../SideTitleInfo/SideTitleInfo';
import { Button, Modal } from 'antd';
import AiPersonaTable from '../Table/AiPersonaTable';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreateAiPersona from '../CreateAiPersona/CreateAiPersona';

const AiPersona = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const [data, setData] = useState([]);
  const [update, setUpdate] = useState<boolean>(true);
  const [edit, setEdit] = useState<boolean>(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [editBlogGuide, setEditBlogGuide] = useState(false);

  const [selectedData, setSelectedData] = useState<any>(null);

  const getAiPersona = async () => {
    try {
      const data = await axios.get(`${process.env.REACT_APP_SERVER_URL}/ai-persona?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setData(data.data);
    } catch (error: any) {
      console.log('err', error.message);
    }
  };
  useEffect(() => {
    getAiPersona();
  }, [update]);
  return (
    <div className='side-content-wrapper'>
      <SideTitleInfo
        title='Blog Guidelines'
        subTitle='Bloggr crafts content that aligns with your guidelines, ensuring every post meets your standards for tone, structure, and quality.'
      >
        {!edit && (
          <div className='btn-wrapper'>
            <Button onClick={() => setIsCreateModalVisible(true)}>Create</Button>
          </div>
        )}
      </SideTitleInfo>
      {!edit && (
        <div className='ai-persona-wrapper'>
          <AiPersonaTable
            data={data}
            setUpdate={setUpdate}
            update={update}
            setEdit={setEdit}
            setSelectedData={setSelectedData}
            setEditBlogGuide={setEditBlogGuide}
          />
        </div>
      )}
      {edit && (
        <CreateAiPersona
          setSelectedData={setSelectedData}
          setEdit={setEdit}
          selectedData={selectedData}
          setUpdate={setUpdate}
          update={update}
          setEditBlogGuide={setEditBlogGuide}
          editBlogGuide={editBlogGuide}
        />
      )}
      <Modal
        title="Add Blog Guideline"
        open={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        footer={null}
        width={800}
      >
        <CreateAiPersona
          setEdit={setIsCreateModalVisible}
          setSelectedData={setSelectedData}
          selectedData={null}
          setUpdate={setUpdate}
          update={update}
          setEditBlogGuide={() => { }}
          editBlogGuide={false}
        />
      </Modal>
    </div>
  );
};

export default AiPersona;
