import React from 'react';
import { render } from '@testing-library/react';
import LoginPage from '../../src/pages/Login/LoginPage'
import '@testing-library/jest-dom'

jest.mock('../../src/components/Auth/Login.tsx', () => {
    return function Account() {
        return <div data-testid="account-component"></div>;
    };
});

describe('AccountPage', () => {
    it('renders the Account component', () => {
        const { getByTestId } = render(<LoginPage />);
        expect(getByTestId('account-component')).toBeInTheDocument();
    });
});