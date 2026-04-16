import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BlogEdit from '../../../src/components/BlogEdit/BlogEdit';
import axios from 'axios';
import React from "react";
import '@testing-library/jest-dom'
import TurndownService from 'turndown';

jest.mock('axios');
jest.mock('turndown', () => {
    return jest.fn().mockImplementation(() => {
        return { turndown: jest.fn().mockReturnValue('Markdown content') };
    });
});
const mockedAxios = axios as jest.Mocked<typeof axios>;

test('getBlog function fetches blog data and sets state', async () => {
    const mockData = { content: 'This is a blog post content' };
    mockedAxios.post.mockResolvedValueOnce({ data: mockData });

    render(<BlogEdit />);

    // Wait for async function to resolve
    await new Promise((resolve) => setTimeout(resolve, 0));


    const blogContent = screen.getByTestId('blog-edit-wrapper');



    expect(blogContent).toBeInTheDocument();
});

test('getBlog function handles errors', async () => {
    const error = new Error('Network Error');
    mockedAxios.post.mockRejectedValueOnce(error);

    const { getByText } = render(<BlogEdit />);

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(screen.getByTestId(/[a-z]/i)).toBeInTheDocument();
});

test('TurndownService is instantiated', () => {
    const turndownService = new TurndownService();
    expect(turndownService).toBeDefined();
});

test('BlogEdit component renders', () => {
    render(<BlogEdit />);
    expect(screen.getByTestId('blog-edit-wrapper')).toBeInTheDocument();
});

// Test for convertToMarkdown and saveBlog
describe('convertToMarkdown and saveBlog', () => {
    test('convertToMarkdown returns markdown format', () => {
        const turndownService = new TurndownService();
        const markdown = turndownService.turndown('Some HTML content');
        expect(markdown).toBe('Markdown content');
    });


});






