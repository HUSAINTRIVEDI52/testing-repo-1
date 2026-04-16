import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, message, Modal, Slider } from 'antd';
import Icon from '@ant-design/icons';
import { ReactComponent as CheckIcon } from '../../assets/icons/check.svg';
import { ReactComponent as MinusIcon } from '../../assets/icons/ic_round-check.svg';
import SideTitleInfo from '../SideTitleInfo/SideTitleInfo';
import { planDetail } from '../../constant';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PriceSummary from './Model/PriceSummaryModel';
import closeIcon from '../../assets/icons/fontisto_close.svg';
import { GlobalContext } from '../../Context';
import PlanCancellationModal from './Model/PlanCancellationModal';
import DowngradePlanModal from '../Model/DowngradePlanModel';

const PlanBills = () => {
  const [planChoose, setPlanChoose] = useState('yearly');
  const userId = localStorage.getItem('userId');
  const [loading, setLoading]: any = useState({});
  const [activePlanId, setActivePlanId] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const [planDetails, setPlanDetails] = useState<any>();
  const [downgradePlanName, setDowngradePlanName] = useState<any>('');
  const planRef: any = useRef(null);
  const [plans, setPlans] = useState([]);
  const [blogPrice, setBlogPrice] = useState(0);
  const [plagiarismPrice, setPlagiarismPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDowngradeModelVisible, setIsDowngradeModelVisible] = useState(false);
  const [downPriceId, setDownPriceId] = useState();
  const [downPriceName, setDownPriceName] = useState();
  const [downPlan, setDownPlan] = useState();

  const [addOnDetails, setAddOnDetails] = useState([
    { name: 'Blog Count', value: 0, price: 0 },
    { name: 'PlagiarismCheck', value: 0, price: 0 }
  ]);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const [userDetails, setUserDetails] = useState({
    username: '',
    email: ''
  });

  const models = ['gemini-2.5-flash', 'gemini-2.5-pro', 'gpt-5', 'claude_4.5_sonnet', 'o4-mini'];

  const { usage, setUsage }: any = useContext(GlobalContext);

  const blogMarks = {
    0: {
      style: {
        color: blogPrice === 0 ? '#ff7c02' : 'gray',
        fontWeight: blogPrice === 0 ? 'bold' : 'normal',
        fontSize: blogPrice === 0 ? '20px' : '14px'
      },
      label: '0'
    },
    33.33: {
      style: {
        color: blogPrice === 5 ? '#ff7c02' : 'gray',
        fontWeight: blogPrice === 5 ? 'bold' : 'normal',
        fontSize: blogPrice === 5 ? '20px' : '14px'
      },
      label: '5'
    },
    66.67: {
      style: {
        color: blogPrice === 10 ? '#ff7c02' : 'gray',
        fontWeight: blogPrice === 10 ? 'bold' : 'normal',
        fontSize: blogPrice === 10 ? '20px' : '14px'
      },
      label: '10'
    },
    100: {
      style: {
        color: blogPrice === 15 ? '#ff7c02' : 'gray',
        fontWeight: blogPrice === 15 ? 'bold' : 'normal',
        fontSize: blogPrice === 15 ? '20px' : '14px'
      },
      label: '15'
    }
  };

  const PlagMarks = {
    0: {
      style: {
        color: plagiarismPrice * 2 === 0 ? '#ff7c02' : 'gray',
        fontWeight: plagiarismPrice * 2 === 0 ? 'bold' : 'normal',
        fontSize: plagiarismPrice * 2 === 0 ? '20px' : '14px'
      },
      label: '0'
    },
    33.33: {
      style: {
        color: plagiarismPrice * 2 === 5 ? '#ff7c02' : 'gray',
        fontWeight: plagiarismPrice * 2 === 5 ? 'bold' : 'normal',
        fontSize: plagiarismPrice * 2 === 5 ? '20px' : '14px'
      },
      label: '5'
    },
    66.67: {
      style: {
        color: plagiarismPrice * 2 === 10 ? '#ff7c02' : 'gray',
        fontWeight: plagiarismPrice * 2 === 10 ? 'bold' : 'normal',
        fontSize: plagiarismPrice * 2 === 10 ? '20px' : '14px'
      },
      label: '10'
    },
    100: {
      style: {
        color: plagiarismPrice * 2 === 15 ? '#ff7c02' : 'gray',
        fontWeight: plagiarismPrice * 2 === 15 ? 'bold' : 'normal',
        fontSize: plagiarismPrice * 2 === 15 ? '20px' : '14px'
      },
      label: '15'
    }
  };

  /// check if user already has default payment method set
  const checkUserPaymentMethod = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/has-payment-method?userId=${userId}`,

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      return response.data?.hasPaymentMethod;
    } catch (error) {
      console.log(error);
    }
  };

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

  const purchaseAddOn = async () => {
    if (addOnDetails[0].value === 0 && addOnDetails[1].value === 0) {
      message.error({ content: 'Please select atleast one add-on to purchase.', key: 'addon-validation' });
      return;
    }

    const hasPaymentMethod = await checkUserPaymentMethod();
    if (hasPaymentMethod) {
      navigate(
        `/plan-checkout?source=add-on&blog=${addOnDetails[0].value}&plagiarismCheck=${addOnDetails[1].value}&addCard=false`
      );
    } else {
      navigate(
        `/plan-checkout?source=add-on&blog=${addOnDetails[0].value}&plagiarismCheck=${addOnDetails[1].value}&addCard=true`
      );
    }
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
            message.success('Payment successful!');
            // Redirect to success page or update UI accordingly
          })
          .catch((error) => {
            console.log(error);
            message.error('Payment verification failed');
          });
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  // Fetch plan details

  const addOnPlagiarism = (value: any) => {
    const mappedValues: { [key: number]: number } = {
      0: 0,
      33.33: 5,
      66.67: 10,
      100: 15
    };

    const finalValue = mappedValues[value] ?? 0; // Default to 0 if the value doesn't exist
    setPlagiarismPrice(finalValue * Number(process.env.REACT_APP_SINGLE_PLAGAIRISM_CHECK_PRICE));
    setTotalPrice(blogPrice + finalValue * Number(process.env.REACT_APP_SINGLE_PLAGAIRISM_CHECK_PRICE));
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

  // Fetch user details from backend
  const fetchUserDetails = async () => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/getuser?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      .then((res) => {
        setUserDetails({
          username: res.data.name,
          email: res.data.email
        });
      })
      .catch((err) => {
        console.error('Error fetching user details:', err);
      });
  };

  const handleCancelPlan = (reason: string, feedback: string) => {
    axios
      .post(`${process.env.REACT_APP_SERVER_URL}/cancel-subscription`, {
        userId,
        cancelReason: {
          comment: feedback,
          feedback: reason
        }
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      .then((res) => {
        message.success({ content: 'Plan cancelled successfully', key: 'canceled-success' });
        setShowCancelModal(false);
        // Refresh plan details
        window.location.reload();
      })
      .catch((error) => {
        // Fallback for GET request if POST is not supported yet
        axios.get(`${process.env.REACT_APP_SERVER_URL}/cancel-subscription?userId=${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }).then(() => {
          message.success({ content: 'Plan cancelled successfully', key: 'canceled-success' });
          setShowCancelModal(false);
          window.location.reload();
        }).catch((err) => {
          message.error({
            content: 'Unable to cancel plan. Please, try again later.',
            key: 'unable-to-fetch-plan'
          });
        });
      });
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
        setDowngradePlanName(res.data?.downgradePlan);
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
        setPlans(res.data);
      })
      .catch((err) => {
        console.log(err);
        message.error({
          content: 'Unable to fetch plan details. Please, try again later.',
          key: 'unable-to-fetch-plan'
        });
      });

    /// update the user usage too on load
    getUsage();
    fetchUserDetails();
  }, []);

  useEffect(() => {
    setActiveIndex(plans.findIndex((item: any) => item.priceID == activePlanId));
  }, [plans, activePlanId]);

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
    let x = document.querySelector('.main-content');
    const element = document.getElementById('plan-div');
    if (!element || !x) return;
    console.log(element, element?.offsetTop, x);
    x.scroll({
      top: element.offsetTop + 20,
      behavior: 'smooth'
    });
  };

  // ✅ Skeleton Loader while data is fetching
  if (!planDetails || !plans || plans.length === 0) {
     return (
       <div className='planbills-wrapper'>
         <div className='current-plan'>
           <div className='plan-heading'>
             <div>
               <div style={{ width: '150px', height: '24px', backgroundColor: '#f0f0f0', borderRadius: '4px', marginBottom: '8px' }} />
               <div style={{ width: '250px', height: '16px', backgroundColor: '#f0f0f0', borderRadius: '4px' }} />
             </div>
           </div>
           <div className='plan-includes'>
             {[1, 2, 3, 4].map(i => (
               <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                 <div style={{ width: '40%', height: '16px', backgroundColor: '#f0f0f0', borderRadius: '4px' }} />
                 <div style={{ width: '20%', height: '16px', backgroundColor: '#f0f0f0', borderRadius: '4px' }} />
               </div>
             ))}
           </div>
         </div>
         
         <div style={{ marginTop: '32px' }}>
           <div style={{ display: 'flex', gap: '20px', overflow: 'hidden' }}>
             {[1, 2, 3].map(i => (
               <div key={i} style={{ width: '300px', height: '400px', border: '1px solid #eee', borderRadius: '8px', padding: '24px' }}>
                 <div style={{ width: '100px', height: '24px', backgroundColor: '#f0f0f0', borderRadius: '4px', marginBottom: '16px' }} />
                 <div style={{ width: '80px', height: '32px', backgroundColor: '#f0f0f0', borderRadius: '4px', marginBottom: '24px' }} />
                 <div style={{ width: '100%', height: '40px', backgroundColor: '#f0f0f0', borderRadius: '4px', marginBottom: '24px' }} />
                 {[1, 2, 3, 4, 5].map(j => (
                   <div key={j} style={{ width: '100%', height: '16px', backgroundColor: '#f0f0f0', borderRadius: '4px', marginBottom: '12px' }} />
                 ))}
               </div>
             ))}
           </div>
         </div>
       </div>
     )
  }

  return (
    <div className='planbills-wrapper'>
      <h3>Current Plan</h3>
      <div className='current-plan'>
        <div className='plan-heading'>
          <div>
            <p className='plan-name'>{planDetails?.name}</p>
            <p>You are currently on the {planDetails?.name} plan.</p>
          </div>
          {planDetails && planDetails?.name !== 'Agency' && <Button onClick={() => gotoPlans()}>Upgrade Plan</Button>}
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
                      <span>{item.value === true ? <CheckIcon /> : item.value}</span>
                    </div>
                    {item.price && <div className='row-right'>{item.price}</div>}
                  </div>
                )
              );
            })}
            <div className='plan-include-row'>
              <div className='row-left'>
                <span>Add Ons</span>
                <span>
                  <CheckIcon />
                </span>
              </div>
              <div className='row-right'></div>
            </div>
            <div className='plan-include-price'>
              <div className='row-left'>Monthly Total</div>
              {planDetails && <div className='row-right'>{planDetails.details?.[0]?.price}</div>}
            </div>
          </div>
        </div>
      </div>
      <div ref={planRef} id='plan-div'>
        <h3>Plans</h3>
      </div>
      <div className='plan-details-container'>
        <div className='plans-content-wrapper'>
          <SideTitleInfo title='Subscription Plans' subTitle='Flexible pricing plans that fit your needs.'>
            {/* <div className='tab-content-wrapper'>
            {planTab?.map((plan: any) => (
              <Button
                key={plan?.id}
                className={`tab ${plan?.title.split('(')[0].toLowerCase() === planChoose ? 'active' : ''}`}
                onClick={() => handleTab(plan?.title)}
              >
                {plan?.title}
              </Button>
            ))}
          </div> */}
          </SideTitleInfo>
          <div className='plans-wrapper'>
            {plans.map((item: any, index) => (
              <div className='plan-item' key={index}>
                <div className={`content-wrapper ${item.priceID === activePlanId ? 'active' : ''}`}>
                  {item?.name == 'Pro' && (
                    <div className={`popular  ${item.priceID === activePlanId ? 'active' : ''}`}>🔥 Most Popular</div>
                  )}
                  <div className={`plan-header  ${item.priceID === activePlanId ? 'active' : ''}`}>
                    <div className={`plan-title  ${item.priceID === activePlanId ? 'active' : ''}`}>{item?.name}</div>
                    <div className={`plan-price  ${item.priceID === activePlanId ? 'active' : ''}`}>
                      {/* {item?.price && ( */}
                      <div className={`price  ${item.priceID === activePlanId ? 'active' : ''}`}>
                        ${item?.price}
                        {/* {item?.price && ( */}
                        <span className='billed'>&nbsp; / &nbsp; mo</span>
                        {/* )} */}
                        {/* {item?.discount !== '0' && <span className='discount'>Get {item?.discount}% off</span>} */}
                      </div>
                      {/* )} */}
                    </div>
                  </div>
                  <Button
                    onClick={async () => {
                      if (item.priceID === activePlanId) {
                        message.error('You are already on this plan.');
                        return;
                      }

                      /// upgrading only if user is on low plan

                      axios

                        .get(
                          `${process.env.REACT_APP_SERVER_URL}/can-upgrade?planName=${item.name}&userId=${userId}`,

                          {
                            headers: {
                              Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                            }
                          }
                        )

                        .then(async (res) => {
                          if (res.data.canUpgrade) {
                            /// directly ugrade the subscription without collecting card details user already had default payment method set

                            const hasPaymentMethod = await checkUserPaymentMethod();

                            if (hasPaymentMethod) {
                              navigate(`/plan-checkout?planId=${item.priceID}&source=plan-upgrade&addCard=false`);
                            } else {
                              navigate(`/plan-checkout?planId=${item.priceID}&source=plan-upgrade&addCard=true`);
                            }
                          } else {
                            /// donwgrade the plan if user is on higher plan

                            setIsDowngradeModelVisible(true);
                            setDownPriceId(item?.priceID);
                            setDownPriceName(item?.name);
                            return;
                          }
                        })

                        .catch((error) => {
                          message.error({
                            content: 'Unable to fetch plan details. Please, try again later.',
                            key: 'unable-to-fetch-plan'
                          });
                        });
                    }}
                    className={`${item?.name === downgradePlanName
                      ? 'downgrade-btn'
                      : item.priceID === activePlanId
                        ? 'active-btn'
                        : ''
                      }`}
                    loading={loading[index]}
                    disabled={activePlanId ? item.priceID === activePlanId || item?.name === downgradePlanName : true}
                  >
                    {index == activeIndex
                      ? 'Current Plan'
                      : index < activeIndex
                        ? item?.name === downgradePlanName
                          ? `Downgrade Scheduled`
                          : `Downgrade`
                        : `Upgrade`}
                  </Button>
                  <div className={`plan-content  ${item.priceID === activePlanId ? 'active' : ''}`}>
                    <span className={`title  ${item.priceID === activePlanId ? 'active' : ''}`}>LLM Models</span>
                    <ul>
                      {models?.map((cont: string) => {
                        return item?.llmModels?.includes(cont) ? (
                          <li key={cont}>
                            <Icon component={CheckIcon} /> {cont}
                          </li>
                        ) : (
                          <li key={cont} className='disabled'>
                            <Icon component={MinusIcon} />
                            {cont}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div className={`plan-content  ${item.priceID === activePlanId ? 'active' : ''}`}>
                    <span className={`title  ${item.priceID === activePlanId ? 'active' : ''}`}>What's included?</span>
                    <ul>
                      <li className={`${item?.blogCount ? '' : 'disabled'} `}>
                        <Icon component={CheckIcon} /> {item?.blogCount + ' Blog Generations'}
                      </li>
                      <li className={`${item?.fileCount ? '' : 'disabled'} `}>
                        <Icon component={CheckIcon} /> {item?.fileCount + ' File uploads'}
                      </li>
                      <li className={`${item?.embeddingLimit ? '' : 'disabled'} `}>
                        <Icon component={CheckIcon} /> {item?.embeddingLimit + ' Embedding Words'}
                      </li>
                      <li className={`${item?.keywordResearch ? '' : 'disabled'} `}>
                        <Icon component={CheckIcon} /> {'Key word research'}
                      </li>
                      <li className={`${item?.plagarismCheckCount ? '' : 'disabled'} `}>
                        <Icon component={CheckIcon} /> {item?.plagarismCheckCount + ' Plagiarism Checks'}
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
        {/* <h3>Add Ons</h3> */}
        <div className='addOns-content-wrapper'>
          <SideTitleInfo
            title={
              <div>
                One Time Add-On <span>(Buy When Need)</span>
              </div>
            }
          // subTitle="Flexible pricing plans that fit your needs."
          ></SideTitleInfo>
          <div className='addOns-wrapper'>
            <div className='addOns-Grid'>
              <div className='addOns-item'>
                <div className='addOns-head'>
                  <div className='addOns-name'>Blog Generations</div>
                  <div className='addOns-name'>${blogPrice}</div>
                </div>
                <div className='addOns-body'>
                  {planDetails && (
                    <span>
                      {/* {usage?.totalBlog} Current Blog Count
                      <span> + {blogPrice} Blog Count</span> */}
                      {blogPrice} Blogs
                    </span>
                  )}
                </div>
                <Slider
                  marks={blogMarks}
                  step={null}
                  defaultValue={0}
                  tooltip={{ open: false }}
                  onChange={(value) => addOnBlogCount(value)}
                />
              </div>
              <div className='addOns-item'>
                <div className='addOns-head'>
                  <div className='addOns-name'>Plagiarism Checks</div>
                  <div className='addOns-name'>${plagiarismPrice}</div>
                </div>
                {planDetails && (
                  <div className='addOns-body'>
                    <span>
                      {/* {planDetails?.details?.find((item: any) => item.name === 'Plagiarism Check')?.value} Current
                    Plagiarism Check +  */}
                      {/* {usage?.totalPlagiarism} Current Plagiarism Check
                      <span> + {plagiarismPrice * 2} Plagiarism Check</span> */}
                      {plagiarismPrice * 2} Checks
                    </span>
                  </div>
                )}
                <Slider
                  marks={PlagMarks}
                  step={null}
                  defaultValue={0}
                  tooltip={{ open: false }}
                  onChange={(value) => addOnPlagiarism(value)}
                />
              </div>
            </div>
            <div className='total-addOn'>
              <div>
                Add-On total: <span>${totalPrice}</span>
              </div>
              <button onClick={purchaseAddOn}>Purchase</button>
            </div>
            <span className='price-summary' onClick={() => setIsModalOpen(true)}>
              See Price Summary
            </span>
          </div>
        </div>
      </div>

      {/* show this container only has not cancelled his plan */}
      {planDetails?.name !== 'Free' && (
        <>
          <h3>Plan Cancellation</h3>
          <div className='plan-cancel-container'>
            <div className='plan-cancel'>You'll keep access to your workspace through the end of the month.</div>
            <button
              onClick={() => {
                setShowCancelModal(true);
              }}
            >
              Cancel
            </button>
          </div>
        </>
      )}
      <PlanCancellationModal
        isVisible={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelPlan}
      />
      <DowngradePlanModal
        isDowngradeModelVisible={isDowngradeModelVisible}
        setIsDowngradeModelVisible={setIsDowngradeModelVisible}
        priceId={downPriceId}
        downgradePlanName={downPriceName}
        planDetails={planDetails}
        downPlan={downPlan}
      />
      <Modal
        centered
        className='keyword-model'
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        closable={false}
      >
        <PriceSummary addOnDetails={addOnDetails} totalPrice={totalPrice} setIsModalOpen={setIsModalOpen} />
      </Modal>
    </div>
  );
};

export default PlanBills;
