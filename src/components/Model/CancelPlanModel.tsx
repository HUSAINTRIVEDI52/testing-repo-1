import { Button, Checkbox, Form, Input, message, Modal, Select } from 'antd';
import React, { useState } from 'react';
import closeIcon from '../../assets/icons/fontisto_close.svg';
import axios from 'axios';
import { set } from 'date-fns';

function CancelPlanModel({ isModalVisible, setIsModalVisible, username }: any) {
  const [form] = Form.useForm();
  const handleCloseModal = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  /// check if other is selected
  const [otherSelected, setOtherSelected] = useState(false);

  const userId = localStorage.getItem('userId');

  /// handle the cancel plan form submit
  const handleSubmit = (values: any) => {
    setLoading(true);

    /// prepare comment based on the selected reason
    const feedback = values.feedback ? values.feedback : 'N/A';
    const comment =
      values.cancellationReason === 'other'
        ? `Reason : ${values.otherReason} \n Feedback : ${feedback}`
        : `Feedback : ${feedback}`;

    axios
      .post(
        `${process.env.REACT_APP_SERVER_URL}/cancel-subscription`,
        {
          userId,
          cancelReason: {
            feedback: values.cancellationReason,
            comment: comment
          }
        },

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      )
      .then((res) => {
        message.success('Plan cancelled successfully');
        window.location.reload();
      })
      .catch((error) => {
        message.error('Unable to cancel plan. Please, try again later.');
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const onChange = async () => {
    setIsChecked(!isChecked);
  };

  return (
    <Modal
      title={null}
      visible={isModalVisible}
      footer={null}
      maskClosable={false}
      closeIcon={<img src={closeIcon} alt='closeIcon' onClick={handleCloseModal} className='img-cancel' />}
    >
      <div className='modal-header'>
        <h2>We’re Sorry to See You Go 😢</h2>
        <h3>Hi {username},</h3>
        <p>
          We appreciate your time with us and would love to understand why you're canceling. Your feedback helps us
          improve! 💡
        </p>
      </div>

      <Form form={form} layout='vertical' onFinish={handleSubmit}>
        <Form.Item
          label={<strong>Reason for Cancellation 📌</strong>}
          name='cancellationReason'
          rules={[{ required: true, message: 'Please select a reason ❗' }]}
        >
          <Select
            onChange={(value) => setOtherSelected(value === 'other')}
            listHeight={200}
            popupMatchSelectWidth={false}
            dropdownStyle={{ padding: '10px 0 10px 10px' }}
          >
            <Select.Option value='too_expensive'>Too expensive 💰</Select.Option>
            <Select.Option value='missing_features'>Missing features ❌</Select.Option>
            <Select.Option value='switched_service'>Switched to another service 🔄</Select.Option>
            <Select.Option value='unused'>Didn't use it enough ⏳</Select.Option>
            <Select.Option value='customer_service'>Issues with customer service 📞</Select.Option>
            <Select.Option value='too_complex'>Too complex 🤯</Select.Option>
            <Select.Option value='low_quality'>Low quality ⚠️</Select.Option>
            <Select.Option value='other'>Other (please specify) ✍️</Select.Option>
          </Select>
        </Form.Item>

        {otherSelected && (
          <Form.Item
            label={<strong>Please specify 📝</strong>}
            name='otherReason'
            rules={[{ required: true, message: 'Please specify your reason!' }]}
          >
            <Input placeholder='Enter your reason here...' />
          </Form.Item>
        )}

        <Form.Item label={<strong>Additional Feedback (Optional) 💬</strong>} name='feedback'>
          <Input.TextArea placeholder='Tell us how we can improve...' rows={4} />
        </Form.Item>

        <Form.Item
          name='confirmDowngrade'
          valuePropName='checked'
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(new Error('Please confirm that you want to cancel your plan!'))
            }
          ]}
        >
          <Checkbox checked={isChecked} onChange={onChange}>
            I confirm that I want to cancel my plan
          </Checkbox>
        </Form.Item>

        <Form.Item style={{ display: 'flex', justifyContent: 'start' }}>
          <Button
            type='primary'
            htmlType='submit'
            className='submit-button'
            style={{ width: 'fit-content' }}
            loading={loading}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default CancelPlanModel;
