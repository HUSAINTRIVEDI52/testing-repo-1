import React from 'react';
import SideTitleInfo from '../SideTitleInfo/SideTitleInfo';
import { Form, Select } from 'antd';
import './ai-model.scss';
import Icon from "@ant-design/icons/lib/components/Icon";
import { ReactComponent as DownIcon } from "../../assets/icons/Property 1=material-symbols_arrow-drop-down.svg";
import { ReactComponent as ChatGptIcon } from "../../assets/icons/chat-gpt.svg";

const AiModel = () => {

    const [form] = Form.useForm();

    const handleChange = (value: string) => {
    };

    const onFinish = (value: any) => {

    }

    return (
        <div className='side-content-wrapper'>
            <SideTitleInfo title="AI Model" subTitle="Bloggr can learn and emulate your unique writing style from your blog posts, texts, or documents, ensuring a consistent brand voice in every piece of content." />
            <div className='ai-model-wrapper'>
                <Form layout='vertical' form={form} onFinish={onFinish}>
                    <Form.Item label="AI Model Name" name={"ai-model"}>
                        <Select
                            defaultValue="1"
                            onChange={handleChange}
                            suffixIcon={<Icon component={DownIcon} />}
                            popupClassName='ai-model-popup'
                            options={[
                                { value: '1', label: <> <Icon component={ChatGptIcon} /> <span>Chat GPT</span></> },
                                { value: '2', label: <> <Icon component={ChatGptIcon} /> <span>Chat GPT 2.o</span></> },
                                { value: '3', label: <> <Icon component={ChatGptIcon} /> <span>Chat GPT 2.1</span></> },
                            ]}
                        />
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default AiModel;