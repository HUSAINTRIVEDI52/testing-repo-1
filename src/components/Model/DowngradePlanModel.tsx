import React, { useState } from 'react';
import './modal.scss';
import { Button, message, Modal } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import closeIcon from '../../assets/icons/fontisto_close.svg';
import axios from 'axios';

export default function DowngradePlanModal({
  isDowngradeModelVisible,
  setIsDowngradeModelVisible,
  priceId,
  planDetails,
  downgradePlanName
}: any) {
  const userId = localStorage.getItem('userId');

  const handleCancel = () => {
    setIsDowngradeModelVisible(false);
  };

  const handleSubmit = async () => {
    axios
      .post(
        `${process.env.REACT_APP_SERVER_URL}/downgrade-subscription`,
        {
          userId: userId,
          newPriceId: priceId
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      )
      .then((res) => {
        message.success(res.data.message).then(() => {
          window.location.reload();
        });
        setIsDowngradeModelVisible(false);
      })
      .catch((error) => {
        message.error(error?.response?.data?.message);
        setIsDowngradeModelVisible(false);
      });
  };

  return (
    <Modal
      centered
      className='keyword-model'
      open={isDowngradeModelVisible}
      onCancel={handleCancel}
      footer={null}
      closable={false}
      width={500}
    >
      <div className='delete-popup-wrapper'>
        <div className='icon-wrapper'>
          <ExclamationCircleFilled style={{ fontSize: '32px', color: '#ff6600' }} />
        </div>
        <div className='title'>
          Confirm Downgrade
        </div>
        <div className='description'>
          You will be downgraded to the <b>{downgradePlanName}</b> plan starting from your next billing cycle.
        </div>
        <div className='btn-wrapper'>
          <button onClick={handleCancel} className='cancel-btn'>
            Cancel
          </button>
          <button onClick={handleSubmit} className='delete-btn'>
            Downgrade
          </button>
        </div>
      </div>
    </Modal>
  );
}
