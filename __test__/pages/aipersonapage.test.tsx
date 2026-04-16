import React from 'react';
import { render } from '@testing-library/react';
import AiPersona from '../../src/pages/AiPersona/AiPersonaPage';
import '@testing-library/jest-dom'

// Mock the Account component
jest.mock('../../src/components/AiPersona/AiPersona.tsx', () => {
    return function Account() {
        return <div data-testid="account-component"></div>;
    };
});

describe('AccountPage', () => {
    it('renders the Account component', () => {
        const { getByTestId } = render(<AiPersona />);
        expect(getByTestId('account-component')).toBeInTheDocument();
    });
});