import React from 'react';
import { Modal } from 'antd';
import CreateAiPersona from './CreateAiPersona';

interface CreateAiPersonaModalProps {
    visible: boolean;
    onCancel: (val?: boolean) => void;
    setUpdate: (val: boolean) => void;
    update: boolean;
    setLoader?: (val: boolean) => void;
}

const CreateAiPersonaModal: React.FC<CreateAiPersonaModalProps> = ({ visible, onCancel, setUpdate, update, setLoader }) => {
    return (
        <Modal
            title="Add Blog Guideline"
            open={visible}
            onCancel={() => onCancel(false)}
            footer={null}
            width={800}
            className="create-brand-voice-modal"
        >
            <CreateAiPersona
                setEdit={onCancel}
                selectedData={null}
                setSelectedData={() => { }}
                setUpdate={setUpdate}
                update={update}
                setEditBlogGuide={() => { }}
                editBlogGuide={false}
                setLoader={setLoader}
            />
        </Modal>
    );
};

export default CreateAiPersonaModal;
