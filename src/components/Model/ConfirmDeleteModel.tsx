import React from 'react';
import { ReactComponent as DeleteIcon } from '../../assets/icons/delete.svg';
import './modal.scss';

export default function DeleteConfirmationModal({ setIsModalOpen, handleDelete, recordId }: any) {
  const handleCancel = async () => {
    setIsModalOpen(false);
  };
  const handleSubmit = async () => {
    handleDelete(recordId);
    setIsModalOpen(false);
  };
  return (
    <div className='delete-popup-wrapper'>
      <div className='icon-wrapper'>
        <DeleteIcon />
      </div>
      <div className='title'>
        Delete this item?
      </div>
      <div className='description'>
        This action cannot be undone. Once deleted, this item will be permanently removed.
      </div>
      <div className='btn-wrapper'>
        <button onClick={handleCancel} className='cancel-btn'>
          Cancel
        </button>
        <button onClick={handleSubmit} className='delete-btn'>
          Delete
        </button>
      </div>
    </div>
  );
}
