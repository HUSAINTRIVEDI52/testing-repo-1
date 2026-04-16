import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';
import PlagrismCheck from '../../../src/components/BlogEdit/PlagrismCheck';
import { GlobalContext } from '../../../src/Context';
import '@testing-library/jest-dom'

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock GlobalContext
const mockContext = {
    editorContent: '<p>Test content</p>',
};

describe('PlagrismCheck', () => {
    test('renders correctly', () => {
        const { getAllByText } = render(
            <GlobalContext.Provider value={mockContext}>
                <Router>
                    <PlagrismCheck blogId="123" />
                </Router>
            </GlobalContext.Provider>
        );
        // Use getAllByText and assert on the first element
        expect(getAllByText('Plagiarism Check')[0]).toBeInTheDocument();
    });
    test('handles button click and API success', async () => {
        mockedAxios.post.mockResolvedValue({
            status: 200,
            data: {
                details: {
                    allwordsmatched: '10',
                    allpercentmatched: '5%',
                    alltextmatched: 'Test plagiarised text',
                    allviewurl: '/test-url',
                },
            },
        });

        const { getByText, findByText } = render(
            <GlobalContext.Provider value={mockContext}>
                <Router>
                    <PlagrismCheck blogId="123" />
                </Router>
            </GlobalContext.Provider>
        );

        fireEvent.click(getByText('Check'));

        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalled();
        });

        expect(await findByText('10')).toBeInTheDocument();
        expect(await findByText('5%')).toBeInTheDocument();
        expect(await findByText('Test plagiarised text')).toBeInTheDocument();
        expect(await findByText('Link')).toBeInTheDocument();
    });

    test('handles API error', async () => {
        mockedAxios.post.mockRejectedValue({
            response: {
                data: {
                    error: 'Error message',
                },
            },
        });

        const { getByText } = render(
            <GlobalContext.Provider value={mockContext}>
                <Router>
                    <PlagrismCheck blogId="123" />
                </Router>
            </GlobalContext.Provider>
        );

        fireEvent.click(getByText('Check'));

        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalled();
        });

        // Assuming you have a way to display error messages, you would check for the error message here.
        // This is a placeholder as the implementation details for displaying errors are not provided.
        // Example: expect(await findByText('Error message')).toBeInTheDocument();
    });
});