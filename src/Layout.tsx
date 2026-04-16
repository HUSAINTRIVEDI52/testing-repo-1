import { useLocation, useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import SupportTicketForm from './components/SupportTicketForm/SupportTicketForm';
import { Alert, Button, message } from 'antd';
import axios from 'axios';
import { GlobalContext } from './Context';

const PrivateLayout = ({ children }: any) => {
  const { pathname } = useLocation();

  const excludePathsHeaderBtn: any = /^\/(blog-edit(\/\d+)|create-blog-guideline|create-style-guide?)/;

  const [hasToken, setHasToken] = useState(false);

  const { setPlanDetails, planDetails }: any = useContext(GlobalContext);

  /// state to store the days remaining for the downgrade & cancellation
  const [daysRemainingForDowngrade, setDaysRemainingForDowngrade] = useState(-1);
  const [downgradePlanName, setDowngradePlanName] = useState('');
  const [currentPlanName, setCurrentPlanName] = useState('');
  const [daysRemainingForCancellation, setDaysRemainingForCancellation] = useState(-1);

  /// loader to disable the button
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem('userId');

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setHasToken(true);
    } else {
      navigate('/login');
    }

    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/plan-details?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      .then((res) => {
        /// if the user has cancelled the subscription then show the alert
        const currentPlanName: string = res.data?.name;
        const cancellationDateString: number = res.data?.cancellationDate;
        const downgradeDateString: number = res.data?.downgradeScheduleDate;

        /// process the date and calculate the days remaining
        if (downgradeDateString) {
          // Split the downgradeDateString into day, month, and year (DD/MM/YYYY format)
          // const [day, month, year] = downgradeDateString.split('/').map((num: string) => parseInt(num, 10));

          // Create the downgrade date in UTC by using Date.UTC(year, month, day)
          const downgradeDateUTC = new Date(downgradeDateString * 1000); // Months are 0-indexed
          downgradeDateUTC.setUTCHours(0, 0, 0, 0);

          // Get the current date in UTC and set time to 00:00:00 for accurate day-only comparison
          const currentDateUTC = new Date();
          currentDateUTC.setUTCHours(0, 0, 0, 0); // Set current time to midnight UTC

          // Calculate the time remaining between the downgrade date and the current date in UTC
          const timeRemaining = downgradeDateUTC.getTime() - currentDateUTC.getTime();

          // Calculate the number of days remaining
          setDaysRemainingForDowngrade(
            Math.floor(timeRemaining / (1000 * 60 * 60 * 24)) // Dividing by the number of milliseconds in a day
          );

          setDowngradePlanName(res.data?.downgradePlan);
        }

        if (cancellationDateString) {
          // Split the cancellationDate string into day, month, and year (DD/MM/YYYY format)
          // const [day, month, year]: any = cancellationDateString.split('/');

          // Create the cancellation date in UTC by using Date.UTC(year, month, day)
          const cancellationDateUTC: any = new Date(cancellationDateString * 1000); // Months are 0-indexed in JavaScript
          cancellationDateUTC.setUTCHours(0, 0, 0, 0);

          // If the date is invalid, return an error message
          // if (isNaN(cancellationDateUTC)) {
          //   console.error('Invalid cancellation date format');
          //   return;
          // }

          // Get the current date in UTC and set time to 00:00:00 for accurate day-only comparison
          const currentDateUTC: any = new Date();
          currentDateUTC.setUTCHours(0, 0, 0, 0); // Set current time to midnight UTC for comparison

          // Calculate the difference in time between the cancellation date and the current date in UTC
          const timeDifference = cancellationDateUTC.getTime() - currentDateUTC.getTime();

          // Calculate the number of days remaining
          const daysRemaining = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

          setDaysRemainingForCancellation(daysRemaining);
        }

        setCurrentPlanName(currentPlanName);
        setPlanDetails({
          ...res.data,
          maxCount: res.data.name === 'Free' ? 2 : res.data.name === 'Basic' ? 4 : 10
        });
      })

      .catch((err) => {
        if (userId) {
          message.error({ content: 'Unable to fetch plan details. Please, try again later.', key: 'error-plan-fetch' });
        }
      });
  }, []);

  /// function to reactivate the plan if user has cancelled the subscription
  async function reactivatePlan() {
    try {
      setLoading(true);
      await axios.get(`${process.env.REACT_APP_SERVER_URL}/reactivate-subscription?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      setLoading(false);
      message.success({ content: 'Plan resumed successfully.', key: 'plan-reactive' }).then(() => {
        window.location.reload();
      });
    } catch (err) {
      console.log(err);
      setLoading(true);
      message.error({ content: 'Unable to resume plan. Please, try again later.', key: 'plan-reactivation-error' });
    }
  }

  /// function to resume the plan to current plan if user has downgraded the subscription
  async function resumePlan() {
    try {
      setLoading(true);
      await axios.get(`${process.env.REACT_APP_SERVER_URL}/resume-subscription?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      setLoading(false);
      message.success({ content: 'Plan resumed successfully.', key: 'plan-reactive' }).then(() => {
        window.location.reload();
      });
    } catch (err) {
      console.log(err);
      setLoading(true);
      message.error({ content: 'Unable to resume plan. Please, try again later.', key: 'plan-reactivation-error' });
    }
  }

  if (hasToken) {
    return (
      <>
        <Header />
        <div className='main-wrapper'>
          {!excludePathsHeaderBtn.test(pathname) && <Sidebar />}

          <div className='main-wrapper-content'>
            {/* if user plan is going to expire then show this alert */}
            <div className='subscription-alert'>
              {/* If user plan is going to be downgraded, show this alert */}
              {daysRemainingForDowngrade >= 0 && (
                <Alert
                  type='error'
                  message={
                    <span>
                      You will be moved to <b style={{ fontWeight: 600 }}>{downgradePlanName}</b>
                      {' plan within '}
                      <b style={{ fontWeight: 600 }}>
                        {daysRemainingForDowngrade > 1 ? `${daysRemainingForDowngrade} days` : '24 hrs'}
                      </b>
                    </span>
                  }
                  banner
                  action={
                    <Button type='primary' size='small' onClick={resumePlan} disabled={loading} loading={loading}>
                      Resume Plan
                    </Button>
                  }
                  className='subscription-alert-message'
                />
              )}

              {/* If user plan is going to expire, show this alert */}
              {daysRemainingForCancellation >= 0 && (
                <Alert
                  type='error'
                  message={
                    <span>
                      Your <b style={{ fontWeight: 600 }}>{currentPlanName}</b> plan will be cancelled in
                      <b style={{ fontWeight: 600 }}>
                        {daysRemainingForCancellation > 1 ? ` ${daysRemainingForCancellation} days` : ' 24 hrs'}
                      </b>
                    </span>
                  }
                  banner
                  action={
                    <Button type='primary' size='small' onClick={reactivatePlan} disabled={loading} loading={loading}>
                      Reactivate Plan
                    </Button>
                  }
                  className='subscription-alert-message'
                />
              )}
            </div>

            <div className='main-content'>{children}</div>
          </div>
          {/* don't show when the user is on /createblog page */}
          {pathname !== '/createblog' && <SupportTicketForm />}
        </div>
        {/* <Footer/> */}
      </>
    );
  } else {
    return <></>;
  }
};

export default PrivateLayout;
