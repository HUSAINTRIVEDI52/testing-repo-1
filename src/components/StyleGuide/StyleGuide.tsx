import React, { useEffect, useState } from 'react';
import SideTitleInfo from '../SideTitleInfo/SideTitleInfo';
import { Button } from 'antd';
import StyleGuideTable from '../Table/StyleGuideTable';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StyleGuide = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const userId = localStorage.getItem('userId');
  const [update, setUpdate] = useState<boolean>(true);

  const getStyleGuide = async () => {
    try {
      const data = await axios.get(`${process.env.REACT_APP_SERVER_URL}/style-guide?userId=${userId}`, {
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
    getStyleGuide();
  }, [update]);
  return (
    <div className='side-content-wrapper'>
      <SideTitleInfo
        title='Style Guide'
        subTitle='Bloggr can learn and emulate your unique writing style from your blog posts, texts, or documents, ensuring a consistent brand voice in every piece of content.'
      >
        <div className='btn-wrapper'>
          <Button onClick={() => navigate('/create-style-guide', { state: { edit: false } })}>Create New Style</Button>
        </div>
      </SideTitleInfo>
      <div className='style-guide-wrapper'>
        <StyleGuideTable data={data} setUpdate={setUpdate} update={update} />
      </div>
    </div>
  );
};

export default StyleGuide;
