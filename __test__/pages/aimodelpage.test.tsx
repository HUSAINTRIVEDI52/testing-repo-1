import React from 'react';
import { render } from '@testing-library/react';
import AiModelPage from '../../src/pages/AiModel/AiModelPage';
import '@testing-library/jest-dom'

// Mock the Account component
jest.mock('../../src/components/AiModel/AiModel.tsx', () => {
    return function Account() {
        return <div data-testid="account-component"></div>;
    };
});

describe('AccountPage', () => {
    it('renders the Account component', () => {
        const { getByTestId } = render(<AiModelPage />);
        expect(getByTestId('account-component')).toBeInTheDocument();
    });
});