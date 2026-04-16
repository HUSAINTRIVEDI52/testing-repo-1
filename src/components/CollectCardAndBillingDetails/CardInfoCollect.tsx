import {
  AddressElement,
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe
} from '@stripe/react-stripe-js';
import { Button, message, Input } from 'antd';
import React, { useState } from 'react';
import './card-billing.scss';
import axios from 'axios';

function CardInfoCollect({ setAddCard, source, setPaymentMethod, setShowSkeleton }: any) {
  // State to track errors for card information fields and payment status
  const [cardErrors, setCardErrors]: any = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    paymentFailed: false,
    errorMessage: ''
  });

  const [stripeElementActive, setStripeElementActive] = useState({
    cardNumber: false,
    expiryDate: false,
    cvc: false
  });

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

  // Function to handle input changes and update error states for card fields
  const handleCardInputChange = (event: any) => {
    if (event.elementType === 'cardNumber') {
      setCardErrors((prev: any) => ({
        ...prev,
        cardNumber: event?.error?.message ?? ''
      }));
    } else if (event.elementType === 'cardExpiry') {
      setCardErrors((prev: any) => ({
        ...prev,
        expiryDate: event?.error?.message ?? ''
      }));
    } else if (event.elementType === 'cardCvc') {
      setCardErrors((prev: any) => ({
        ...prev,
        cvc: event?.error?.message ?? ''
      }));
    }
  };

  // State to manage payment loading indicator while processing
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [saveBtnDisabled, setSaveBtnDisabled] = useState(false);

  // State to store billing information provided by the user
  const [billingDetails, setBillingDetails]: any = useState({});

  // Function to update billing details as the user types in input fields
  const handleBillingDetailsChange = (e: any) => {
    setBillingDetails({
      ...billingDetails,
      ...e
    });
  };

  const handleEmailChange = (e: any) => {
    setBillingDetails((prev: any) => ({
      ...prev,
      email: e.target.value
    }));
  };

  // Stripe hooks for handling payment flows
  const stripe = useStripe();
  const elements = useElements();

  // Get user ID from local storage (assuming the user is logged in)
  const userId = localStorage.getItem('userId');

  // Validate billing details
  const validateBillingDetails = () => {
    return billingDetails?.complete;
    // let errors: any = {};
    // if (!billingDetails.name) errors.name = "Company Name is required";
    // if (!billingDetails.email || !/\S+@\S+\.\S+/.test(billingDetails.email)) {
    //   errors.email = "A valid email address is required";
    // }
    // if (!billingDetails.address) errors.address = "Address is required";
    // if (!billingDetails.city) errors.city = "City is required";
    // if (!billingDetails.state) errors.state = "State is required";
    // if (!billingDetails.country) errors.country = "Country is required";
    // if (!billingDetails.postalCode)
    //   errors.postalCode = "Postal Code is required";
    // else if (!/^\d{6}(-\d{4})?$/.test(billingDetails.postalCode)) {
    //   errors.postalCode = "Invalid postal code";
    // }
    // setBillingErrors(errors);
    // return Object.keys(errors).length === 0;
  };

  // Handle form submission (card and billing details submission to Stripe)
  const handleSubmit = async (event: any) => {
    try {
      // Reset payment error state before submission
      setCardErrors((prev: any) => ({
        ...prev,
        paymentFailed: false
      }));

      event.preventDefault();
      setPaymentLoading(true);

      // Validate billing details
      if (!validateBillingDetails()) {
        setPaymentLoading(false);
        return;
      }

      // Check if Stripe and Elements are loaded before proceeding
      if (!stripe || !elements) {
        setPaymentLoading(false);
        return;
      }

      // Get the card element to be used for processing payment
      const cardElement = elements.getElement(CardNumberElement);
      if (!cardElement) {
        setPaymentLoading(false);
        return;
      }

      // Send request to the server to create a SetupIntent and get the client secret
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/create-intent`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      // Extract the client secret from the server response
      const { clientSecret } = await res.data;

      // Use Stripe to confirm the card setup with the client secret and card details
      const { error, setupIntent }: any = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            address: {
              ...billingDetails?.value?.address
            },
            email: billingDetails?.email,
            name: billingDetails?.value?.name
          }
        }
      });

      console.log('jhbvhvh');
      // If setup is successful, show a success message
      if (setupIntent?.status === 'succeeded') {
        setSaveBtnDisabled(true);
        message.info('Please wait while your card is being saved...');
        /// if the source if checkout page, set the payment method to retrive card and billing details in the checkout page
        if (source === 'checkout-page') {
          // setPaymentMethod(setupIntent?.payment_method);
          const urlParams = new URLSearchParams(window.location.search);
          const addCard = urlParams.get('addCard');

          if (addCard === 'true') {
            /// set the addCard to false after 2 seconds
            const url = new URL(window.location.href);
            url.searchParams.set('addCard', 'false'); // Update the param value
            window.history.replaceState(null, '', url.toString());
            setTimeout(() => {
              /// reload the page after 2 seconds
              window.location.reload();
            }, 2000);
          }
        } else if (setShowSkeleton) {
          /// used to show skeleton when adding card from billings tab
          setShowSkeleton(true);
        }

        setAddCard(false); // Close the card adding form
      } else if (error) {
        // If there's an error, display it to the user
        console.log(error);
        setCardErrors((prev: any) => ({
          ...prev,
          paymentFailed: true,
          errorMessage: error.message
        }));
      }

      setPaymentLoading(false);
    } catch (error: any) {
      // Display any error messages from the server (e.g., network error)
      message.error(error?.response?.data?.message);
      setPaymentLoading(false);
    } finally {
      // Ensure that the loading state is reset even after the request finishes
      setPaymentLoading(false);
    }
  };

  return (
    <div className='card-info-collect-container' style={{ width: source === 'checkout-page' ? '80%' : '100%' }}>
      <div>
        <h2>{source === 'checkout-page' ? 'Enter Card Information' : 'Add Billing Information'}</h2>
        <hr />
      </div>

      <div
        className='card-details-container'
        style={{
          border: source === 'checkout-page' ? '1px solid #eee' : 'none',
          borderRadius: source === 'checkout-page' ? '10px' : '0',
          padding: source === 'checkout-page' ? '20px' : '0'
        }}
      >
        <h4>Card Details</h4>
        <div className='card-details-element-container'>
          {/* Card number input field */}
          <div className='card-element'>
            <label htmlFor='card-no'>Card Number</label>
            <div>
              <div className={`stripe-element ${stripeElementActive?.cardNumber ? 'active' : ''}`}>
                <CardNumberElement
                  onChange={handleCardInputChange}
                  onFocus={() => {
                    setStripeElementActive({
                      cardNumber: true,
                      cvc: false,
                      expiryDate: false
                    });
                  }}
                  onBlur={() => {
                    setStripeElementActive({
                      ...stripeElementActive,
                      cardNumber: false
                    });
                  }}
                  id='card-no'
                />
              </div>
              {cardErrors.cardNumber && <div className='card-error cvc-error'>{cardErrors.cardNumber}</div>}
            </div>
          </div>

          {/* Card expiration date input field */}
          <div className='card-element'>
            <label htmlFor='card-expiry'>Card Expiration Date</label>
            <div>
              <div className={`stripe-element ${stripeElementActive?.expiryDate ? 'active' : ''}`}>
                <CardExpiryElement
                  onChange={handleCardInputChange}
                  onFocus={() => {
                    setStripeElementActive({
                      cardNumber: false,
                      cvc: false,
                      expiryDate: true
                    });
                  }}
                  onBlur={() => {
                    setStripeElementActive({
                      ...stripeElementActive,
                      expiryDate: false
                    });
                  }}
                  id='card-expiry'
                />
              </div>
              {cardErrors.expiryDate && <div className='card-error cvc-error'>{cardErrors.expiryDate}</div>}
            </div>
          </div>

          {/* Card CVC (security code) input field */}
          <div className='card-element'>
            <label htmlFor='card-cvc'>Security Code</label>
            <div className='card-cvc'>
              <div>
                <div className={`stripe-element ${stripeElementActive?.cvc ? 'active' : ''}`}>
                  <CardCvcElement
                    onChange={handleCardInputChange}
                    onFocus={() => {
                      setStripeElementActive({
                        expiryDate: false,
                        cardNumber: false,
                        cvc: true
                      });
                    }}
                    onBlur={() => {
                      setStripeElementActive({
                        ...stripeElementActive,
                        cvc: false
                      });
                    }}
                  />
                </div>
                {cardErrors.cvc && <div className='card-error cvc-error'>{cardErrors.cvc}</div>}
              </div>
            </div>
          </div>
        </div>

        {/* Billing Details Section */}
        <div className='billing-details-container'>
          <h4>Billing Address</h4>

          {/* <div className='billing-detail'>
            <label htmlFor='email'>Email Address</label>
            <div>
              <Input
                type='email'
                id='email'
                name='email'
                value={billingDetails.email}
                onChange={handleEmailChange}
                placeholder='support@bloggr.ai'
                onBlur={(e) => {
                  if (!billingDetails.email || !/\S+@\S+\.\S+/.test(e.target.value)) {
                    setBillingErrors((prev: any) => ({
                      ...prev,
                      email: 'A valid email address is required'
                    }));
                  } else {
                    setBillingErrors((prev: any) => ({
                      ...prev,
                      email: ''
                    }));
                  }
                }}
                required
              />
              {billingErrors.email && <div className='error-message'>{billingErrors.email}</div>}
            </div>
          </div> */}

          <AddressElement
            options={{
              mode: 'billing',
              display: {
                name: 'organization'
              }
            }}
            onChange={handleBillingDetailsChange}
          />
          {/* <div className="hr-row">
            <div className="billing-detail">
              <label htmlFor="name">Company Name</label>
              <Input
                type="text"
                id="name"
                name="name"
                value={billingDetails.name}
                onChange={handleBillingDetailsChange}
                required
              />
              {billingErrors.name && (
                <div className="error-message">{billingErrors.name}</div>
              )}
            </div>
            <div className="billing-detail">
              <label htmlFor="email">Email Address</label>
              <Input
                type="email"
                id="email"
                name="email"
                value={billingDetails.email}
                onChange={handleBillingDetailsChange}
                required
              />
              {billingErrors.email && (
                <div className="error-message">{billingErrors.email}</div>
              )}
            </div>
          </div> */}
          {/* <div className="billing-detail">
            <label htmlFor="address">Company Address</label>
            <Input
              type="text"
              id="address"
              name="address"
              placeholder="Address"
              value={billingDetails.address}
              onChange={handleBillingDetailsChange}
              required
            />
            {billingErrors.address && (
              <div className="error-message">{billingErrors.address}</div>
            )}
          </div>
          <div className="hr-row">
            <div className="billing-detail">
              <Input
                type="text"
                id="city"
                name="city"
                placeholder="City"
                value={billingDetails.city}
                onChange={handleBillingDetailsChange}
                required
              />
              {billingErrors.city && (
                <div className="error-message">{billingErrors.city}</div>
              )}
            </div>
            <div className="billing-detail">
              <Input
                type="text"
                id="state"
                name="state"
                placeholder="State"
                value={billingDetails.state}
                onChange={handleBillingDetailsChange}
                required
              />
              {billingErrors.state && (
                <div className="error-message">{billingErrors.state}</div>
              )}
            </div>
          </div>

          <div className="hr-row">
            <div className="billing-detail">
              <Input
                type="text"
                id="country"
                name="country"
                placeholder="Country eg. IN, US"
                value={billingDetails.country}
                onChange={handleBillingDetailsChange}
                required
              />
              {billingErrors.country && (
                <div className="error-message">{billingErrors.country}</div>
              )}
            </div>
            <div className="billing-detail">
              <Input
                type="text"
                id="postalCode"
                name="postalCode"
                placeholder="Postal Code"
                value={billingDetails.postalCode}
                onChange={handleBillingDetailsChange}
                required
              />
              {billingErrors.postalCode && (
                <div className="error-message">{billingErrors.postalCode}</div>
              )}
            </div>
          </div> */}
        </div>
      </div>

      {/* Legal Information */}
      <p>
        By providing your card information, you allow Bloggr.ai to charge your card for future payments in accordance
        with their terms.
      </p>

      {/* Button to submit the form */}
      <Button onClick={handleSubmit} disabled={saveBtnDisabled || !billingDetails?.complete} loading={paymentLoading}>
        Save
      </Button>

      {/* Display payment error message */}
      {cardErrors.paymentFailed && <div className='payment-error'>{cardErrors.errorMessage}</div>}
    </div>
  );
}

export default CardInfoCollect;
