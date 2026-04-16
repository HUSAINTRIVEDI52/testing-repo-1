import React from 'react';
import { render, fireEvent, waitFor, findByPlaceholderText, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TitleScreen from '../../../../src/components/BlogScreens/TitleScreen/TitleScreen';
import { GlobalContext } from '../../../../src/Context';
import axios from 'axios';
import { message } from 'antd';

jest.mock('axios');
const mockedAxiosPost = axios.post as jest.MockedFunction<typeof axios.post>;
jest.mock('antd', () => {
    const antd = jest.requireActual('antd');
    const message = { error: jest.fn() };
    return {
        ...antd,
        message,
    };
});
const step1Data = {
    topic: '',
    selectedLocation: '',
    primaryKeyword: '',
    title: '',
};
const mockSetCurrentScreen = jest.fn();
const mockSetStep1Data = jest.fn();

const globalContextValue = {
    step1Data: {
        topic: '',
        selectedLocation: '',
        primaryKeyword: '',
        title: '',
    },
    setStep1Data: mockSetStep1Data,
    setCurrentScreen: mockSetCurrentScreen,
};

describe('TitleScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('displays error message when topic and primary keyword are not entered and generate blog title button is clicked', async () => {
        mockedAxiosPost.mockRejectedValue(new Error('Please enter both topic and primary keyword'));
        const { getByText } = render(
            <GlobalContext.Provider value={globalContextValue}>
                <TitleScreen />
            </GlobalContext.Provider>
        );

        fireEvent.click(getByText(/Generate with AI/i));

        await waitFor(() => expect(message.error).toHaveBeenCalledWith('Please enter both topic and primary keyword'));
    });

    it('calls axios.post with correct values when generate blog title button is clicked', async () => {
        const mockData = {
            data: {
                title: ['Title 1', 'Title 2'],
            },
        };
        mockedAxiosPost.mockResolvedValue(mockData);

        const { getByText, getByPlaceholderText } = render(
            <GlobalContext.Provider value={{ ...globalContextValue, step1Data: { topic: 'AI', primaryKeyword: 'Healthcare' } }}>
                <TitleScreen />
            </GlobalContext.Provider>
        );

        fireEvent.change(getByPlaceholderText(/Example: AI in healthcare/i), { target: { value: 'AI' } });
        fireEvent.change(getByPlaceholderText(/Example: Generative AI in healthcare or AI in surgery etc/i), { target: { value: 'Healthcare' } });

        fireEvent.click(getByText(/Generate with AI/i));

        await waitFor(() => expect(axios.post).toHaveBeenCalledWith(
            `${process.env.REACT_APP_SERVER_URL}/generatetitle`,
            { topic: 'AI', primaryKeyword: 'Healthcare' },
            expect.anything()
        ));
    });
    it('renders topic input field', () => {

        const { getByPlaceholderText } = render(
            <GlobalContext.Provider value={{ step1Data, setStep1Data: jest.fn() }}>
                <TitleScreen />
            </GlobalContext.Provider>
        );
        expect(getByPlaceholderText('Example: AI in healthcare')).toBeInTheDocument();
    });

    it('calls onChange handler when topic input field changes', () => {
        const setStep1Data = jest.fn();
        const { getByPlaceholderText } = render(
            <GlobalContext.Provider value={{ step1Data, setStep1Data }}>
                <TitleScreen />
            </GlobalContext.Provider>
        );
        const topicInput = getByPlaceholderText('Example: AI in healthcare');
        fireEvent.change(topicInput, { target: { value: 'New topic' } });
        expect(setStep1Data).toHaveBeenCalledTimes(1);
    });

});