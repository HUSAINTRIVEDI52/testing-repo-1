import React from 'react';
import { render } from '@testing-library/react';
import BrandVoicePage from '../../src/pages/BrandVoice/BrandVoicePage';
import '@testing-library/jest-dom'

// Mock the Account component
jest.mock('../../src/components/BrandVoice/BrandVoice.tsx', () => {
    return function Account() {
        return <div data-testid="account-component"></div>;
    };
});

describe('AccountPage', () => {
    it('renders the Account component', () => {
        const { getByTestId } = render(<BrandVoicePage />);
        expect(getByTestId('account-component')).toBeInTheDocument();
    });
});