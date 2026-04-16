import React, { useEffect, useRef, useState } from 'react';
import { Button, message, Modal, Slider, Switch } from 'antd';
import Icon from '@ant-design/icons';
import { ReactComponent as CheckIcon } from '../../assets/icons/check.svg';
import SideTitleInfo from '../SideTitleInfo/SideTitleInfo';
import { planDetail, planTab } from '../../constant';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import type { SliderSingleProps } from 'antd';
import PriceSummary from './Model/PriceSummaryModel';
import closeIcon from '../../assets/icons/fontisto_close.svg';
import PlagrismCheck from '../BlogEdit/PlagrismCheck';

const PlanOverview = () => {
  const [planChoose, setPlanChoose] = useState('yearly');
  const userId = localStorage.getItem('userId');
  const [loading, setLoading]: any = useState({});
  const [activePlanId, setActivePlanId] = useState('');
  const basicMonthlyPlanId = process.env.REACT_APP_PLAN_ID_BASIC_MONTHLY;
  const basicYearlyPlanId = process.env.REACT_APP_PLAN_ID_BASIC_YEARLY;
  const proMonthlyPlanId = process.env.REACT_APP_PLAN_ID_PRO_MONTHLY;
  const proYearlyPlanId = process.env.REACT_APP_PLAN_ID_PRO_YEARLY;
  const navigate = useNavigate();
  const [planDetails, setPlanDetails] = useState<any>();
  const planRef: any = useRef(null);
  const [plans, setPlans] = useState([]);
  const [blogPrice, setBlogPrice] = useState(0);
  const [plagiarismPrice, setPlagiarismPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addOnDetails, setAddOnDetails] = useState([
    { name: 'Blog Count', value: 0, price: 0 },
    { name: 'PlagiarismCheck', value: 0, price: 0 }
  ]);

  const availablePlans = {
    basicMonthlyPlanId,
    basicYearlyPlanId,
    proMonthlyPlanId,
    proYearlyPlanId
  };

  const marks: SliderSingleProps['marks'] = {
    0: 0,
    33.33: 5,
    66.67: 10,
    100: 15
  };

  const handleTab = (plan: any) => {
    let updatePlan = plan.split('(')[0].toLowerCase();
    setPlanChoose(updatePlan);
    // localStorage.setItem("planChoose", updatePlan);
  };

  // Razorpay checkout when buying plan first times
  const openRazorpayCheckout = (subscriptionId: string) => {
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY,
      subscription_id: subscriptionId,
      handler: function (response: any) {
        axios
          .post(
            `${process.env.REACT_APP_SERVER_URL}/payment-verification`,
            {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_signature: response.razorpay_signature,
              userId
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
              }
            }
          )
          .then((res) => {
            message.success({ content: 'Payment successful!', key: 'payment-success' });
            // Redirect to success page or update UI accordingly
          })
          .catch((error) => {
            console.log(error);
            message.error({ content: 'Payment verification failed', key: 'payment-failed' });
          });
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  // function for purchasing the plan
  const purchasePlan = (plan: string, index: number) => {
    // choose planId to create plan
    setLoading((prev: any) => ({ ...prev, [index]: true }));

    let planId: any = '';

    if (planChoose === 'yearly') {
      planId =
        plan === 'Basic'
          ? process.env.REACT_APP_PLAN_ID_BASIC_YEARLY
          : plan === 'Pro'
            ? process.env.REACT_APP_PLAN_ID_PRO_YEARLY
            : '';
    } else {
      planId =
        plan === 'Basic'
          ? process.env.REACT_APP_PLAN_ID_BASIC_MONTHLY
          : plan === 'Pro'
            ? process.env.REACT_APP_PLAN_ID_PRO_MONTHLY
            : '';
    }

    try {
      const body = {
        planId,
        // planId: "plan_Oa5W0unVoozxII",
        userId
      };

      axios
        .post(`${process.env.REACT_APP_SERVER_URL}/subscribe`, body, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        })
        .then((res) => {
          const { subscriptionId } = res.data;
          openRazorpayCheckout(subscriptionId);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setLoading((prevLoading: any) => ({
            ...prevLoading,
            [index]: false
          }));
        });
    } catch (error) {
      message.error({ content: 'Something went wrong. Please, try again.', key: 'somthing-wrong' });
      setLoading((prevLoading: any) => ({ ...prevLoading, [index]: false }));
    }
  };

  const upgradePlan = (newPlan: any, newPlanPrice: any, index: number) => { };

  // Fetch plan details

  const addOnPlagiarism = (value: any) => {
    const mappedValues: { [key: number]: number } = {
      0: 0,
      33.33: 5,
      66.67: 10,
      100: 15
    };

    const finalValue = mappedValues[value] ?? 0; // Default to 0 if the value doesn't exist
   setPlagiarismPrice(finalValue * 0.5);
    setTotalPrice(blogPrice + finalValue * 0.5);
    setAddOnDetails((prevDetails) =>
      prevDetails.map((detail) =>
        detail.name === 'PlagiarismCheck'
          ? {
            ...detail,
            value: finalValue,
            price: finalValue * Number(process.env.REACT_APP_SINGLE_PLAGAIRISM_CHECK_PRICE)
          }
          : detail
      )
    );
  };

  const addOnBlogCount = (value: any) => {
    const mappedValues: { [key: number]: number } = {
      0: 0,
      33.33: 5,
      66.67: 10,
      100: 15
    };

    const finalValue = mappedValues[value] ?? 0; // Default to 0 if the value doesn't exist
    setBlogPrice(finalValue * Number(process.env.REACT_APP_SINGLE_BLOG_COUNT_PRICE));
    setTotalPrice(plagiarismPrice + finalValue * Number(process.env.REACT_APP_SINGLE_BLOG_COUNT_PRICE));
    setAddOnDetails((prevDetails) =>
      prevDetails.map((detail) =>
        detail.name === 'Blog Count'
          ? {
            ...detail,
            value: finalValue,
            price: finalValue * Number(process.env.REACT_APP_SINGLE_BLOG_COUNT_PRICE)
          }
          : detail
      )
    );
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/plan-details?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      .then((res) => {
        setPlanDetails(res.data);
        setActivePlanId(res.data.planId);
        if (res.data?.billingType === 'month') {
          setPlanChoose('monthly');
        } else if (res.data?.billingType === 'year') {
          setPlanChoose('yearly');
        }
      })
      .catch((err) => {
        console.log(err);
        message.error({
          content: 'Unable to fetch plan details. Please, try again later.',
          key: 'unable-to-fetch-plan'
        });
      });

    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/plans`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      .then((res) => {
        // planDetail.forEach((plan) => {
        //   (plan as any).price_id = generatePriceId(plan.title, res); // Use a function or logic to assign price_id
        // });
        setPlans(res.data);
      })
      .catch((err) => {
        console.log(err);
        message.error({
          content: 'Unable to fetch plan details. Please, try again later.',
          key: 'unable-to-fetch-plan'
        });
      });
  }, []);

  function generatePriceId(plan: any, res: any) {
    const planData = res.data.find((p: any) => p.name.toLowerCase() === plan.toLowerCase());

    if (planData) {
      return planData.priceID;
    } else {
      return null; // Return null if plan name is not found
    }
  }

  // Filter plans for tab change
  const filteredPlans = planDetail.filter((item) => (item.time ? item.time === planChoose : true));

  const gotoPlans = () => {
    // planRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.scrollTo(1000, 400);
  };

  return (
    <div className='planbills-wrapper'>
      <h3>Current Plan</h3>
      <div className='current-plan'>
        <div className='plan-heading'>
          <div>
            <p className='plan-name'>{planDetails?.name} Plan</p>
            <p>You are currently on the {planDetails?.name} plan.</p>
          </div>
          <Button onClick={() => gotoPlans()}>Upgrade Plan</Button>
        </div>
        <div className='plan-includes'>
          <div className='title'>
            <h4>What’s Included</h4>
            <h4>Price</h4>
          </div>
          <div className='plan-includes-table'>
            {planDetails?.details?.map((item: any) => {
              return (
                item.value != 0 && (
                  <div className='plan-include-row'>
                    <div className='row-left'>
                      <span>{item.name}</span>
                      <span>{item.value}</span>
                    </div>
                    {item.price && <div className='row-right'>{item.price}</div>}
                  </div>
                )
              );
            })}
            <div className='plan-include-row'>
              <div className='row-left'>
                <span>Add Ons</span>
                <span>-</span>
              </div>
              <div className='row-right'></div>
            </div>
            <div className='plan-include-price'>
              <div className='row-left'>Monthly Total</div>
              {planDetails && <div className='row-right'>{planDetails.details[0].price}</div>}
            </div>
          </div>
        </div>
      </div>
      <div ref={planRef}>
        <h3>Plans</h3>
      </div>
      <div className='plans-content-wrapper'>
        <SideTitleInfo title='Subscription Plans' subTitle='Flexible pricing plans that fit your needs.'>
          <div className='tab-content-wrapper'>
            {planTab?.map((plan: any) => (
              <Button
                key={plan?.id}
                className={`tab ${plan?.title.split('(')[0].toLowerCase() === planChoose ? 'active' : ''}`}
                onClick={() => handleTab(plan?.title)}
              >
                {plan?.title}
              </Button>
            ))}
          </div>
        </SideTitleInfo>
        <div className='plans-wrapper'>
          {plans.map((item: any, index) => (
            <div className='plan-item' key={index}>
              <div className={`content-wrapper ${item?.name}`}>
                {item?.name == 'Pro' && <div className={`popular ${item?.name}`}>🔥 Most Popular</div>}
                <div className={`plan-header ${item?.name}`}>
                  <div className={`plan-title ${item?.name}`}>{item?.name}</div>
                  <div className={`plan-price ${item?.name}`}>
                    {/* {item?.price && ( */}
                    <div className={`price ${item?.name}`}>
                      {item?.price}${/* {item?.price && ( */}
                      <span className='billed'>
                        &nbsp; / &nbsp;
                        {item?.billingType === 'month' ? 'month' : 'year'}
                      </span>
                      {/* )} */}
                      {item?.discount !== '0' && <span className='discount'>Get {item?.discount}% off</span>}
                    </div>
                    {/* )} */}
                  </div>
                </div>
                <Button
                  onClick={async () => {
                    if (item.priceID === activePlanId) {
                      message.error({ content: 'You are already on this plan.', key: 'already-on-plan' });
                      return;
                    }
                    /// upgrading only if user is on low plan
                    axios
                      .get(`${process.env.REACT_APP_SERVER_URL}/can-upgrade?planName=${item.name}&userId=${userId}`, {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                        }
                      })
                      .then(async (res) => {
                        if (res.data.canUpgrade) {
                          /// directly ugrade the subscription without collecting card details user already had default payment method set
                          // const response = await axios.get(
                          //   `${process.env.REACT_APP_SERVER_URL}/has-payment-method?userId=${userId}`,
                          //   {
                          //     headers: {
                          //       Authorization: `Bearer ${localStorage.getItem(
                          //         "accessToken"
                          //       )}`,
                          //     },
                          //   }
                          // );

                          // if (response.data?.hasPaymentMethod) {
                          //   try {
                          //     const upgradeResponse = await axios.post(
                          //       `${process.env.REACT_APP_SERVER_URL}/upgrade-subscription`,
                          //       {
                          //         newPriceId: item.priceID,
                          //         userId: userId,
                          //       },
                          //       {
                          //         headers: {
                          //           Authorization: `Bearer ${localStorage.getItem(
                          //             "accessToken"
                          //           )}`,
                          //         },
                          //       }
                          //     );

                          //     if (upgradeResponse.data?.message) {
                          //       message.success(upgradeResponse.data.message);
                          //       navigate("/");
                          //     }
                          //   } catch (error: any) {
                          //     message.error(error?.message);
                          //   }
                          // } else {
                          //   navigate(`/plan-checkout?planId=${item.priceID}`);
                          // }
                          navigate(`/plan-checkout?planId=${item.priceID}`);
                        } else {
                          // message.error("You can only upgrade to higher plan.");
                          /// donwgrade the plan if user is on higher plan
                          axios
                            .post(
                              `${process.env.REACT_APP_SERVER_URL}/downgrade-subscription`,
                              {
                                userId: userId,
                                newPriceId: item.priceID
                              },
                              {
                                headers: {
                                  Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                                }
                              }
                            )
                            .then((res) => {
                              message.success(res.data.message);
                              navigate('/');
                            })
                            .catch((error) => {
                              message.error(error?.response?.data?.message);
                            });
                        }
                      })
                      .catch((error) => {
                        message.error({
                          content: 'Unable to fetch plan details. Please, try again later.',
                          key: 'unable-to-fetch-plan'
                        });
                      });
                  }}
                  loading={loading[index]}
                  disabled={item.priceID === activePlanId}
                >
                  {item.priceID === activePlanId ? 'Active Plan' : 'Choose This Plan'}
                </Button>
                <div className={`plan-content ${item.name}`}>
                  <span className={`title ${item?.name}`}>LLM Models</span>
                  <ul>
                    {item?.llmModels?.map((cont: string) => (
                      <li key={cont}>
                        <Icon component={CheckIcon} /> {cont}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`plan-content ${item.name}`}>
                  <span className={`title ${item.name}`}>What's included?</span>
                  <ul>
                    <li className={`${item?.blogCount ? '' : 'disabled'} `}>
                      <Icon component={CheckIcon} /> {item?.blogCount + ' Blog generation'}
                    </li>
                    <li className={`${item?.fileCount ? '' : 'disabled'} `}>
                      <Icon component={CheckIcon} /> {item?.fileCount + ' File upload'}
                    </li>

                    <li className={`${item?.embeddingLimit ? '' : 'disabled'} `}>
                      <Icon component={CheckIcon} /> {item?.embeddingLimit + ' Embedding Words'}
                    </li>
                    <li className={`${item?.keywordResearch ? '' : 'disabled'} `}>
                      <Icon component={CheckIcon} /> {'Key word research'}
                    </li>
                    <li className={`${item?.plagarismCheckCount ? '' : 'disabled'} `}>
                      <Icon component={CheckIcon} /> {'Plagiarism check'}
                    </li>
                    <li className={`${item?.linkCount ? '' : 'disabled'} `}>
                      <Icon component={CheckIcon} /> {item?.linkCount + ' Link crawl limit'}
                    </li>
                    <li className={`${item?.multiLanguage ? '' : 'disabled'} `}>
                      <Icon component={CheckIcon} /> {'Multilingual support'}
                    </li>

                    {/* {planDetail[2].content?.map((cont) => (
                      <li
                        className={`${cont?.disabled ? "disabled" : ""} ${
                          item.title
                        }`}
                        key={cont?.text}
                      >
                        <Icon component={CheckIcon} /> {cont?.text}
                      </li>
                    ))} */}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <h3>Add Ons</h3>
      <div className='addOns-content-wrapper'>
        <SideTitleInfo
          title='One Time Add-On (Buy When You Need)'
          subTitle='Flexible pricing plans that fit your needs.'
        ></SideTitleInfo>
        <div className='addOns-wrapper'>
          <div className='addOns-Grid'>
            <div className='addOns-item'>
              <div className='addOns-head'>
                <div className='addOns-name'>Blog Count</div>
                <div className='addOns-name'>${blogPrice}</div>
              </div>
              <div>
                {planDetails && (
                  <span>
                    {planDetails?.details?.find((item: any) => item.name === 'Blog Generation')?.value} Current Blog
                    Count + {blogPrice} Blog Count
                  </span>
                )}
              </div>
              <Slider
                marks={marks}
                step={null}
                defaultValue={0}
                tooltip={{ open: false }}
                onChange={(value) => addOnBlogCount(value)}
              />
            </div>

            <div className='addOns-item'>
              <div className='addOns-head'>
                <div className='addOns-name'>Plagiarism Check</div>
                <div className='addOns-name'>${plagiarismPrice}</div>
              </div>
              {planDetails && (
                <div>
                  <span>
                    {planDetails?.details?.find((item: any) => item.name === 'Plagiarism Check')?.value} Current
                    Plagiarism Check + {plagiarismPrice * 2} Plagiarism Check
                  </span>
                </div>
              )}
              <Slider
                marks={marks}
                step={null}
                defaultValue={0}
                tooltip={{ open: false }}
                onChange={(value) => addOnPlagiarism(value)}
              />
            </div>
          </div>
          <div className='total-addOn'>
            <div>Add-On total: ${totalPrice}</div>
            <button>Purchase</button>
          </div>
          <div className='price-summary' onClick={() => setIsModalOpen(true)}>
            See Price Summary
          </div>
        </div>
      </div>
      {planDetails?.name != 'Fre' && (
        <>
          <h3>Plan Cancellation</h3>
          <div className='plan-cancel-container'>
            <div className='plan-cancel'>You'll keep access to your workspace through the end of the month.</div>
            <button
              onClick={() => {
                axios
                  .get(`${process.env.REACT_APP_SERVER_URL}/cancel-subscription?userId=${userId}`, {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    }
                  })
                  .then((res) => {
                    message.success({ content: 'Plan cancelled successfully', key: 'canceled-success' });
                  })
                  .catch((error) => {
                    message.error({
                      content: 'Unable to fetch plan details. Please, try again later.',
                      key: 'unable-to-fetch-plan'
                    });
                  });
              }}
            >
              Cancel Plan
            </button>
          </div>
        </>
      )}
      <Modal
        centered
        className='keyword-model'
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        closable={false}
        width={1000}
      >
        <PriceSummary addOnDetails={addOnDetails} totalPrice={totalPrice} setIsModalOpen={setIsModalOpen} />
      </Modal>
    </div>
  );
};

export default PlanOverview;
