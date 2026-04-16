import React, { useContext, useEffect } from 'react';
import { Tabs, TabsProps } from 'antd';
import './account.scss';
import Profile from './Profile';
import Usage from './Usage';
import Invoice from './Invoice';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GlobalContext } from '../../Context';
import BillingInfo from './BillingInfo';
import PlanBills from './PlanBills';

const Account = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem('userId');

  const { usage, setUsage }: any = useContext(GlobalContext);

  const getTabKeyFromLocation = () => {
    // Get the tab key from the URL
    const params = new URLSearchParams(location.search);
    return params.get('tab') ?? '1';
  };

  const onChange = (key: string) => {
    // Set the tab key in the URL
    navigate(`?tab=${key}`);
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Profile',
      children: <Profile />
    },
    {
      key: '2',
      label: 'Plan Overview',
      children: <PlanBills />
    },
    {
      key: '3',
      label: 'Billing Info',
      children: <BillingInfo />
    },
    {
      key: '4',
      label: 'Usage',
      children: <Usage />
    },
    {
      key: '5',
      label: 'Invoice',
      children: <Invoice />
    }
  ];
  const getUsage = async () => {
    const usage = await axios.get(`${process.env.REACT_APP_SERVER_URL}/usage?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    setUsage({
      usedBlog: usage.data?.blogCreated || 0,
      totalBlog: usage.data?.blogLimit || 0,
      usedPlagiarism: usage.data?.plagarismChecked || 0,
      totalPlagiarism: usage.data?.plagarismCheckLimit || 0
    });
  };
  useEffect(() => {
    getUsage();
  }, []);
  return (
    <div className='account-wrapper'>
      <h1>Account Settings</h1>
      <div className='tab-wrapper'>
        <Tabs activeKey={getTabKeyFromLocation()} defaultActiveKey='1' items={items} onChange={onChange} />
      </div>
    </div>
  );
};

export default Account;
