import React from 'react';
import { render } from '@testing-library/react';
import AccountPage from '../../src/pages/Account/AccountPage';
import '@testing-library/jest-dom'

// Mock the Account component
jest.mock('../../src/components/Account/Account', () => {
    return function Account() {
        return <div data-testid="account-component"></div>;
    };
});

describe('AccountPage', () => {
    it('renders the Account component', () => {
        const { getByTestId } = render(<AccountPage />);
        expect(getByTestId('account-component')).toBeInTheDocument();
    });
});