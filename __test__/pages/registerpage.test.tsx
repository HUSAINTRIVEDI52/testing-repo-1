import React from 'react';
import { render } from '@testing-library/react';
import RegisterPage from '../../src/pages/Register/RegisterPage'
import '@testing-library/jest-dom'

jest.mock('../../src/components/Auth/Register.tsx', () => {
    return function Account() {
        return <div data-testid="account-component"></div>;
    };
});

describe('AccountPage', () => {
    it('renders the Account component', () => {
        const { getByTestId } = render(<RegisterPage />);
        expect(getByTestId('account-component')).toBeInTheDocument();
    });
});