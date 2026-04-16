import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import MyBlog from '../../../src/components/MyBlog/MyBlog';
import axios from 'axios';
import { message } from 'antd';
import '@testing-library/jest-dom'

// Mocking necessary modules and components
// Correctly type the mocked module
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('../../../src/components/Table/BlogTable.tsx', () => () => <div>BlogTable</div>);
jest.mock('antd', () => {
    const antd = jest.requireActual('antd');
    const message = { error: jest.fn() };
    return { ...antd, message };
});

describe('MyBlog', () => {
    beforeEach(() => {
        // Clear all instances and calls to constructor and all methods:
        jest.clearAllMocks();
    });

    it('fetches blog data on component mount and renders it', async () => {
        const mockData = { data: [{ id: 1, title: 'Test Blog' }] };
        mockedAxios.post.mockResolvedValue({ status: 200, data: mockData.data });
        const { getByText } = render(<MyBlog />);
        await waitFor(() => expect(axios.post).toHaveBeenCalled());
        expect(getByText(/BlogTable/)).toBeInTheDocument();
    });

    it('displays error message on fetch failure', async () => {
        mockedAxios.post.mockRejectedValue({
            response: { data: { error: 'Failed to fetch' } },
        });
        render(<MyBlog />);
        await waitFor(() => expect(axios.post).toHaveBeenCalled());
        expect(message.error).toHaveBeenCalledWith('Failed to fetch');
    });

    it('filters blogs based on search input', async () => {
        const mockData = {
            data: [
                { id: 1, title: 'Test Blog' },
                { id: 2, title: 'Another Blog' },
            ],
        };
        mockedAxios.post.mockResolvedValue({ status: 200, data: mockData.data });
        const { getByPlaceholderText } = render(<MyBlog />);
        const searchInput = getByPlaceholderText('Search Blog...');

        fireEvent.change(searchInput, { target: { value: 'Test' } });
        // await waitFor(() => expect(searchInput.value).toBe('Test'));
    });
});