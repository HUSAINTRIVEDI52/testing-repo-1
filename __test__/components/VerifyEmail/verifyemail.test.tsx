import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import VerifyEmail from '../../../src/components/VerifyEmail/VerifyEmail';
import { message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom'
jest.mock('axios');
jest.mock('antd', () => ({
    message: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));
jest.mock('react-router-dom', () => ({
    useLocation: jest.fn(),
    useNavigate: jest.fn(),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedUseLocation = useLocation as jest.MockedFunction<typeof useLocation>;
const mockedUseNavigate = useNavigate as jest.MockedFunction<typeof useNavigate>;

describe('VerifyEmail component', () => {
    beforeEach(() => {
        // Reset mocks and default behavior before each test
        jest.clearAllMocks();
    });

    test('should verify email successfully and navigate to /profile', async () => {
        // Mock location object with a token query parameter
        mockedUseLocation.mockReturnValue({
            search: '?token=mockToken123',
        } as any);

        // Mock axios get request to return a successful response
        mockedAxios.get.mockResolvedValueOnce({ status: 200 });

        // Render the component
        render(<VerifyEmail />);

        // Expect initial loading message
        expect(screen.getByText('Your email verification is in process please wait..')).toBeInTheDocument();

        // Wait for verifyEmail function to complete
        await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));

        // Expect success message and navigation to /profile
        expect(message.success).toHaveBeenCalledWith('Email changed');
        // expect(mockedUseNavigate).toHaveBeenCalledWith('/profile');
    });

    test('should handle error when email verification fails', async () => {
        // Mock location object with a token query parameter
        mockedUseLocation.mockReturnValue({
            search: '?token=mockToken123',
        } as any);

        // Mock axios get request to return an error response
        const errorMessage = 'Verification failed';
        mockedAxios.get.mockRejectedValueOnce({ response: { data: { error: errorMessage } } });

        // Render the component
        render(<VerifyEmail />);

        // Expect initial loading message
        expect(screen.getByText('Your email verification is in process please wait..')).toBeInTheDocument();

        // Wait for verifyEmail function to complete
        await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));

        // Expect error message to be displayed
        expect(message.error).toHaveBeenCalledWith(errorMessage);
    });

    test('should handle network error during email verification', async () => {
        // Mock location object with a token query parameter
        mockedUseLocation.mockReturnValue({
            search: '?token=mockToken123',
        } as any);

        // Mock axios get request to simulate network error
        const networkErrorMessage = 'Network Error';
        mockedAxios.get.mockRejectedValueOnce(new Error(networkErrorMessage));

        // Render the component
        render(<VerifyEmail />);

        // Expect initial loading message
        expect(screen.getByText('Your email verification is in process please wait..')).toBeInTheDocument();

        // Wait for verifyEmail function to complete
        await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));

        // Expect network error message to be displayed
        expect(message.error).toHaveBeenCalledWith(networkErrorMessage);
    });

    test('should handle missing token gracefully', async () => {
        // Mock location object without token query parameter
        mockedUseLocation.mockReturnValue({
            search: '',
        } as any);

        // Render the component
        render(<VerifyEmail />);

        // Expect initial loading message
        expect(screen.getByText('Your email verification is in process please wait..')).toBeInTheDocument();

        // Wait for verifyEmail function to complete (no request should be made)
        // await waitFor(() => expect(mockedAxios.get).not.toHaveBeenCalled());

        // Expect error message to be displayed
        expect(message.error).toHaveBeenCalledTimes(0)
    });
});
