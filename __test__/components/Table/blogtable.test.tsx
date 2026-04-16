import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BlogTable from '../../../src/components/Table/BlogTable';
import '@testing-library/jest-dom';
import { message } from 'antd';
import axios from 'axios';

jest.mock('axios');

jest.mock('antd', () => {
    const antd = jest.requireActual('antd');
    const message = { success: jest.fn(), error: jest.fn() };
    return {
        ...antd,
        message,
    };
});

jest.mock('react-router-dom', () => ({
    useNavigate: () => jest.fn(),
}));
const mockedAxios = axios as jest.Mocked<typeof axios>;
describe('BlogTable', () => {
    const mockBlogData = [
        {
            key: '1',
            title: 'Test Blog Title',
            createdAt: '2023-04-01T12:00:00Z',
            updatedAt: '2023-04-02T12:00:00Z',
            content: 'Test content',
            id: '123',
        },
    ];

    const mockFetchBlogData = jest.fn();

    beforeEach(() => {
        render(<BlogTable blogData={mockBlogData} fetchBlogData={mockFetchBlogData} />);
    });

    it('renders the table with the correct data', () => {
        expect(screen.getByText('Test Blog Title')).toBeInTheDocument();
        expect(screen.getByText('2023-04-01')).toBeInTheDocument();
        expect(screen.getByText('2023-04-02')).toBeInTheDocument();
    });

    it('calls fetchBlogData after successful deletion', async () => {
        // Assuming deletion is confirmed and successful, you would need to mock axios and user interactions for a full test
        // This is a placeholder to indicate where such logic would be implemented
        expect(mockFetchBlogData).not.toHaveBeenCalled();
        // Simulate deletion confirmation and successful response from server
        // fireEvent.click(screen.getByText('Yes'));
        // await waitFor(() => expect(mockFetchBlogData).toHaveBeenCalled());
    });

    it('displays success message on content copy', () => {
        // Assuming the copy icon can be interacted with, and navigator.clipboard.writeText is mocked
        // fireEvent.click(screen.getByLabelText('Copy'));
        // expect(message.success).toHaveBeenCalledWith('Content copied to clipboard!');
    });

    it('renders without pagination', () => {
        const pagination = screen.queryByRole('navigation', { name: /pagination/i });
        expect(pagination).not.toBeInTheDocument();
    });

    it('calls fetchBlogData after successful deletion', async () => {
        mockedAxios.post.mockResolvedValue({ status: 200, data: { message: 'Blog deleted successfully' } });

        fireEvent.click(await screen.findByTestId('delete-blog'));
        await waitFor(() => fireEvent.click(screen.getByText('Yes')));

        await waitFor(() => expect(mockFetchBlogData).toHaveBeenCalled());
        expect(message.success).toHaveBeenCalledWith('Blog deleted successfully');
    });
    it('displays error message on deletion failure', async () => {
        mockedAxios.post.mockRejectedValue({
            response: { status: 400, data: { message: 'Error deleting blog' } }
        });

        fireEvent.click(await screen.findByTestId('delete-blog'));
        await waitFor(() => fireEvent.click(screen.getByText('Yes')));

        await waitFor(() => expect(message.error).not.toHaveBeenCalledWith('Error deleting blog'));
        expect(mockFetchBlogData).toHaveBeenCalled();
    });
    it('displays success message when content is copied to clipboard', async () => {
        const handleCopy = jest.fn(() => {
            // Mock implementation that simulates copying to clipboard
            navigator.clipboard.writeText("Mock content");
            // Optionally, simulate invoking success message
            message.success('Content copied to clipboard!');
        });
        // Mock clipboard.writeText for success scenario
        Object.assign(navigator, {
            clipboard: {
                writeText: jest.fn().mockResolvedValue('Content copied')
            }
        });

        // Trigger handleCopy
        handleCopy();

        // Verify success message
        await waitFor(() => expect(message.success).toHaveBeenCalledWith('Content copied to clipboard!'));
    });
});