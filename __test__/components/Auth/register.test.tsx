import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { AxiosResponse } from 'axios';
import Register from '../../../src/components/Auth/Register'; // Adjust the import path as necessary

// Mock axios and useNavigate
jest.mock('axios');
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

// TypeScript requires explicit typing for mocked modules
const mockedAxios = axios as jest.Mocked<typeof axios>;
// const mockedNavigate = jest.fn();

describe('Register Component', () => {
    beforeEach(() => {
        mockedAxios.post.mockClear();
        mockNavigate.mockClear();
    });
    const setup = () => render(
        <BrowserRouter>
            <Register />
        </BrowserRouter>
    );

    test('validates password correctly', async () => {
        setup();
        const passwordInput = screen.getByPlaceholderText('Password');
        const submitButton = screen.getByRole('button', { name: 'Sign up' });

        // Test for short password
        fireEvent.change(passwordInput, { target: { value: 'hort' } });
        fireEvent.click(submitButton);
        await waitFor(() => expect(screen.getByText('At least 8 characters long')).toBeInTheDocument());

        // Test for missing numeric digit
        fireEvent.change(passwordInput, { target: { value: 'PasswordNoDigit' } });
        fireEvent.click(submitButton);
        await waitFor(() => expect(screen.getByText('At least one numeric digit')).toBeInTheDocument());

        // Test for missing lowercase letter
        fireEvent.change(passwordInput, { target: { value: 'PASSWORD1!' } });
        fireEvent.click(submitButton);
        await waitFor(() => expect(screen.getByText('At least one lowercase letter')).toBeInTheDocument());

        // Test for missing uppercase letter
        fireEvent.change(passwordInput, { target: { value: 'password1!' } });
        fireEvent.click(submitButton);
        await waitFor(() => expect(screen.getByText('At least one uppercase letter')).toBeInTheDocument());

        // Test for missing special character
        fireEvent.change(passwordInput, { target: { value: 'Password1' } });
        fireEvent.click(submitButton);
        await waitFor(() => expect(screen.getByText('At least one special character')).toBeInTheDocument());

        // Test for valid password
        fireEvent.change(passwordInput, { target: { value: 'ValidPassword1!' } });
        fireEvent.click(submitButton);
        await waitFor(() => expect(screen.queryByText('At least 8 characters long')).toBeNull());
        await waitFor(() => expect(screen.queryByText('At least one numeric digit')).toBeNull());
        await waitFor(() => expect(screen.queryByText('At least one lowercase letter')).toBeNull());
        await waitFor(() => expect(screen.queryByText('At least one uppercase letter')).toBeNull());
        await waitFor(() => expect(screen.queryByText('At least one special character')).toBeNull());
    }, 10000);



    test('submits form with valid data', async () => {
        mockedAxios.post.mockResolvedValue({
            status: 201,
            data: { message: 'user created', token: 'fakeToken', user: { id: '123' } },
        } as AxiosResponse);
        setup();
        const emailInput = screen.getByPlaceholderText('Enter your email address');
        const usernameInput = screen.getByPlaceholderText('Enter your full name');
        const passwordInput = screen.getByPlaceholderText('Password');
        const submitButton = screen.getByRole('button', { name: 'Sign up' });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(usernameInput, { target: { value: 'testUser' } });
        fireEvent.change(passwordInput, { target: { value: 'ValidPassword1!' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockedAxios.post).toHaveBeenCalled());
        expect(mockNavigate).toHaveBeenCalledWith('/onboarding');
    });
    test('validates email correctly', async () => {
        setup();
        const emailInput = screen.getByPlaceholderText('Enter your email address');
        const submitButton = screen.getByRole('button', { name: 'Sign up' });

        // Test for invalid email
        fireEvent.change(emailInput, { target: { value: 'invalidEmail' } });
        fireEvent.click(submitButton);
        await waitFor(() => expect(screen.getByText('Please enter Email')).toBeInTheDocument());

        // Test for empty email
        fireEvent.change(emailInput, { target: { value: '' } });
        fireEvent.click(submitButton);
        await waitFor(() => expect(screen.getByText('Please enter Email')).toBeInTheDocument());
    });

    test('validates username correctly', async () => {
        setup();
        const usernameInput = screen.getByPlaceholderText('Enter your full name');
        const submitButton = screen.getByRole('button', { name: 'Sign up' });

        // Test for empty username
        fireEvent.change(usernameInput, { target: { value: '' } });
        fireEvent.click(submitButton);
        await waitFor(() => expect(screen.getByText('Please enter Username')).toBeInTheDocument());
    });

    test('handles registration error', async () => {
        mockedAxios.post.mockRejectedValueOnce({ response: { data: { error: 'Registration failed' } } });
        setup();
        const emailInput = screen.getByPlaceholderText('Enter your email address');
        const usernameInput = screen.getByPlaceholderText('Enter your full name');
        const passwordInput = screen.getByPlaceholderText('Password');
        const submitButton = screen.getByRole('button', { name: 'Sign up' });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(usernameInput, { target: { value: 'testUser' } });
        fireEvent.change(passwordInput, { target: { value: 'ValidPassword1!' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(screen.getByText('Registration failed')).toBeInTheDocument());
    });
});