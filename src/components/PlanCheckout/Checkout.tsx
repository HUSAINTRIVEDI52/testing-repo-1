import React from 'react';
import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useEffect, useState } from 'react';
import PaymentSucessmodal from '../../components/PlanCheckout/PaymentSuccessModal';
import { Button, Input, message, Modal, Radio, Skeleton } from 'antd';
import './Checkout.scss';
import CardInfoCollect from '../CollectCardAndBillingDetails/CardInfoCollect';
import { ccIcon } from '../../utils/CCIcon';
import { useLocation, useNavigate } from 'react-router-dom';
import TagManager from 'react-gtm-module';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

function Checkout() {
  /// get planid from url with planId query string
  const searchParams = new URLSearchParams(window.location.search);
  const planId = searchParams.get('planId');
  const navigate = useNavigate();

  /// get the source to identify if the purchase is add on or plan upgrade
  const source = searchParams.get('source');
  const location = useLocation();

  function redirectToPlansTab() {
    /// replace the url after 2 seconds so that user can't purchase the same add-ons / plan again by pressing back
    setTimeout(() => {
      window.location.replace(`${process.env.REACT_APP_BASE_NAME}/account?tab=2`);
    }, 2000);
  }

  // if source is other then add-on or plan-upgrade then redirect to account page
  if (source !== 'add-on' && source !== 'plan-upgrade') {
    message.error('Invalid URL');
    redirectToPlansTab();
  }
  let blog = searchParams.get('blog');
  let plagiarismCheck = searchParams.get('plagiarismCheck');
  let addCardInitialStatus = searchParams.get('addCard') === 'true';

  const userId = localStorage.getItem('userId');

  const stripe: any = useStripe();
  const elements = useElements();

  /// handle add card click
  const [addCard, setAddCard] = useState(addCardInitialStatus);

  const [cardErrors, setCardErrors] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    paymentFailed: false,
    errorMessage: ''
  });

  const [disabled, setDisabled] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subscriptionDetail, setSubscriptionDetail] = useState();

  // State to track errors for billing information fields
  const [billingErrors, setBillingErrors] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });

  // State to store billing & card information provided by the user
  const [card, setCard] = useState({
    last4: '',
    expiryDate: '',
    brand: ''
  });

  const [billingDetails, setBillingDetails] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    email: '',
    country: ''
  });

  /// set payment method to retrive card details
  const [paymentMethod, setPaymentMethod] = useState();

  useEffect(() => {
    /// get the payment method details from backend
    if (paymentMethod) {
      axios
        .get(`${process.env.REACT_APP_SERVER_URL}/payment-method/${paymentMethod}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        })
        .then((res: any) => {
          setCard({
            last4: res.data.last4,
            expiryDate: res.data.expiryDate,
            brand: res.data.brand
          });
          setBillingDetails({
            name: res.data.name,
            address: res.data.address,
            city: res.data.city,
            state: res.data.state,
            postalCode: res.data.postalCode,
            email: res.data.email,
            country: res.data.country
          });
        })
        .catch((err) => {
          message.error('Error in fetching card details');
        });
    }
  }, [paymentMethod]);

  // Function to update billing details as the user types in input fields
  const handleBillingDetailsChange = (e: any) => {
    const { name, value } = e.target;
    setBillingDetails((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Validate billing details
  const validateBillingDetails = () => {
    let errors: any = {};
    if (!billingDetails.name) errors.name = 'Company Name is required';
    if (!billingDetails.email || !/\S+@\S+\.\S+/.test(billingDetails.email)) {
      errors.email = 'A valid email address is required';
    }
    if (!billingDetails.address) errors.address = 'Address is required';
    if (!billingDetails.city) errors.city = 'City is required';
    if (!billingDetails.state) errors.state = 'State is required';
    if (!billingDetails.country) errors.country = 'Country is required';
    if (!billingDetails.postalCode) errors.postalCode = 'Postal Code is required';
    else if (!/^\d{6}(-\d{4})?$/.test(billingDetails.postalCode)) {
      errors.postalCode = 'Invalid postal code';
    }
    setBillingErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const tagManagerArgs = {
    gtmId: String(process.env.REACT_APP_GTM_ID)
  };

  // On submit subscription functionality
  async function handleSubmit(event: any) {
    try {
      setDisabled(true);
      // setCardErrors((prev) => {
      //   return {
      //     ...prev,
      //     paymentFailed: false,
      //   };
      // });
      // event.preventDefault();
      // // setLoading(true); // Start loader
      setPaymentLoading(true);

      // if (!stripe || !elements) {
      //   // Stripe.js has not loaded yet.
      //   // setLoading(false);
      //   setPaymentLoading(false);
      //   return;
      // }

      // const cardElement = elements.getElement(CardNumberElement);
      // if (!cardElement) {
      //   // setLoading(false);
      //   setPaymentLoading(false);
      //   // setError("Card element not found");
      //   return;
      // }

      // /// validate the billing details
      // if (!validateBillingDetails()) {
      //   setPaymentLoading(false);
      //   return;
      // }

      // const { paymentMethod, error } = await stripe.createPaymentMethod({
      //   type: "card",
      //   card: cardElement,
      // });

      // if (error) {
      //   // Handle error (e.g., show error message to the user)
      //   setCardErrors((prev) => ({
      //     ...prev,
      //     paymentFailed: true,
      //     errorMessage: error.message,
      //   }));
      // }

      // Call the subscribe endpoint and create a Stripe subscription
      let subscription: any;
      let paymentIntentStatus;

      if (source === 'add-on') {
        const body = {
          blog,
          plagiarismCheck,
          userId,
          paymentMethodId: paymentMethod
        };

        if (blog === '0' && plagiarismCheck === '0') {
          message.error({ content: 'Please select atleast one add-on to purchase.', key: 'addon-validation' });
          return;
        }

        try {
          /// purchase add-ons
          subscription = await axios.post(`${process.env.REACT_APP_SERVER_URL}/buy/add-ons`, body, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
          });
        } catch (error) {
          console.log(error, 'Error while purchasing addons');
          message.error('Unable to purchase add-ons. Please, try again later.');
        }
      } else if (source === 'plan-upgrade') {
        // object. Returns the subscription ID and client secret
        subscription = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/upgrade-subscription`,
          {
            newPriceId: planId,
            userId: userId,
            paymentMethodId: paymentMethod,
            // endorselyReferral: (window as any).endorsely_referral || null
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
          }
        );

        if (subscription.data?.alreadyExist) {
          message.error(subscription.data.msg);
          setPaymentLoading(false);
          return;
        }
      } else {
        /// user have changed the url so redirect to the account page
        message.error('Invalid URL');
        redirectToPlansTab();
      }

      paymentIntentStatus = subscription?.data?.paymentIntentStatus;

      // Check if payment intent is already confirmed
      if (
        paymentIntentStatus === 'requires_payment_method' ||
        paymentIntentStatus === 'requires_confirmation' ||
        paymentIntentStatus === 'requires_action'
      ) {
        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(subscription.data.clientSecret);

        if (stripeError) {
          message.error(stripeError?.message || 'Payment authentication failed. Please try again.').then(() => {
            setCardErrors((prev) => ({
              ...prev,
              paymentFailed: true,
              errorMessage: stripeError.message
            }));
            setDisabled(false);
            redirectToPlansTab();
          });
        } else if (source === 'plan-upgrade') {
          TagManager.dataLayer({
            dataLayer: {
              event: 'purchase(plan)',
              transactionId: subscription.data.invoiceId,
              value: plan?.price,
              currency: 'USD',

              user: {
                name: billingDetails.name,
                email: billingDetails.email,
                location: billingDetails.country
              },

              subscriptionPlan: plan?.name
            }
          });
          message.success('Upgraded to the new plan successfully');
          setSubscriptionDetail(subscription.data);
          setIsModalOpen(true);
          redirectToPlansTab();
        } else {
          console.log(subscription.data);

          TagManager.dataLayer({
            dataLayer: {
              event: 'purchase(add-on)',
              transactionId: subscription.data.invoiceId,
              value:
                Number(blog) * Number(process.env.REACT_APP_SINGLE_BLOG_COUNT_PRICE) +
                Number(plagiarismCheck) * Number(process.env.REACT_APP_SINGLE_PLAGAIRISM_CHECK_PRICE),
              currency: 'USD',

              user: {
                name: billingDetails.name,
                email: billingDetails.email,
                location: billingDetails.country
              },

              addonCosts: {
                blogGenerationCost: Number(blog) * Number(process.env.REACT_APP_SINGLE_BLOG_COUNT_PRICE),
                plagiarismCheckCost:
                  Number(plagiarismCheck) * Number(process.env.REACT_APP_SINGLE_PLAGAIRISM_CHECK_PRICE)
              }
            }
          });
          message.success('Add-ons purchased successfully.');
          redirectToPlansTab();
        }
      } else if (paymentIntentStatus === 'succeeded' || paymentIntentStatus === 'paid') {
        setSubscriptionDetail(subscription.data);

        // Payment has already succeeded, no need to confirm again
        setIsModalOpen(true);

        if (source === 'add-on') {
          TagManager.dataLayer({
            dataLayer: {
              event: 'purchase(add-on)',
              transactionId: subscription.data.invoiceId,
              value:
                Number(blog) * Number(process.env.REACT_APP_SINGLE_BLOG_COUNT_PRICE) +
                Number(plagiarismCheck) * Number(process.env.REACT_APP_SINGLE_PLAGAIRISM_CHECK_PRICE),
              currency: 'USD',

              user: {
                name: billingDetails.name,
                email: billingDetails.email,
                location: billingDetails.country
              },

              addonCosts: {
                blogGenerationCost: Number(blog) * Number(process.env.REACT_APP_SINGLE_BLOG_COUNT_PRICE),
                plagiarismCheckCost:
                  Number(plagiarismCheck) * Number(process.env.REACT_APP_SINGLE_PLAGAIRISM_CHECK_PRICE)
              }
            }
          });
          message.success('Add-ons purchased successfully.');
          redirectToPlansTab();
        } else {
          TagManager.dataLayer({
            dataLayer: {
              event: 'purchase(plan)',
              transactionId: subscription.data.invoiceId,
              value: plan?.price,
              currency: 'USD',

              user: {
                name: billingDetails.name,
                email: billingDetails.email,
                location: billingDetails.country
              },

              subscriptionPlan: plan?.name
            }
          });
          message.success('Upgraded to the new plan successfully');
          redirectToPlansTab();
        }
      } else {
        message.success(subscription?.data?.message || paymentIntentStatus);
        redirectToPlansTab();
      }

      setPaymentLoading(false);
    } catch (error: any) {
      // setLoading(false);
      message.error(error?.response?.data?.message);
      setPaymentLoading(false);
      setDisabled(false);
      redirectToPlansTab();
    }
  }

  const [plan, setPlan]: any = useState();

  /// get plan detials
  useEffect(() => {
    TagManager.initialize(tagManagerArgs);
    if (source !== 'add-on') {
      // fetch plan details
      axios
        .get(`${process.env.REACT_APP_SERVER_URL}/plan?planId=${planId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        })
        .then((res) => setPlan(res.data));
    }
  }, []);

  // card detail input change functionality
  function handleCardInputChange(event: any) {
    // Listen for changes in card input
    // and display errors, if any, to the user
    // Also control the disabled state of the submit button
    // if the input field is empty

    if (event.elementType === 'cardNumber') {
      setCardErrors((prev) => {
        return {
          ...prev,
          cardNumber: event?.error?.message ?? ''
        };
      });
    } else if (event.elementType === 'cardExpiry') {
      setCardErrors((prev) => {
        return {
          ...prev,
          expiryDate: event?.error?.message ?? ''
        };
      });
    } else if (event.elementType === 'cardCvc') {
      setCardErrors((prev) => {
        return {
          ...prev,
          cvc: event?.error?.message ?? ''
        };
      });
    }

    setDisabled(event?.empty);
    // setError(event?.error?.message ?? "");
  }

  /// handle back button click
  const handleBack = () => {
    window.history.back();
  };

  /// get cards from backend
  const [cards, setCards] = useState([]);
  // State to track the card selection
  const [cardSelection, setCardSelection] = useState<{
    [key: string]: boolean;
  }>({});
  async function getCards() {
    // fetch card details
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/payment-methods?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      .then((res) => {
        // if (res?.data?.cards.length === 0) {
        //   /// open the add card modal if no cards are present
        //   setAddCard(true);

        //   return;
        // }
        if (res?.data?.cards?.length === 0) {
          /// open the add card modal if no cards are present
          setAddCard(true);
          return;
        }

        const defaultCardId = res?.data?.defaultCardId;
        setCards(res?.data?.cards);
        // Initialize card selection object
        const initialSelection = res?.data?.cards.reduce((acc: any, card: any) => {
          acc[card.id] = card.id === defaultCardId; // Set all cards to false initially except the default card
          return acc;
        }, {});

        /// filter the default card & set the card for payment
        let defaultCard = res?.data?.cards.filter((card: any) => card.id === defaultCardId);

        // Fallback: If no card matches defaultCardId, use the first card
        if (defaultCard.length === 0 && res?.data?.cards.length > 0) {
           defaultCard = [res.data.cards[0]];
           // Update selection to match fallback
           if (initialSelection[defaultCardId]) delete initialSelection[defaultCardId];
           initialSelection[defaultCard[0].id] = true;
        }

        /// set it as the default payment method
        setPaymentMethod(defaultCard[0]?.id);
        setCard({
          last4: defaultCard[0]?.card.last4 || '',
          expiryDate: `${defaultCard[0]?.card.exp_month || ''} /${defaultCard[0]?.card.exp_year || ''}`,
          brand: defaultCard[0]?.card.brand || ''
        });
        setBillingDetails({
          name: defaultCard[0]?.billing_details.name || '',
          email: defaultCard[0]?.billing_details.email || '',
          address: defaultCard[0]?.billing_details.address?.line1 || '',
          city: defaultCard[0]?.billing_details.address?.city || '',
          state: defaultCard[0]?.billing_details.address?.state || '',
          postalCode: defaultCard[0]?.billing_details.address?.postal_code || '',
          country: defaultCard[0]?.billing_details.address?.country || ''
        });
        setCardSelection(initialSelection);
      })
      .catch((error) => {
        message.error(error?.response?.data?.message);
      });
  }

  /// handle change card click
  const [selectCardModal, setSelectCardModal] = useState(false);
  const handleSelectCardModal = async () => {
    setSelectCardModal(!selectCardModal);
  };

  /// handle selected card save button click
  const [selectedCard, setSelectedCard] = useState();
  const handleSelectedCard = () => {
    setSelectCardModal(!selectCardModal);
    /// filter the selcted card from the cards list
    const selectedCard: any = cards.filter((card: any) => cardSelection[card.id]);
    /// set the card
    setCard({
      last4: selectedCard[0].card.last4,
      expiryDate: `${selectedCard[0].card.exp_month}/${selectedCard[0].card.exp_year}`,
      brand: selectedCard[0].card.brand
    });
    setBillingDetails({
      name: selectedCard[0].billing_details.name,
      email: selectedCard[0].billing_details.email,
      address: selectedCard[0].billing_details.address.line1,
      city: selectedCard[0].billing_details.address.city,
      state: selectedCard[0].billing_details.address.state,
      postalCode: selectedCard[0].billing_details.address.postal_code,
      country: selectedCard[0].billing_details.address.country
    });
  };

  useEffect(() => {
    getCards();
  }, []);

  return (
    // <div className="Checkout-page">
    //   <h1>Billing Info</h1>
    //   <br></br>
    //   <h2>Plan Details</h2>

    //   <div className="plan-details">
    //     <h3>
    //       {plan?.name} - ${plan?.price} / {plan?.billingType}
    //     </h3>
    //   </div>

    //   {isModalOpen && (
    //     <PaymentSucessmodal
    //       isModalOpen={isModalOpen}
    //       subscriptionDetail={subscriptionDetail}
    //     />
    //   )}

    //   <div className="right white-right">
    //     <div className="right-top">Pay with Card</div>
    //     <div className="card-element">
    //       <label className="card-label">Card Number</label>
    //       <div className="cardNumber">
    //         <CardNumberElement onChange={handleCardInputChange} />
    //       </div>
    //       {cardErrors.cardNumber && (
    //         <div className="card-error cvc-error">{cardErrors.cardNumber}</div>
    //       )}
    //       <label className="card-label">Card Expiry</label>
    //       <div className="cardExpiry">
    //         <CardExpiryElement onChange={handleCardInputChange} />
    //       </div>
    //       {cardErrors.expiryDate && (
    //         <div className="card-error cvc-error">{cardErrors.expiryDate}</div>
    //       )}
    //       <label className="card-label">Card CVC</label>
    //       <div className="cardCvc">
    //         <CardCvcElement onChange={handleCardInputChange} />
    //       </div>
    //       {cardErrors.cvc && (
    //         <div className="card-error cvc-error">{cardErrors.cvc}</div>
    //       )}
    //     </div>

    //     {/* Billing Details Section */}
    //     <div className="billing-details-container">
    //       <h4>Billing Address</h4>
    //       <div className="hr-row">
    //         <div className="billing-detail">
    //           <label htmlFor="name">Company Name</label>
    //           <Input
    //             type="text"
    //             id="name"
    //             name="name"
    //             value={billingDetails.name}
    //             onChange={handleBillingDetailsChange}
    //             required
    //           />
    //           {billingErrors.name && (
    //             <div className="error-message">{billingErrors.name}</div>
    //           )}
    //         </div>
    //         <div className="billing-detail">
    //           <label htmlFor="email">Email Address</label>
    //           <Input
    //             type="email"
    //             id="email"
    //             name="email"
    //             value={billingDetails.email}
    //             onChange={handleBillingDetailsChange}
    //             required
    //           />
    //           {billingErrors.email && (
    //             <div className="error-message">{billingErrors.email}</div>
    //           )}
    //         </div>
    //       </div>
    //       <div className="billing-detail">
    //         <label htmlFor="address">Company Address</label>
    //         <Input
    //           type="text"
    //           id="address"
    //           name="address"
    //           placeholder="Address"
    //           value={billingDetails.address}
    //           onChange={handleBillingDetailsChange}
    //           required
    //         />
    //         {billingErrors.address && (
    //           <div className="error-message">{billingErrors.address}</div>
    //         )}
    //       </div>
    //       <div className="hr-row">
    //         <div className="billing-detail">
    //           <Input
    //             type="text"
    //             id="city"
    //             name="city"
    //             placeholder="City"
    //             value={billingDetails.city}
    //             onChange={handleBillingDetailsChange}
    //             required
    //           />
    //           {billingErrors.city && (
    //             <div className="error-message">{billingErrors.city}</div>
    //           )}
    //         </div>
    //         <div className="billing-detail">
    //           <Input
    //             type="text"
    //             id="state"
    //             name="state"
    //             placeholder="State"
    //             value={billingDetails.state}
    //             onChange={handleBillingDetailsChange}
    //             required
    //           />
    //           {billingErrors.state && (
    //             <div className="error-message">{billingErrors.state}</div>
    //           )}
    //         </div>
    //       </div>

    //       <div className="hr-row">
    //         <div className="billing-detail">
    //           <Input
    //             type="text"
    //             id="country"
    //             name="country"
    //             placeholder="Country eg. IN, US"
    //             value={billingDetails.country}
    //             onChange={handleBillingDetailsChange}
    //             required
    //           />
    //           {billingErrors.country && (
    //             <div className="error-message">{billingErrors.country}</div>
    //           )}
    //         </div>
    //         <div className="billing-detail">
    //           <Input
    //             type="text"
    //             id="postalCode"
    //             name="postalCode"
    //             placeholder="Postal Code"
    //             value={billingDetails.postalCode}
    //             onChange={handleBillingDetailsChange}
    //             required
    //           />
    //           {billingErrors.postalCode && (
    //             <div className="error-message">{billingErrors.postalCode}</div>
    //           )}
    //         </div>
    //       </div>
    //     </div>
    //     {/* <form onSubmit={handleSubmit}>
    //           <CardElement onChange={handleCardInputChange} />
    //         </form> */}

    //     <Button
    //       className="btn-card-submit"
    //       // type="submit"
    //       disabled={disabled}
    //       onClick={handleSubmit}
    //       loading={paymentLoading}
    //       style={{ display: "flex" }}
    //     >
    //       Subscribe
    //     </Button>

    //     {cardErrors.paymentFailed && (
    //       <div className="payment-failed">
    //         <div>{/* <img src={DangerIcon} alt="danger" /> */}X</div>
    //         <div>
    //           <p className="title">Payment failed</p>
    //           <p className="description">Payment failed. Please try again.</p>
    //         </div>
    //       </div>
    //     )}
    //   </div>
    // </div>
    <div className='checkout-page'>
      <button className='back-btn' onClick={handleBack}>
        {'< '}
        Back
      </button>
      {addCard && (
        <CardInfoCollect setAddCard={setAddCard} source={'checkout-page'} setPaymentMethod={setPaymentMethod} />
      )}
      {/* Payment Information */}
      {!addCard && (
        <div className='cards-billing-wrapper'>
          <h2 className='main-header'>Review your order details</h2>
          <hr />
          {/* cards wrapper container  */}
          <div className='payment-info-wrapper' style={{ height: 'fit-content' }}>
            <div className='header'>
              <h2>Payment Information</h2>
              {/* <Button onClick={handleSelectCardModal}>Change Card</Button> */}
            </div>

            <hr />

            <div className='cards-list' style={{ height: '100%' }}>
              <div className='card-element'>
                <div className='card-info'>
                  {!card.last4 && <Skeleton />}
                  {card.last4 && (
                    <>
                      <h4>Card Information</h4>
                      <hr />
                      <div className='card'>
                        <div className='card-number'>
                          {ccIcon(card.brand)} &nbsp; **** **** **** {card.last4}
                        </div>
                        <div className='card-expiry'>Expiry: {card.expiryDate}</div>
                      </div>
                    </>
                  )}
                </div>

                <div className='billing-info'>
                  {!billingDetails.name && <Skeleton />}
                  {billingDetails.name && (
                    <>
                      <h4>Billing Information on Card</h4>
                      <hr />
                      <div className='billing-name'>
                        <span>Organization Name:</span> {billingDetails.name}
                      </div>
                      <div className='billing-email'>
                        <span>Email:</span> {billingDetails.email}
                      </div>
                      <div className='billing-address'>
                        <span>Billing Address:</span> {billingDetails.address}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* plan summary */}
          <div className='plan-summary-wrapper'>
            <div className='header'>
              <h2>Plan Summary</h2>
            </div>
            <hr />
            {source === 'add-on' ? (
              <table role='presentation' cellSpacing={10} width={'100%'}>
                <tr>
                  <td>Blog Generations</td>
                  <td align='right'>{blog} </td>
                  <td align='right'>${Number(blog || 0) * Number(process.env.REACT_APP_SINGLE_BLOG_COUNT_PRICE)} </td>
                </tr>
                <tr>
                  <td>Plagiarism Checks</td>
                  <td align='right'>{plagiarismCheck}</td>
                  <td align='right'>
                    ${Number(plagiarismCheck || 0) * Number(process.env.REACT_APP_SINGLE_PLAGAIRISM_CHECK_PRICE)}
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan={3}
                    style={{
                      borderTop: '2px dashed #9D9D9D',
                      outline: 'none',
                      borderBottom: 0,
                      borderLeft: 0,
                      borderRight: 0,
                      borderRadius: 0
                    }}
                  ></td>
                </tr>
                <tr className='total'>
                  <td>Total</td>
                  <td></td>
                  <td align='right'>
                    $
                    {Number(blog || 0) * Number(process.env.REACT_APP_SINGLE_BLOG_COUNT_PRICE) +
                      Number(plagiarismCheck || 0) * Number(process.env.REACT_APP_SINGLE_PLAGAIRISM_CHECK_PRICE)}
                  </td>
                </tr>
              </table>
            ) : !plan ? (
              <Skeleton />
            ) : (
              <table role='presentation' cellSpacing={10} width={'100%'}>
                <tr>
                  <td>Plan</td>
                  <td>{plan?.name}</td>
                  <td>${plan?.price}/mo</td>
                </tr>
                <tr>
                  <td>Blog Generations</td>
                  <td>{plan?.blogCount}/mo</td>
                </tr>
                <tr>
                  <td>Files Uploads</td>
                  <td>{plan?.fileCount} Files/Blogs</td>
                </tr>
                <tr>
                  <td>Embedding Words</td>
                  <td>{plan?.embeddingLimit}k</td>
                </tr>
                <tr>
                  <td>Plagiarism Checks</td>
                  <td>{plan?.plagarismCheckCount}</td>
                </tr>

                <tr>
                  <td
                    colSpan={3}
                    style={{
                      borderTop: '2px dashed #9D9D9D',
                      outline: 'none',
                      borderBottom: 0,
                      borderLeft: 0,
                      borderRight: 0,
                      borderRadius: 0
                    }}
                  ></td>
                </tr>
                <tr className='total'>
                  <td colSpan={2}>Total</td>
                  <td>${plan?.price}</td>
                </tr>
              </table>
            )}
          </div>

          {/* {selectCardModal && (
            <Modal
              centered
              className="select-card-model"
              open={selectCardModal}
              onCancel={() => setAddCard(false)}
              footer={null}
              width={700}
            >
              <h2>Change Card Information</h2>
              <hr style={{ marginBottom: "20px" }} />
              <div className="select-card-container">
                <div className="header">
                  <h2>Payment Information</h2>
                  <hr />
                </div>
                <div className="cards-list">
                  {cards.map((details: any) => (
                    <div className="card-element" key={details.card.id}>
                      <div className="card-info">
                        <h4>Card Information</h4>
                        <hr />
                        <div className="card">
                          <div className="card-number">
                            <Radio.Group
                              options={[{ value: details.id, label: null }]}
                              value={Object.keys(cardSelection).find(
                                (key) => cardSelection[key]
                              )} // Bind to the selected card
                              onChange={(e) => {
                                setSelectedCard(e.target.value);
                                setCardSelection({
                                  [e.target.value]: true,
                                });
                                setPaymentMethod(e.target.value);
                              }} // Handle change
                            />
                            {ccIcon(details.card.brand)} &nbsp; **** **** ****{" "}
                            {details.card.last4}
                          </div>
                          <div className="card-expiry">
                            Expiry: {details.card?.exp_month}/
                            {details.card.exp_year}
                          </div>
                        </div>
                      </div>

                      <div className="billing-info">
                        <h4>Billing Information on Card</h4>
                        <hr />
                        <div className="billing-name">
                          <span>Company Name:</span>{" "}
                          {details.billing_details.name}
                        </div>
                        <div className="billing-email">
                          <span>Email:</span> {details.billing_details.email}
                        </div>
                        <div className="billing-address">
                          <span>Billing Address:</span>{" "}
                          {details.billing_details.address.line1}
                        </div>
                      </div>
                    </div>
                  ))}

                  {cards.length === 0 && (
                    <div className="no-cards">
                      <h4>You have not added card details yet. </h4>
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => {
                    navigate("/account?tab=3");
                  }}
                >
                  Add New Card
                </Button>
              </div>
              <div className="action-btns">
                <Button onClick={handleSelectedCard}>Save</Button>
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setSelectCardModal(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </Modal>
          )} */}

          {/* billing info container */}
          {/* <div className="billing-info-wrapper">
        <div className="header">
          <h2>Billing Information</h2>
          <Button>Add Billing Address</Button>
        </div>
        <hr />

        <div className="billing-info-container">
          {billingInfo ? (
            <div className="billing-info">
              <div className="billing-name">{billingInfo.name}</div>
              <div className="billing-address">{billingInfo.address}</div>
              <div className="billing-city">{billingInfo.city}</div>
              <div className="billing-country">{billingInfo.country}</div>
              <div className="billing-postal-code">
                {billingInfo.postalCode}
              </div>
            </div>
          ) : (
            <div className="no-billing-info">
              <h4>You have not added billing address yet. </h4>
            </div>
          )}
        </div>
      </div> */}
        </div>
      )}

      {/* only enable this button if card is already present */}

      {card?.last4 && (
        <Button
          className='btn-card-submit'
          // type="submit"
          disabled={disabled}
          onClick={handleSubmit}
          loading={paymentLoading}
          style={{ display: 'flex' }}
        >
          {source === 'add-on' ? `Purchase` : `Upgrade`}
        </Button>
      )}
    </div>
  );
}

export default Checkout;
