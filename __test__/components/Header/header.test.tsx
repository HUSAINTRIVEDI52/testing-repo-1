// Header.test.js
import React from 'react';
import { render } from '@testing-library/react';
import Header from '../../../src/components/Header/Header'; // Adjust the import path as necessary
import { useLocation } from 'react-router-dom';
import '@testing-library/jest-dom'

// Import necessary types
import { Location } from 'history';

// Correctly mock useLocation with TypeScript casting
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
    useLocation: jest.fn<() => Location, []>(),
}));

describe('Header Component', () => {
    test('renders the logo and trial message', () => {
        (useLocation as jest.Mock).mockImplementation(() => ({
            pathname: '/',
            search: '', // Add other properties as needed
            state: {},
            hash: '',
        }));
        const { getByAltText, getByText } = render(<Header />);
        expect(getByAltText('logo')).toBeInTheDocument();
        expect(getByText(/5 days of trial left/)).toBeInTheDocument();
    });

    test('does not show upgrade buttons on non-excluded paths', () => {
        (useLocation as jest.Mock).mockImplementation(() => ({
            pathname: '/',
            search: '', // Add other properties as needed
            state: {},
            hash: '',
        }));
        const { queryByText } = render(<Header />);
        expect(queryByText('Upgrade Now')).not.toBeInTheDocument();
    });

    test('shows upgrade buttons on excluded paths', () => {
        (useLocation as jest.Mock).mockImplementation(() => ({
            pathname: '/blog-edit',
            search: '', // Add other properties as needed
            state: {},
            hash: '',
        }));
        const { getByText } = render(<Header />);
        expect(getByText('Upgrade Now')).toBeInTheDocument();
    });
});