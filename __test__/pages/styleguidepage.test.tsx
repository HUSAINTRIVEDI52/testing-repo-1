import React from 'react';
import { render } from '@testing-library/react';
import StyleGuidePage from '../../src/pages/StyleGuide/StyleGuidePage'
import '@testing-library/jest-dom'

jest.mock('../../src/components/StyleGuide/StyleGuide.tsx', () => {
    return function Account() {
        return <div data-testid="account-component"></div>;
    };
});

describe('AccountPage', () => {
    it('renders the Account component', () => {
        const { getByTestId } = render(<StyleGuidePage />);
        expect(getByTestId('account-component')).toBeInTheDocument();
    });
});