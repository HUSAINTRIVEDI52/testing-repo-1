import React, { useEffect, useState } from 'react';
import './brand-voice.scss';
import { Button } from 'antd';
import SideTitleInfo from '../SideTitleInfo/SideTitleInfo';
import BrandVoiceForm from './BrandVoiceForm';
import AnalyseContent from './AnalyseContent';
import BrandVoiceTable from '../Table/BrandVoiceTable';
import axios from 'axios';

import CreateBrandVoiceModal from './CreateBrandVoiceModal';

const BrandVoice = () => {
  const userId = localStorage.getItem('userId');
  const [data, setData] = useState([]);
  const [update, setUpdate] = useState<boolean>(true);
  const [edit, setEdit] = useState<boolean>(false);
  const [analyse, setAnalyse] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [brandVoice, setBrandVoice] = useState('');
  const [editBrandVoice, setEditBrandVoice] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [formData, setFormData] = useState({});
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  useEffect(() => {
    getBrandVoice();
  }, [update]);
  const createBrandVoice = async () => {
    setIsCreateModalVisible(true);
  };
  const getBrandVoice = async () => {
    try {
      const data = await axios.get(`${process.env.REACT_APP_SERVER_URL}/brand-voice?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setData(data.data);
    } catch (error: any) {
      console.log('err', error.message);
    }
  };
  const backEvent = async () => {
    setIsEditMode(false);
    setAnalyse(false);
    setEdit(false);
    setBrandVoice('');
  };

  return (
    <div className='side-content-wrapper'>
      <SideTitleInfo
        title='Brand Voice'
        subTitle='Bloggr can learn and emulate your unique writing style from your blog posts, texts, or documents, ensuring a consistent brand voice in every piece of content.'
      >
        {/* Here btn will be conditionally */}
        {!edit && (
          <div className='btn-wrapper'>
            <Button onClick={createBrandVoice}>Create</Button>
          </div>
        )}
        {/* {edit && (
          <div className='btn-wrapper'>
            <Button onClick={backEvent}>Back</Button>
          </div>
        )} */}
      </SideTitleInfo>

      {/* Here table will be conditionally between BrandVoiceTable and (BrandVoiceForm and AnalyseContent) */}
      {!edit && (
        <div className='brand-voice-table-wrapper'>
          <BrandVoiceTable
            data={data}
            setUpdate={setUpdate}
            update={update}
            setEdit={setEdit}
            setSelectedRecord={setSelectedRecord}
            setIsEditMode={setIsEditMode}
            setEditBrandVoice={setEditBrandVoice}
          />
        </div>
      )}
      <div className='brand-voice-wrapper'>
        {edit && !isEditMode && (
          <div className='form-wrap'>
            <BrandVoiceForm
              setAnalyse={setAnalyse}
              setLoader={setLoader}
              setBrandVoice={setBrandVoice}
              setUpdate={setUpdate}
              loader={loader}
              update={update}
              selectedRecord={selectedRecord}
              setSelectedRecord={setSelectedRecord}
              setFormData={setFormData}
              setIsEditMode={setIsEditMode}
              backEvent={backEvent}
            />
          </div>
        )}

        {edit && isEditMode && (
          <div className='analyse-wrapper'>
            <AnalyseContent
              setAnalyse={setAnalyse}
              setUpdate={setUpdate}
              update={update}
              setEdit={setEdit}
              analyse={analyse}
              brandVoice={brandVoice}
              formData={formData}
              selectedRecord={selectedRecord}
              setBrandVoice={setBrandVoice}
              isEditMode={isEditMode}
              setIsEditMode={setIsEditMode}
              edit={edit}
              setEditBrandVoice={setEditBrandVoice}
              editBrandVoice={editBrandVoice}
            />
          </div>
        )}
      </div>
      <CreateBrandVoiceModal
        visible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        setAnalyse={setAnalyse}
        setLoader={setLoader}
        setBrandVoice={setBrandVoice}
        setUpdate={setUpdate}
        update={update}
        setIsEditMode={setIsEditMode}
        setEdit={setEdit}
        setFormData={setFormData}
      />
    </div>
  );
};

export default BrandVoice;
