import React, { useState } from 'react';
import { Modal, Radio, Input, Button } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import './modal.scss';

const { TextArea } = Input;

interface PlanCancellationModalProps {
    isVisible: boolean;
    onClose: () => void;
    onConfirm: (reason: string, feedback: string) => void;
}

const PlanCancellationModal: React.FC<PlanCancellationModalProps> = ({ isVisible, onClose, onConfirm }) => {
    const [step, setStep] = useState(1);
    const [reason, setReason] = useState('');
    const [feedback, setFeedback] = useState('');
    const [experience, setExperience] = useState('');

    const experienceOptions = [
        'Very Satisfied',
        'Satisfied',
        'Neutral',
        'Dissatisfied',
        'Very Dissatisfied'
    ];

    const reasons = [
        { label: 'Started to use a different tool', value: 'switched_service' },
        { label: "Didn't use Bloggr.ai enough", value: 'unused' },
        { label: 'Bloggr.ai is too expensive', value: 'too_expensive' },
        { label: 'The platform was too complex', value: 'too_complex' },
        { label: "We need more features that Bloggr.ai doesn't have", value: 'missing_features' },
        { label: 'Other', value: 'other' }
    ];

    const handleNext = () => {
        if (step === 1) {
            if (experience) setStep(2);
        } else if (step === 2) {
            if (reason) setStep(3);
        } else {
            onConfirm(reason, `Experience: ${experience}\n\n${feedback}`);
        }
    };

    const resetAndClose = () => {
        setStep(1);
        setReason('');
        setFeedback('');
        setExperience('');
        onClose();
    };

    return (
        <Modal
            open={isVisible}
            onCancel={resetAndClose}
            footer={null}
            centered
            width={500}
            closable={false}
            bodyStyle={{ padding: 0 }}
            maskClosable={true}
        >
            <div className="cancel-plan-popup-wrapper">
                <div className="icon-wrapper">
                    <MessageOutlined style={{ fontSize: '32px', color: '#ff6600' }} />
                </div>

                <div className="title">
                    We value your feedback 🙂
                </div>

                <div className="description">
                    Please let us know the reason for cancellation.
                    <br />
                    This helps us improve our service.
                </div>

                <div className="progress-bar">
                    <div className={`step active`} />
                    <div className={`step ${step >= 2 ? 'active' : ''}`} />
                    <div className={`step ${step >= 3 ? 'active' : ''}`} />
                </div>

                <div className="content-body">
                    {step === 1 ? (
                        <>
                            <div className="question">How would you rate your overall experience?</div>
                            <div className="options-list">
                                <Radio.Group onChange={(e) => setExperience(e.target.value)} value={experience}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {experienceOptions.map((opt) => (
                                            <Radio key={opt} value={opt}>{opt}</Radio>
                                        ))}
                                    </div>
                                </Radio.Group>
                            </div>
                        </>
                    ) : step === 2 ? (
                        <>
                            <div className="question">What made you decide to cancel?</div>
                            <div className="options-list">
                                <Radio.Group onChange={(e) => setReason(e.target.value)} value={reason}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {reasons.map((r) => (
                                            <Radio key={r.value} value={r.value}>{r.label}</Radio>
                                        ))}
                                    </div>
                                </Radio.Group>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="question">Please write your thoughts here, we read everything...</div>
                            <TextArea
                                className="feedback-input"
                                placeholder="Write here..."
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                autoSize={{ minRows: 4, maxRows: 6 }}
                            />
                        </>
                    )}
                </div>

                <div className="btn-wrapper">
                    <button className="keep-plan-btn" onClick={resetAndClose}>
                        Keep my plan
                    </button>
                    <button
                        className={`submit-btn ${step !== 3 ? 'step-1' : ''}`}
                        onClick={handleNext}
                        disabled={(step === 1 && !experience) || (step === 2 && !reason) || (step === 3 && !feedback)}
                        style={((step === 1 && !experience) || (step === 2 && !reason) || (step === 3 && !feedback)) ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                    >
                        {step === 3 ? 'Submit' : 'Next'}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default PlanCancellationModal;
