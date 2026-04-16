import React, { useState, useRef } from 'react';
import { Modal, Input, Collapse, Button, Upload, message, List, Tooltip } from 'antd';
import {
    PlusOutlined,
    DeleteOutlined,
    LinkOutlined,
    FileTextOutlined,
    UploadOutlined,
    GlobalOutlined
} from '@ant-design/icons';
import Icon from '@ant-design/icons';
import { ReactComponent as DeleteSvg } from '../../assets/icons/delete.svg';
import axios from 'axios';
import './brand-voice.scss'; // Assuming we can use the same scss or I'll add styles inline/new class

const { Panel } = Collapse;
const { TextArea } = Input;

interface CreateBrandVoiceModalProps {
    visible: boolean;
    onCancel: () => void;
    setAnalyse: (val: boolean) => void;
    setLoader: (val: boolean) => void;
    setBrandVoice: (val: any) => void;
    setUpdate: (val: any) => void;
    update: boolean;
    setIsEditMode: (val: boolean) => void;
    setEdit: (val: boolean) => void;
    setFormData: (val: any) => void;
}

const CreateBrandVoiceModal: React.FC<CreateBrandVoiceModalProps> = ({
    visible,
    onCancel,
    setAnalyse,
    setLoader,
    setBrandVoice,
    setUpdate,
    update,
    setIsEditMode,
    setEdit,
    setFormData
}) => {
    const [name, setName] = useState('');
    const [urlInput, setUrlInput] = useState('');
    const [textInput, setTextInput] = useState('');
    const [fileList, setFileList] = useState<any[]>([]); // For Upload component state

    // Storing added items
    const [addedUrls, setAddedUrls] = useState<string[]>([]);
    const [addedTexts, setAddedTexts] = useState<string[]>([]);
    const [addedFiles, setAddedFiles] = useState<File[]>([]);

    const userId = localStorage.getItem('userId');

    const handleAddUrl = () => {
        if (!urlInput.trim()) return;
        const urlPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+\/?)([/?#].*)?$/i;
        if (!urlPattern.test(urlInput)) {
            message.error('Please enter a valid URL');
            return;
        }
        setAddedUrls([...addedUrls, urlInput]);
        setUrlInput('');
    };

    const handleAddText = () => {
        if (!textInput.trim()) return;
        setAddedTexts([...addedTexts, textInput]);
        setTextInput('');
    };

    const handleAddFile = (file: File) => {
        setAddedFiles([...addedFiles, file]);
        setFileList([]); // Processed manually, so clear upload list
        return false; // Prevent auto upload
    };

    const removeUrl = (index: number) => {
        const newUrls = [...addedUrls];
        newUrls.splice(index, 1);
        setAddedUrls(newUrls);
    };

    const removeText = (index: number) => {
        const newTexts = [...addedTexts];
        newTexts.splice(index, 1);
        setAddedTexts(newTexts);
    };

    const removeFile = (index: number) => {
        const newFiles = [...addedFiles];
        newFiles.splice(index, 1);
        setAddedFiles(newFiles);
    };

    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleAnalyse = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token || token === 'null' || token === 'undefined') {
            message.warning('Please log in to use the Brand Voice feature.');
            return;
        }

        if (!name.trim()) {
            message.error('Please input the name of the voice!');
            return;
        }
        if (addedUrls.length === 0 && addedTexts.length === 0 && addedFiles.length === 0) {
            message.error('User needs to provide at least one reference data');
            return;
        }

        try {
            setLoader(true);
            setIsLoading(true);
            // Prepare form data
            const formData = new FormData();
            formData.append('userId', userId || '');
            formData.append('name', name);

            // let inputType = '';
            // if (addedUrls.length > 0) inputType = 'link';
            // else if (addedTexts.length > 0) inputType = 'text';
            // else if (addedFiles.length > 0) inputType = 'file';

            // formData.append('inputType', inputType);

            // Logic matching BrandVoiceForm for inputType if needed, otherwise backend handles it.
            // BrandVoiceForm used the first input type found. Let's replicate or assume backend is robust.
            // Prioritizing based on what's added first or just sending 'link' if links exist, etc.

            let inputType = '';
            if (addedUrls.length > 0) inputType = 'link';
            else if (addedTexts.length > 0) inputType = 'text';
            else if (addedFiles.length > 0) inputType = 'file';
            formData.append('inputType', inputType);

            if (addedUrls.length > 0) formData.append('links', JSON.stringify(addedUrls));
            if (addedTexts.length > 0) formData.append('texts', JSON.stringify(addedTexts));
            if (addedFiles.length > 0) {
                addedFiles.forEach((file) => {
                    formData.append('file', file);
                });
            }

            const { data } = await axios.post(`${process.env.REACT_APP_SERVER_URL}/brand-voice-analyze`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setAnalysisResult(data);
            setLoader(false);
            setIsLoading(false);

        } catch (error: any) {
            console.error('Error:', error.message);
            message.error('Failed to analyse brand voice. Please try again.');
            setLoader(false);
            setIsLoading(false);
        }
    };

    const divRef = useRef<HTMLDivElement>(null);

    const handleSave = async () => {
        try {
            setLoader(true);
            setIsLoading(true);
            const contentToSave = divRef.current ? Array.from(divRef.current.querySelectorAll('li'))
                .map((li: any) => `- ${li.innerText.trim()}`)
                .join('\n') : (analysisResult?.analyzedVoice || '');

            let data = {
                content: contentToSave,
                userId,
                name: name
            };

            await axios.post(`${process.env.REACT_APP_SERVER_URL}/brand-voice`, data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json' // data is JSON now, not formData
                }
            });

            setUpdate(!update);
            onCancel();
            setLoader(false);
            setIsLoading(false);
            // Reset state
            setAnalysisResult(null);
            setName('');
            setUrlInput('');
            setTextInput('');
            setAddedUrls([]);
            setAddedTexts([]);
            setAddedFiles([]);
            setFileList([]);

        } catch (error: any) {
            console.error('Error saving:', error);
            message.error('Failed to save brand voice.');
            setLoader(false);
            setIsLoading(false);
        }
    };


    const customPanelStyle = {
        background: '#ffffff',
        borderRadius: 8,
        marginBottom: 16,
        border: '1px solid #E2E4E8',
        overflow: 'hidden',
    };

    return (
        <Modal
            open={visible}
            onCancel={() => {
                if (isLoading) return;
                onCancel();
                setAnalysisResult(null); // Reset analysis result when modal is closed
                setName('');
                setUrlInput('');
                setTextInput('');
                setAddedUrls([]);
                setAddedTexts([]);
                setAddedFiles([]);
                setFileList([]);
            }}
            footer={null}
            width={1200}
            centered
            maskClosable={!isLoading}
            closable={!isLoading}
            keyboard={!isLoading}
            title={analysisResult ? 'Start editing your brand voice' : 'Create Brand Voice'}
            className="create-brand-voice-modal"
        >
            {!analysisResult ? (
                <div className="modal-content-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingTop: '16px', minHeight: '600px' }}>
                    {/* Name Input */}
                    <div>
                        <div style={{ marginBottom: '8px', fontWeight: 600, fontSize: '16px', color: '#111827' }}>Name of Voice <span style={{ color: 'red' }}>*</span></div>
                        <Input
                            placeholder="Example: Bloggrai Brand Voice"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{ height: '48px', borderRadius: '10px' }}
                            disabled={isLoading}
                        />
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ marginBottom: '12px', fontWeight: 600, fontSize: '16px', color: '#111827' }}>Reference Content <span style={{ color: 'red' }}>*</span></div>
                        <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start', flex: 1 }}>
                            {/* Left: Collapse */}
                            <div style={{ flex: 1.2, minWidth: 0 }}>
                                <Collapse
                                    accordion
                                    defaultActiveKey={['1']}
                                    expandIconPosition="end"
                                    ghost
                                    className="brand-voice-collapse"
                                >
                                    <Panel header="Web URLs" key="1">
                                        <div style={{ color: '#6B7280', marginBottom: '12px', fontSize: '14px' }}>We'll scan website urls and analyze them</div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <Input
                                                placeholder="https://example.com"
                                                value={urlInput}
                                                onChange={(e) => setUrlInput(e.target.value)}
                                                disabled={isLoading}
                                                style={{ height: '44px', borderRadius: '8px' }}
                                            />
                                            <Button
                                                onClick={handleAddUrl}
                                                icon={<PlusOutlined />}
                                                disabled={!urlInput.trim() || isLoading}
                                                className="primary-btn"
                                                style={{ height: '44px', width: '80px' }}
                                            >
                                                Add
                                            </Button>
                                        </div>
                                    </Panel>
                                    <Panel header="Text Snippet" key="2">
                                        <div style={{ color: '#6B7280', marginBottom: '12px', fontSize: '14px' }}>Give us a detailed overview about your brand</div>
                                        <TextArea
                                            rows={4}
                                            placeholder="Write or paste text here"
                                            value={textInput}
                                            onChange={(e) => setTextInput(e.target.value)}
                                            style={{ marginBottom: '12px', resize: 'none', borderRadius: '8px' }}
                                            disabled={isLoading}
                                        />
                                        <Button
                                            onClick={handleAddText}
                                            icon={<PlusOutlined />}
                                            disabled={!textInput.trim() || isLoading}
                                            className="primary-btn"
                                            style={{ height: '44px', width: '80px' }}
                                        >
                                            Add
                                        </Button>
                                    </Panel>
                                    <Panel header="Upload Files" key="3">
                                        <div style={{ color: '#6B7280', marginBottom: '12px', fontSize: '14px' }}>Upload pdf files that clearly show and reflect your brand</div>
                                        <Upload
                                            beforeUpload={handleAddFile}
                                            fileList={[]}
                                            maxCount={1}
                                            accept='.txt,.pdf,.doc,.docx'
                                            disabled={isLoading}
                                        >
                                            <Button icon={<UploadOutlined />} disabled={isLoading} style={{ height: '44px', borderRadius: '8px', width: '100%' }}>Click to Upload</Button>
                                        </Upload>
                                    </Panel>
                                </Collapse>
                            </div>

                            {/* Right: List of items */}
                            <div className="reference-items-sidebar">
                                {(addedUrls.length === 0 && addedTexts.length === 0 && addedFiles.length === 0) ? (
                                    <div className="empty-state">
                                        <FileTextOutlined />
                                        <span>No items added yet.<br/><small style={{ fontWeight: 400 }}>Add URLs, text or files to get started.</small></span>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {addedUrls.map((url, idx) => (
                                            <div key={`url-${idx}`} className="added-item-card">
                                                <div className="item-icon"><GlobalOutlined /></div>
                                                <div className="item-content">
                                                    <div className="item-text">{url}</div>
                                                    <div className="item-type">Web URL</div>
                                                </div>
                                                    <Icon component={DeleteSvg} className='delete-icon' onClick={() => !isLoading && removeUrl(idx)} />
                                            </div>
                                        ))}
                                        {addedTexts.map((text, idx) => (
                                            <div key={`text-${idx}`} className="added-item-card">
                                                <div className="item-icon"><FileTextOutlined /></div>
                                                <div className="item-content">
                                                    <div className="item-text">{text}</div>
                                                    <div className="item-type">Text Snippet</div>
                                                </div>
                                                    <Icon component={DeleteSvg} className='delete-icon' onClick={() => !isLoading && removeText(idx)} />
                                            </div>
                                        ))}
                                        {addedFiles.map((file, idx) => (
                                            <div key={`file-${idx}`} className="added-item-card">
                                                <div className="item-icon"><LinkOutlined /></div>
                                                <div className="item-content">
                                                    <div className="item-text">{file.name}</div>
                                                    <div className="item-type">File</div>
                                                </div>
                                                    <Icon component={DeleteSvg} className='delete-icon' onClick={() => !isLoading && removeFile(idx)} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: 'auto' }}>
                        <Button
                            onClick={() => {
                                onCancel();
                                setName('');
                                setUrlInput('');
                                setTextInput('');
                                setAddedUrls([]);
                                setAddedTexts([]);
                                setAddedFiles([]);
                                setFileList([]);
                            }}
                            className="cancel-btn"
                            disabled={isLoading}
                            style={{ height: '48px', width: '140px' }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            onClick={handleAnalyse}
                            loading={isLoading}
                            disabled={!name.trim() || (addedUrls.length === 0 && addedTexts.length === 0 && addedFiles.length === 0) || isLoading}
                            className="primary-btn"
                            style={{ height: '48px', width: '140px' }}
                        >
                            Analyse
                        </Button>
                    </div>
                </div>
            ) : (
                // Analysis Result View
                <div className="analyse-content-result" style={{ paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '24px', minHeight: '600px' }}>
                    <div
                        ref={divRef}
                        contentEditable={!isLoading}
                        className="analyse-wrapper"
                        style={{
                           padding: '30px',
                           margin: 0,
                           height: '500px'
                        }}
                    >
                        <div className="analyse-content">
                           <div className="text-area" style={{ background: 'transparent', padding: 0 }}>
                              <div className="result-content">
                                 <ul>
                                    {analysisResult?.analyzedVoice?.split(/\r?\n|^- /gm)
                                          .filter((point: any) => point.trim() !== '' && point !== '-')
                                          .map((point: any, index: any) => (
                                             <li key={index}>{point.trim()}</li>
                                          ))
                                    }
                                 </ul>
                              </div>
                           </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: 'auto' }}>
                        <Button
                            onClick={() => {
                                setAnalysisResult(null); // Go back to input
                            }}
                            className="cancel-btn"
                            disabled={isLoading}
                            style={{ height: '48px', width: '140px' }}
                        >
                            Back
                        </Button>
                        <Button
                            type="primary"
                            onClick={handleSave}
                            loading={isLoading}
                            className="primary-btn"
                            style={{ height: '48px', width: '140px' }}
                        >
                            Save
                        </Button>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default CreateBrandVoiceModal;
