import React from 'react';
import './modal.scss';

export default function PriceSummary({ addOnDetails, totalPrice, setIsModalOpen }: any) {
  return (
    <div className='confirmation-content-wrapper'>
      <div className='confirmation-content-title'>
        <h2>Price Summary</h2>
      </div>
      <div className='confirmation-content'>
        <div className='plan-includes-table' style={{ width: '100%' }}>
          {addOnDetails?.map((item: any, index: number) => {
            return (
              <div className='plan-include-row' key={index}>
                <div className='row-left'>
                  <span>{item.name}</span>
                  <span>{item.value}</span>
                </div>
                <div className='item-price'>
                   {item.price !== undefined && <div className='row-right'>${item.price}</div>}
                </div>
              </div>
            );
          })}
          <div className='plan-include-price'>
            <div className='row-left'>Total</div>
            {addOnDetails && <div className='row-right'>${totalPrice}</div>}
          </div>
        </div>
      </div>
      <div className='btn-wrapper' style={{ justifyContent: 'center', marginTop: '20px' }}>
        <button onClick={() => setIsModalOpen(false)} className='cancel-btn'>
          Close
        </button>
      </div>
    </div>
  );
}
