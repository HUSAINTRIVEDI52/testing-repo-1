import React from 'react';
import { render } from '@testing-library/react';
import VerifyEmailPage from '../../src/pages/VerifyEmailPage/VerifyEmailPage'
import '@testing-library/jest-dom'

jest.mock('../../src/components/VerifyEmail/VerifyEmail.tsx', () => {
    return function Account() {
        return <div data-testid="account-component"></div>;
    };
});

describe('AccountPage', () => {
    it('renders the Account component', () => {
        const { getByTestId } = render(<VerifyEmailPage />);
        expect(getByTestId('account-component')).toBeInTheDocument();
    });
});