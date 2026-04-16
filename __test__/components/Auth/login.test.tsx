import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from '../../../src/components/Auth/Login';
import '@testing-library/jest-dom'





jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate,
}));

describe('Login Component', () => {
    beforeEach(() => {
        mockedAxios.post.mockClear();
        mockedNavigate.mockClear();
    });

    test('renders login form', () => {
        render(
            <Router>
                <Login />
            </Router>
        );

        expect(screen.getByPlaceholderText('Enter your email address')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByText('Sign In')).toBeInTheDocument();
    });

    test('displays error message on failed login', async () => {
        mockedAxios.post.mockRejectedValue({
            response: { data: { error: 'Invalid credentials' } },
        });

        render(
            <Router>
                <Login />
            </Router>
        );

        fireEvent.change(screen.getByPlaceholderText('Enter your email address'), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText('Password'), {
            target: { value: 'password' },
        });

        fireEvent.click(screen.getByText('Sign In'));

        await waitFor(() =>
            expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
        );
    });

    test('navigates to home page on successful login', async () => {
        mockedAxios.post.mockResolvedValue({
            status: 200,
            data: { message: 'Login successful', token: 'fake-token', userId: 'user-123' },
        });

        render(
            <Router>
                <Login />
            </Router>
        );

        fireEvent.change(screen.getByPlaceholderText('Enter your email address'), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText('Password'), {
            target: { value: 'password' },
        });

        fireEvent.click(screen.getByText('Sign In'));

        await waitFor(() => {
            // expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', 'fake-token');
            // expect(localStorage.setItem).toHaveBeenCalledWith('userId', 'user-123');
            expect(mockedNavigate).toHaveBeenCalledWith('/');
        });
    });

    test('handles Google login button click', () => {
        const { getByText } = render(
            <Router>
                <Login />
            </Router>
        );

        const googleButton = getByText('Continue with Google');
        fireEvent.click(googleButton);

        expect(window.location.href).toBe(`http://localhost/`);
    });
});
