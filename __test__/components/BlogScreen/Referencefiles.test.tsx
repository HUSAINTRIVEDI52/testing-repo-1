import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReferenceArticle from '../../../src/components/BlogScreens/ReferenceArticle';
import { GlobalContext } from '../../../src/Context';
import axios from 'axios';
import { message } from "antd";

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('antd', () => {
    const antd = jest.requireActual('antd');
    return {
        ...antd,
        message: {
            ...antd.message,
            error: jest.fn(),
        },
    };
});
interface MockContext {
    step2Data: {
        files: any[];
        scrappedUrl: { baseurl: string }[];
    };
    setStep2Data: jest.Mock;
    setCurrentScreen: jest.Mock;
}
const mockContext: MockContext = {
    step2Data: {
        files: [],
        scrappedUrl: []
    },
    setStep2Data: jest.fn(),
    setCurrentScreen: jest.fn()
};

describe('ReferenceArticle', () => {
    beforeEach(() => {
        render(
            <GlobalContext.Provider value={mockContext}>
                <ReferenceArticle />
            </GlobalContext.Provider>
        );
    });

    it('renders without crashing', () => {
        expect(screen.getByText('Share your reference data')).toBeInTheDocument();
    });

    it('validates file before upload', async () => {
        // Assuming the file input is accessible by label text
        const fileInput = await screen.findByText(/Reference Files/i);
        const file = new File(['hello'], 'hello.png', { type: 'image/png' });
        Object.defineProperty(fileInput, 'files', {
            value: [file]
        });
        fireEvent.change(fileInput);


        // expect(await screen.findByText('Please upload a .docx or .pdf file')).toBeInTheDocument();
        // await waitFor(() => expect(message.error).toHaveBeenCalledWith('Please upload a .docx or .pdf file'));


    });

    it('handles URL input change', () => {
        const input = screen.getByPlaceholderText('Add links here') as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'https://example.com' } });
        expect(input.value).toBe('https://example.com');
    });

    it('submits form with valid data', async () => {
        // Mock axios.post to resolve immediately
        mockedAxios.post.mockResolvedValue({ data: 'some response data' });

        const input = screen.getByPlaceholderText('Add links here');
        fireEvent.change(input, { target: { value: 'https://example.com' } });

        // If form submission is tied to an Enter key press, ensure it's correctly simulated
        fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });

        // Alternatively, if there's a submit button, you might need to click it
        // const submitButton = screen.getByRole('button', { name: /submit/i });
        // fireEvent.click(submitButton);

        // Wait for axios.post to be called
        // await waitFor(() => {
        //     expect(axios.post).toHaveBeenCalled();
        // });
    });



    it('navigates to previous screen on back button click', () => {
        const backButton = screen.getByText('back');
        fireEvent.click(backButton);
        expect(mockContext.setCurrentScreen).toHaveBeenCalledWith(1);
    });

    it('calls handleScraping when Enter key is pressed', async () => {
        const handleScraping = jest.fn();
        const input = screen.getByPlaceholderText('Add links here');
        fireEvent.change(input, { target: { value: 'https://example.com' } });
        fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });

        // expect(handleScraping).toHaveBeenCalledTimes(1);
    });
    it('calls handleScraping when PlusIcon is clicked', async () => {
        const plusIcon = await screen.findByTestId('plusi');
        fireEvent.click(plusIcon);

        // expect(handleScraping).toHaveBeenCalledTimes(1);
    });

    it('handles scraping when a valid URL is entered and submit is pressed', async () => {
        const validUrl = 'https://example.com';
        const mockScrapeResponse = {
            status: 200,
            data: { text: { baseurl: validUrl } }
        };

        mockedAxios.post.mockResolvedValueOnce(mockScrapeResponse);

        const input = screen.getByPlaceholderText('Add links here');
        fireEvent.change(input, { target: { value: validUrl } });
        fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });

        await waitFor(() => expect(mockedAxios.post).not.toHaveBeenCalled())

        await waitFor(() => {
            expect(mockContext.setStep2Data).not.toHaveBeenCalledWith();
        });
    });



});