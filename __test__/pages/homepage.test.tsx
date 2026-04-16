import React from 'react';
import { render } from '@testing-library/react';
import HomePage from '../../src/pages/Home/HomePage'
import '@testing-library/jest-dom'

jest.mock('../../src/components/Home/Home.tsx', () => {
    return function Account() {
        return <div data-testid="account-component"></div>;
    };
});

describe('AccountPage', () => {
    it('renders the Account component', () => {
        const { getByTestId } = render(<HomePage />);
        expect(getByTestId('account-component')).toBeInTheDocument();
    });
});