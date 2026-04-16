import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, Dropdown, Menu, Upload, Tooltip } from 'antd';
import axios from 'axios';
import validateField from '../../utils/ValidateInput';
import { ReactComponent as PlusIcon } from '../../assets/icons/plus-primary.svg';
import { ReactComponent as DeleteSvg } from '../../assets/icons/delete.svg';
import Icon from '@ant-design/icons';
import { UploadOutlined } from '@ant-design/icons';

const BrandVoiceForm = ({
  setAnalyse,
  setLoader,
  loader,
  setBrandVoice,
  setUpdate,
  update,
  selectedRecord,
  setFormData,
  setIsEditMode,
  setSelectedRecord,
  backEvent
}: any) => {
  const userId = localStorage.getItem('userId');
  const [form] = Form.useForm();
  const [disableBtn, setDisableBtn] = useState(true);
  const [inputs, setInputs] = useState<
    { type: 'text' | 'link' | 'file'; value: string | File | undefined; touched: boolean }[]
  >([]);

  const onFinish = async (value: any) => {
    const token = localStorage.getItem('accessToken');
    if (!token || token === 'null' || token === 'undefined') {
      message.warning('Please log in to use the Brand Voice feature.');
      return;
    }

    let formFieldData = form.getFieldsValue().fields;
    if (!formFieldData) {
      message.error('User needs to provide at least one reference data');
    } else {
      try {
        // Determine the input type
        const inputType = inputs.find((input) => input.value) ? inputs[0].type : null;

        // Prepare the form data
        const formData = new FormData();

        const links: string[] = [];
        const texts: string[] = [];
        const files: File[] = [];
        formData.append('userId', userId || '');
        formData.append('name', value.voice);
        formData.append('inputType', inputType || '');

        formFieldData.forEach((input: any) => {
          if (input.type === 'link') {
            links.push(input.value || '');
          } else if (input.type === 'text') {
            texts.push(input.value || '');
          } else if (input.type === 'file' && input.value) {
            files.push(input.value);
          }
        });

        // Add structured data to formData
        if (links.length > 0) formData.append('links', JSON.stringify(links));
        if (texts.length > 0) formData.append('texts', JSON.stringify(texts));
        if (files.length > 0) {
          files.forEach((file, index) => {
            formData.append(`file`, file);
          });
        }
        setAnalyse(true);
        setLoader(true);

        const { data } = await axios.post(`${process.env.REACT_APP_SERVER_URL}/brand-voice-analyze`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        setFormData(formData);
        setIsEditMode(true);
        setUpdate(!update);
        setLoader(false);
        setBrandVoice(data);
      } catch (error: any) {
        console.error('Error:', error.message);
        message.error('Failed to analyse brand voice. Please try again.');
        setLoader(false);
      }
    }
  };

  useEffect(() => {
    if (selectedRecord) {
      form.setFieldsValue({
        voice: selectedRecord.name
      });
    }
  }, [selectedRecord, inputs, form]);

  return (
    <Form layout='vertical' form={form} onFinish={onFinish}>
      <div className='item-wrap title'>
        <Form.Item
          label='Name of Voice'
          name='voice'
          rules={[
            {
              required: true,
              message: 'Please input the name of the voice!',
              validator: validateField('voice', form, 'Voice Name')
            }
          ]}
        >
          <Input placeholder='Example: Bloggr brand voice' />
        </Form.Item>
      </div>
      <Form.List name='fields'>
        {(fields, { add, remove }) => {
          return (
            <div className='item-wrap input-data'>
              <h2>Reference Content</h2>
              {fields.map((field, index) => {
                const type = form.getFieldValue(['fields', field.name, 'type']);
                return (
                  <div className='item-row' key={field.key}>
                    {type === 'text' || type === 'link' ? (
                      <Form.Item
                        label={type === 'text' ? 'Text' : 'Web URL'}
                        name={[field.name, 'value']}
                        rules={[
                          { required: true },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!value.trim()) {
                                return Promise.reject(new Error('Input is required'));
                              } else if (getFieldValue(['fields', index, 'type']) === 'link') {
                                const urlPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+\/?)([/?#].*)?$/i;
                                if (!urlPattern.test(value)) {
                                  return Promise.reject(new Error('Please enter a valid URL'));
                                }
                              }
                              return Promise.resolve();
                            }
                          })
                        ]}
                      >
                        <Input placeholder={type === 'text' ? 'Enter text' : 'Enter URL'} />
                      </Form.Item>
                    ) : (
                      <Form.Item
                        label='Upload File'
                        name={[field.name, 'value']}
                        rules={[{ required: true, message: 'Please upload a file' }]}
                        valuePropName='file'
                        getValueFromEvent={(e) => e?.fileList?.[0]?.originFileObj}
                      >
                        <Upload
                          beforeUpload={() => false} // Prevent auto-upload
                          maxCount={1}
                          accept='.txt,.pdf,.doc,.docx'
                        >
                          <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                      </Form.Item>
                    )}

                    <Icon
                      component={DeleteSvg}
                      className='delete-icon'
                      onClick={() => {
                        remove(field.name);
                        setDisableBtn(!form.getFieldsValue().fields.length);
                      }}
                    />
                  </div>
                );
              })}
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item
                      key='text'
                      onClick={() => {
                        add({ type: 'text' });
                        setDisableBtn(!form.getFieldsValue().fields);
                      }}
                    >
                      Add Text
                    </Menu.Item>
                    <Menu.Item
                      key='link'
                      onClick={() => {
                        add({ type: 'link' });
                        setDisableBtn(!form.getFieldsValue().fields);
                      }}
                    >
                      Add Link
                    </Menu.Item>
                    <Menu.Item
                      key='file'
                      onClick={() => {
                        add({ type: 'file' });
                        setDisableBtn(!form.getFieldsValue().fields);
                      }}
                    >
                      Add File
                    </Menu.Item>
                  </Menu>
                }
                trigger={['click']}
                disabled={loader}
              >
                <Button className='dropdown-btn' disabled={loader}>
                  <Icon component={PlusIcon} /> Add
                </Button>
              </Dropdown>
            </div>
          );
        }}
      </Form.List>

      <Form.Item className='analyse-btn'>
        <div className='btn-wrapper'>
          <Button type='primary' htmlType='submit' disabled={disableBtn} loading={loader} style={{ height: '48px', width: '140px', borderRadius: '10px' }}>
            Analyse
          </Button>
          <Button onClick={backEvent} className='cancel-btn' disabled={loader} style={{ height: '48px', width: '120px', borderRadius: '10px' }}>
            Cancel
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default BrandVoiceForm;
