import React, { useContext, useEffect, useState } from 'react';
import { Button, Checkbox, Form, Input, Modal, Spin, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import closeIcon from '../../assets/icons/fontisto_close.svg';
import SignOutConfirmationModal from '../Model/SignOutConfirmationModal';

import { GlobalContext } from '../../Context';
import validateField from '../../utils/ValidateInput';

const Profile = () => {
  const userId = localStorage.getItem('userId');
  const [userDetail, setUserDetail] = useState({
    name: '',
    email: '',
    photo: ''
  });
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const { setUserName, userName }: any = useContext(GlobalContext);
  const [isChanged, setIsChanged] = useState(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [isSignOutModel, setIsSignOutModel] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const onFinish = (value: any) => {
    const data = new FormData();
    setUserName(value.fullname.trim());
    setIsChanged(false);
    data.append('name', value.fullname.trim());

    axios
      .put(`${process.env.REACT_APP_SERVER_URL}/updateuser?userId=${userId}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      .then((res) => {
        if (res.status == 200) {
          message.success({ content: 'Profile updated successfully', key: 'profile-success' });
        } else {
          message.error(res?.data?.error);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleCancel = async () => {
    setIsSignOutModel(false);
  };

  useEffect(() => {
    setLoader(true);
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/getuser?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      .then((res) => {
        setUserDetail({
          ...userDetail,
          name: res.data.name,
          email: res.data.email,
          photo: res?.data?.photo ? `${process.env.REACT_APP_SERVER_URL}/${res.data.photo}` : ''
        });

        setLoader(false);
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });
  }, []);

  const handleButtonClick = () => {
    setVisible(!visible);
  };
  const onChange = async () => {
    setIsChecked(!isChecked);
  };



  const handleSignOut = () => {
    handleButtonClick();
    localStorage.clear();
    window.location.reload();
    navigate('/login');
  };

  return (
    <div className='profile-wrapper'>
      {!loader ? (
        <>
          <Form
            form={form}
            onFinish={onFinish}
            className='profile-wrapper'
            layout='vertical'
            fields={[
              {
                name: 'fullname',
                value: userDetail.name
              }
            ]}
          >
            <div className='label-title'>Profile</div>
            <div className='right'>
              <Form.Item
                label='Full Name'
                name='fullname'
                rules={[
                  {
                    required: true,
                    validator: validateField('fullname', form, 'Full Name')
                  }
                ]}
              >
                <Input
                  defaultValue={userDetail.name ? userDetail.name : ''}
                  placeholder='Full Name'
                  onChange={(e) => {
                    const trimmedIncoming = e.target.value.trim();
                    setUserDetail({
                      ...userDetail,
                      name: e.target.value
                    });
                    setIsChanged(trimmedIncoming != userName);
                  }}
                />
              </Form.Item>
              <Form.Item className='btn-wrapper'>
                <Button htmlType='submit' data-testid='update' disabled={!isChanged}>
                  Update
                </Button>
              </Form.Item>
            </div>
          </Form>

          {/*----------------------------------------------- email ---------------------------------------------- */}
          <Form
            className='email-wrapper'
            form={form1}
            layout='vertical'
            fields={[
              {
                name: 'email',
                value: userDetail.email
              }
            ]}
          >
            <div className='label-title'>Email</div>
            {/* <Form.Item name='email' required>
              <Input
                type='email'
                defaultValue={userDetail.email ? userDetail.email : ''}
                readOnly
                placeholder='Enter email address'
              />
            </Form.Item> */}
            <span style={{ fontSize: '16px' }}>{userDetail.email ? userDetail.email : ''}</span>
          </Form>
          <button
            className='sign-out-btn'
            onClick={() => {
              // handleButtonClick();
              // localStorage.clear();
              // window.location.reload();
              // navigate('/login');
              setIsSignOutModel(true);
            }}
          >
            Sign Out
          </button>
          <Modal
            centered
            className='keyword-model'
            open={isSignOutModel}
            onCancel={() => {
              setIsSignOutModel(false);
            }}
            footer={null}
            closable={false}
          >
            <SignOutConfirmationModal
              setIsModalOpen={setIsSignOutModel}
              handleSignOut={handleSignOut}
            />
          </Modal>
        </>
      ) : (
        <Spin size='large' />
      )}
    </div>
  );
};

export default Profile;
