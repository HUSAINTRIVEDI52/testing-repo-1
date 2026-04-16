// LetsStart.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LetsStart from '../../../src/components/LetsStart/LetsStart'; // Adjust the import path according to your project structure
import { useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mock useNavigate hook
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
    useNavigate: jest.fn(),
}));

describe('LetsStart Component', () => {
    it('renders correctly', () => {
        render(<LetsStart />, { wrapper: BrowserRouter });
        expect(screen.getByText(/Create your first blog with/i)).toBeInTheDocument();
        expect(screen.getByText(/AI generated, 100% unique and totally based on the input data/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Yes, lets start!/i })).toBeInTheDocument();
    });

    it('navigates to /createblog when the button is clicked', () => {
        const mockNavigate = jest.fn();
        (useNavigate as jest.Mock).mockImplementation(() => mockNavigate); // Type assertion here

        render(<LetsStart />, { wrapper: BrowserRouter });
        fireEvent.click(screen.getByRole('button', { name: /Yes, lets start!/i }));
        expect(mockNavigate).toHaveBeenCalledWith('/createblog');
    });
});