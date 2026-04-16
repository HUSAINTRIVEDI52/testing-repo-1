import React from 'react';
import { ReactComponent as LinkIcon } from '../../assets/icons/link.svg';
import './modal.scss';

export default function InternalLinkConfirmationModal({ setIsModalOpen, handleProceed }: any) {
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <div className='delete-popup-wrapper'>
            <div className='icon-wrapper'>
                <LinkIcon />
            </div>
            <div className='title'>
                Proceed without internal links?
            </div>
            <div className='description'>
                You have not provided any internal link. We will not add any link to blog. Do you want to proceed?
            </div>
            <div className='btn-wrapper'>
                <button onClick={handleCancel} className='cancel-btn'>
                    Stay
                </button>
                <button onClick={handleProceed} className='delete-btn'>
                    Proceed
                </button>
            </div>
        </div>
    );
}
