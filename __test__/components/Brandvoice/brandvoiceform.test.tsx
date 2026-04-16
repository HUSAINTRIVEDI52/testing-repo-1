import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import BrandVoiceForm from '../../../src/components/BrandVoice/BrandVoiceForm';
import { message } from 'antd';
import '@testing-library/jest-dom'

jest.mock('antd', () => {
    const antd = jest.requireActual('antd');
    const message = { success: jest.fn(), error: jest.fn() };
    return {
        ...antd,
        message,
    };
});

describe('BrandVoiceForm', () => {
    test('renders correctly', () => {
        const { getByPlaceholderText, getByText } = render(<BrandVoiceForm />);
        expect(getByPlaceholderText('Example: Bloggr brand voice')).toBeInTheDocument();
        expect(getByPlaceholderText('Example:https://www.bloggr.ai')).toBeInTheDocument();
        expect(getByText('Upload Files from computer')).toBeInTheDocument();
    });

    test('submits form with correct values', async () => {
        const { getByPlaceholderText, getByText } = render(<BrandVoiceForm />);
        fireEvent.change(getByPlaceholderText('Example: Bloggr brand voice'), { target: { value: 'Test Voice' } });
        fireEvent.change(getByPlaceholderText('Example:https://www.bloggr.ai'), { target: { value: 'https://test.com' } });
        fireEvent.click(getByText('Analyse'));


    });

    test('displays success message on file upload done', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            json: jest.fn().mockResolvedValue({ status: 'done', file: { name: 'testFile.txt' } }),
            headers: new Headers(),
            ok: true,
            redirected: false,
            status: 200,
            statusText: 'OK',
            type: 'basic',
            url: '',
        });

        const { getByText } = render(<BrandVoiceForm />);
        fireEvent.click(getByText('Upload Files from computer'));


    });


});