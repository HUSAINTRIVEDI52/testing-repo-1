import React from 'react';
import { ReactComponent as LogoutIcon } from '../../assets/icons/logout.svg';
import './modal.scss';

export default function SignOutConfirmationModal({ setIsModalOpen, handleSignOut }: any) {
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <div className='delete-popup-wrapper'>
            <div className='icon-wrapper'>
                <LogoutIcon />
            </div>
            <div className='title'>
                Leaving already?
            </div>
            <div className='description'>
                You are about to sign out of your account. Any unsaved changes will be lost.
            </div>
            <div className='btn-wrapper'>
                <button onClick={handleCancel} className='cancel-btn'>
                    Stay Logged in
                </button>
                <button onClick={handleSignOut} className='delete-btn'>
                    Sign Out
                </button>
            </div>
        </div>
    );
}
