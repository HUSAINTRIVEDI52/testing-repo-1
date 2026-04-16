import React from 'react';
import { render } from '@testing-library/react';
import CreateStyleGuidePage from '../../src/pages/CreateStyleGuidePage/CreateStyleGuidePage'
import '@testing-library/jest-dom'

jest.mock('../../src/components/CreateStyleGuide/CreateStyleGuide.tsx', () => {
    return function Account() {
        return <div data-testid="account-component"></div>;
    };
});

describe('AccountPage', () => {
    it('renders the Account component', () => {
        const { getByTestId } = render(<CreateStyleGuidePage />);
        expect(getByTestId('account-component')).toBeInTheDocument();
    });
});