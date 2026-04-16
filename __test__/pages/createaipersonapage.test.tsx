import React from 'react';
import { render } from '@testing-library/react';
import CreateAiPersonaPage from '../../src/pages/CreateAiPersona/CreateAiPersonaPage'
import '@testing-library/jest-dom'

jest.mock('../../src/components/CreateAiPersona/CreateAiPersona.tsx', () => {
    return function Account() {
        return <div data-testid="account-component"></div>;
    };
});

describe('AccountPage', () => {
    it('renders the Account component', () => {
        const { getByTestId } = render(<CreateAiPersonaPage />);
        expect(getByTestId('account-component')).toBeInTheDocument();
    });
});