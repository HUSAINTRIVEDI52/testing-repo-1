import React, { useState } from 'react';
import { Button, Dropdown, Menu, Input, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

interface InputField {
  type: 'text' | 'link' | 'file';
  value: string | undefined; // Allow undefined instead of null for the Input component
}

const DynamicInputFields: React.FC = () => {
  const [inputs, setInputs] = useState<InputField[]>([]);

  const handleMenuClick = ({ key }: { key: string }) => {
    // Add a new input configuration to the state
    setInputs((prev) => [...prev, { type: key as 'text' | 'link' | 'file', value: key === 'file' ? undefined : '' }]);
  };

  const handleInputChange = (index: number, value: string) => {
    setInputs((prev) => prev.map((input, i) => (i === index ? { ...input, value } : input)));
  };

  const handleFileUpload = (index: number, info: any) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
      handleInputChange(index, info.file.name); // Store file name or other metadata
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key='text'>Text</Menu.Item>
      <Menu.Item key='link'>Link</Menu.Item>
      <Menu.Item key='file'>File</Menu.Item>
    </Menu>
  );

  return (
    <div>
      <div style={{ marginTop: 20 }}>
        {inputs.map((input, index) => (
          <div key={index} style={{ marginBottom: 20 }}>
            {input.type === 'text' && (
              <>
                <label>Text</label>
                <Input
                  required
                  placeholder='Enter text'
                  value={input.value || ''}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                />
              </>
            )}
            {input.type === 'link' && (
              <>
                <label> Web URL </label>
                <Input
                  required
                  placeholder='Enter URL'
                  value={input.value || ''}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                />
              </>
            )}
            {input.type === 'file' && (
              <Upload name='file' action='/upload' onChange={(info) => handleFileUpload(index, info)}>
                <Button icon={<UploadOutlined />}>Click to Upload File</Button>
              </Upload>
            )}
          </div>
        ))}
      </div>
      <Dropdown overlay={menu} trigger={['click']}>
        <Button>Open Options</Button>
      </Dropdown>
    </div>
  );
};

export default DynamicInputFields;

// import React from 'react';
// import { Select } from 'antd';

// type DropdownWithOptionsProps = {
//   onChange: (value: string) => void;
// };

// const DropdownWithOptions: React.FC<DropdownWithOptionsProps> = ({ onChange }) => {
//   const options = [
//     { label: 'Web URL', value: 'webUrl' },
//     { label: 'Sample Text', value: 'sampleText' },
//     { label: 'Upload File', value: 'uploadFile' }
//   ];

//   return (
//     <Select
//       options={options}
//       placeholder='Select Input Type'
//       onChange={onChange} // Ensure onChange is used here
//       style={{ width: '100%' }}
//     />
//   );
// };

// export default DropdownWithOptions;
