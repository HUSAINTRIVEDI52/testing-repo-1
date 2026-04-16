import React from 'react';
import { render } from '@testing-library/react';
import BlogEditPage from '../../src/pages/BlogEdit/BlogEditPage';
import '@testing-library/jest-dom'

// Mock the Account component
jest.mock('../../src/components/BlogEdit/BlogEdit.tsx', () => {
    return function Account() {
        return <div data-testid="account-component"></div>;
    };
});

describe('AccountPage', () => {
    it('renders the Account component', () => {
        const { getByTestId } = render(<BlogEditPage />);
        expect(getByTestId('account-component')).toBeInTheDocument();
    });
});