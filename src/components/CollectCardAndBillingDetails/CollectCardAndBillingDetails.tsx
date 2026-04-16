import { Button, message, Modal, Radio, Skeleton } from 'antd';
import React, { useEffect, useState } from 'react';
import CardInfoCollect from './CardInfoCollect';
import axios from 'axios';
import { ccIcon } from '../../utils/CCIcon';
import closeIcon from '../../assets/icons/fontisto_close.svg';

function CollectCardAndBillingDetails() {
  /// state to store cards & billing info
  const [cards, setCards] = useState([]);
  const [billingInfo, setBillingInfo]: any = useState(null);
  const [showSkeleton, setShowSkeleton] = useState(true);

  /// handle add card click
  const [addCard, setAddCard] = useState(false);
  const handleAddCard = () => {
    setAddCard(!addCard);
  };

  // State to track the card selection (default card)
  const [cardSelection, setCardSelection] = useState<{
    [key: string]: boolean;
  }>({});

  const handleDefaultChange = (cardId: string) => {
    // Update the default card in the backend
    axios
      .put(
        `${process.env.REACT_APP_SERVER_URL}/payment-methods/default-card/${cardId}/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      )
      .then((res) => {
        message.success({ content: res?.data?.message, key: 'change-default-card' });
        // Reset all cards to false, then set the selected card to true
        setCardSelection((prevState) => {
          const updatedSelection = Object.keys(prevState).reduce((acc, id) => {
            acc[id] = id === cardId;
            return acc;
          }, {} as { [key: string]: boolean });

          return updatedSelection;
        });
      })
      .catch((error) => {
        message.error(error?.response?.data?.message);
      });
  };

  const userId = localStorage.getItem('userId');

  /// get user payment methods
  const getPaymentMethods = async () => {
    // fetch card details
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/payment-methods?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      .then((res) => {
        const defaultCardId = res?.data?.defaultCardId;
        setCards(res?.data?.cards);
        // Initialize card selection object
        const initialSelection = res?.data?.cards.reduce((acc: any, card: any) => {
          acc[card.id] = card.id === defaultCardId; // Set all cards to false initially except the default card

          return acc;
        }, {});
        setShowSkeleton(false);
        setCardSelection(initialSelection);
      })
      .catch((error) => {
        message.error(error?.response?.data?.message);
      });
  };

  if (showSkeleton === true) {
    /// get the card again after 3 seconds
    setTimeout(() => {
      getPaymentMethods();
    }, 3000);
  }

  return (
    <div className='cards-billing-wrapper'>
      {/* cards wrapper container  */}
      <div className='cards-wrapper'>
        <div className='header'>
          <h2>Card Information</h2>
          <Button onClick={handleAddCard}>Add</Button>
        </div>

        <hr />
        {showSkeleton && <Skeleton />}
        {!showSkeleton && (
          <div className='cards-list'>
            {cards.map((details: any) => (
              <div className='card-element' key={details.card.id}>
                <div className='card-info'>
                  <h4>Card Information</h4>
                  <hr />
                  <div className='card'>
                    <Radio.Group
                      options={[{ label: 'Default', value: details.id }]}
                      value={Object.keys(cardSelection).find((key) => cardSelection[key])} // Bind to the selected card
                      onChange={(e) => handleDefaultChange(e.target.value)} // Handle change
                    />
                    <div className='card-number'>
                      {ccIcon(details.card.brand)} &nbsp; **** **** **** {details.card.last4}
                    </div>
                    <div className='card-expiry'>
                      Expiry: {details.card?.exp_month}/{details.card.exp_year}
                    </div>
                  </div>
                </div>

                <div className='billing-info'>
                  <h4>Billing Information on Card</h4>
                  <hr />
                  <div className='billing-name'>
                    <span>Organization Name:</span> {details.billing_details.name}
                  </div>
                  {/* <div className='billing-email'>
                    <span>Email:</span> {details.billing_details.email}
                  </div> */}
                  <div className='billing-address'>
                    <span>Billing Address:</span> {details.billing_details.address.line1}
                  </div>
                </div>
              </div>
            ))}

            {cards.length === 0 && (
              <div className='no-cards'>
                <h4>You have not added card details yet. </h4>
              </div>
            )}
          </div>
        )}
      </div>

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

      {/* add card form */}
      {addCard && (
        <Modal
          centered
          className='keyword-model'
          open={addCard}
          // onCancel={() => setAddCard(false)}
          maskClosable={false}
          closeIcon={<img src={closeIcon} alt='closeIcon' onClick={() => setAddCard(false)} className='img-cancle' />}
          footer={null}
          width={700}
          transitionName='fade'
        >
          <CardInfoCollect setAddCard={setAddCard} setShowSkeleton={setShowSkeleton} />
        </Modal>
      )}
    </div>
  );
}

export default CollectCardAndBillingDetails;
