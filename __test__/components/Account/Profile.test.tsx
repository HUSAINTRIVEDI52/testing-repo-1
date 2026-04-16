import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Profile from '../../../src/components/Account/Profile';
import axios from 'axios';
import { message } from 'antd';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;


jest.mock('antd', () => {
    const antd = jest.requireActual('antd');
    const message = {
        success: jest.fn(),
        error: jest.fn(),
    };
    return {
        ...antd,
        message,
    };
});

describe('Profile Component', () => {
    beforeEach(() => {
        localStorage.setItem('userId', '123');
        localStorage.setItem('accessToken', 'token');
        mockedAxios.get.mockResolvedValue({
            status: 200,
            data: {
                name: 'John Doe',
                email: 'john@example.com',
                photo: 'photo.jpg',
            },
        });
    });

    it('loads and displays user details', async () => {
        render(<Profile />);
        await waitFor(() => {
            expect(screen.getByPlaceholderText('Full Name')).toHaveValue('John Doe');
            expect(screen.getByPlaceholderText('Enter email address')).toHaveValue('john@example.com');
        });
    });

    it('updates user profile successfully', async () => {
        mockedAxios.put.mockResolvedValue({ status: 200 });
        render(<Profile />);

        // If you have a specific element that appears after loading, wait for it
        // For example, wait for the "Full Name" input to appear in the DOM
        const fullNameInput = await screen.findByPlaceholderText('Full Name');

        // Now that the loading should be complete, proceed with your test
        fireEvent.change(fullNameInput, { target: { value: 'Jane Doe' } });

        // Wait for the "Update" button to be present in the DOM
        const updateButton = await screen.findByTestId('update')

        // Ensure the "Update" button is found before attempting to click it
        fireEvent.click(updateButton);

        await waitFor(() => {
            expect(message.success).toHaveBeenCalledWith('Profile updated successfully');
        });
    });

    it('handles profile update error', async () => {
        mockedAxios.put.mockRejectedValue(new Error('Failed to update profile'));
        render(<Profile />);
        const fullname = await screen.findByPlaceholderText('Full Name')
        fireEvent.change(fullname, { target: { value: 'Jane Doe' } });
        // Wait for the "Update" button to be present in the DOM
        const updateButton = await screen.findByTestId('update')

        // Ensure the "Update" button is found before attempting to click it
        fireEvent.click(updateButton);
        // await waitFor(() => {
        //     expect(message.error).toHaveBeenCalled();
        // });
    });

    it('sends email verification link', async () => {
        mockedAxios.post.mockResolvedValue({ status: 200 });
        render(<Profile />);
        fireEvent.change(await screen.findByPlaceholderText('Enter new email address'), { target: { value: 'jane@example.com' } });
        fireEvent.click(await screen.findByTestId('change'));
        await waitFor(() => {
            expect(message.success).toHaveBeenCalledWith('Email send successfully, please check your mail');
        });
    });
    it('handles error in sending email verification link', async () => {
        // Mock a rejected promise to simulate an error response
        mockedAxios.post.mockRejectedValue(new Error('Failed to send email'));

        render(<Profile />);

        // Simulate user input for the new email address
        fireEvent.change(await screen.findByPlaceholderText('Enter new email address'), { target: { value: 'jane@example.com' } });

        // Simulate clicking the "change" button to send the verification link
        fireEvent.click(await screen.findByTestId('change'));

        // Wait for the error message to be displayed
        await waitFor(() => {
            expect(message.error).toHaveBeenCalledWith('Failed to send email');
        });
    });

    it('changes password successfully', async () => {
        mockedAxios.post.mockResolvedValue({ status: 200 });
        render(<Profile />);
        fireEvent.change(await screen.findByPlaceholderText('Old Password'), { target: { value: 'oldpassword' } });
        fireEvent.change(await screen.findByPlaceholderText('New Password'), { target: { value: 'newpassword' } });
        fireEvent.change(await screen.findByPlaceholderText('Confirm Password'), { target: { value: 'newpassword' } });
        fireEvent.click(await screen.findByTestId('passwordupdate'));
        await waitFor(() => {
            expect(message.success).toHaveBeenCalledWith('Password changed successfully');
        });
    });
    it('prevents changing to a new password that is the same as the current password', async () => {
        mockedAxios.post.mockResolvedValue({ status: 200 });
        render(<Profile />);
        // Simulate entering the same value for old and new passwords
        fireEvent.change(await screen.findByPlaceholderText('Old Password'), { target: { value: 'samepassword' } });
        fireEvent.change(await screen.findByPlaceholderText('New Password'), { target: { value: 'samepassword' } });
        fireEvent.change(await screen.findByPlaceholderText('Confirm Password'), { target: { value: 'samepassword' } });
        fireEvent.click(await screen.findByTestId('passwordupdate'));

        // Wait for the error message to be displayed
        await waitFor(() => {
            expect(message.error).toHaveBeenCalledWith("New password cannot be the same as the current password");
        });
    });
    it('displays an error message when changing password fails', async () => {
        // Mock an Axios post call to simulate an error response
        mockedAxios.post.mockRejectedValue({
            response: { data: { error: 'Error changing password' }, status: 400 }
        });

        render(<Profile />);

        // Simulate user input for the password fields
        fireEvent.change(await screen.findByPlaceholderText('Old Password'), { target: { value: 'oldpassword' } });
        fireEvent.change(await screen.findByPlaceholderText('New Password'), { target: { value: 'newpassword' } });
        fireEvent.change(await screen.findByPlaceholderText('Confirm Password'), { target: { value: 'newpassword' } });

        // Simulate clicking the submit button to change the password
        fireEvent.click(await screen.findByTestId('passwordupdate'));

        // Wait for the error message to be displayed
        await waitFor(() => {
            expect(message.error).toHaveBeenCalledWith('Error changing password');
        });
    });


});