import React, { useContext, useState } from 'react';
import MarkdownContent from './MarkdownContent';
import Icon from '@ant-design/icons';
import { GlobalContext } from '../../Context';
import { ConfigProvider, Modal } from 'antd';
import RegeneratePhasedModal from './Modal/regenertatePhaseModel';
import closeIcon from '../../assets/icons/fontisto_close.svg';
import { Tabs } from 'antd';

const BlogReady = () => {
  const onChange = (key: string) => {
    setCurrent(Number(key));
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [current, setCurrent] = useState(1);
  const { setCurrentScreen, setRegenerate, blogContent }: any = useContext(GlobalContext);

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Tabs: {
              cardBg: '#fff',
              cardGutter: 5,
              titleFontSize: 18,
              itemColor: '#9D9D9D'
            }
          }
        }}
      >
        <Tabs
          onChange={onChange}
          type='card'
          items={new Array(blogContent?.length || 0).fill(null).map((_, i) => ({
            label: `Version ${i + 1}`,
            key: `${i + 1}`
          }))}
          style={{ width: '100%' }}
        />
      </ConfigProvider>
      <div className='title-container'>
        <div className='blog-title'>
          <div className='blog-container'>
            <h1 className='title'>Your blog!</h1>
            <p>define the topic to tailor your content for maximum impact</p>
          </div>
        </div>
        <MarkdownContent setIsModalOpen={setIsModalOpen} current={current} />
        <Modal
          centered
          className='keyword-model'
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
          closeIcon={
            <img src={closeIcon} alt='closeIcon' onClick={() => setIsModalOpen(false)} className='img-cancle' />
          }
        >
          <RegeneratePhasedModal setCurrentScreen={setCurrentScreen} setRegenerate={setRegenerate} />
        </Modal>
      </div>
    </>
  );
};

export default BlogReady;
