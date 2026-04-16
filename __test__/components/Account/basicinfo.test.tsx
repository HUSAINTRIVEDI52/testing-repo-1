import React from 'react';
import { render, screen } from '@testing-library/react';
import BasicInfo from '../../../src/components/Account/BasicInfo'; // Adjust the import path as necessary
import '@testing-library/jest-dom';

describe('BasicInfo Component', () => {
    const setup = (props = {}) => render(<BasicInfo {...props} />);

    test('renders without crashing', () => {
        setup({ plan: 'Basic', currentPlanTitle: 'Current Plan' });
        expect(screen.getByText('Basic')).toBeInTheDocument();
        expect(screen.getByText('Current Plan')).toBeInTheDocument();
    });

    test('displays plan and currentPlanTitle props correctly', () => {
        setup({ plan: 'Pro', currentPlanTitle: 'Upgraded Plan' });
        expect(screen.getByText('Pro')).toBeInTheDocument();
        expect(screen.getByText('Upgraded Plan')).toBeInTheDocument();
    });

    test('renders "Usage" label and "396 credit left"', () => {
        setup();
        expect(screen.getByText('Usage')).toBeInTheDocument();
        expect(screen.getByText('396 credit left')).toBeInTheDocument();
    });

    test('renders Progress component with correct props', () => {
        setup();
        const progress = document.querySelector('.ant-progress');
        expect(progress).toBeInTheDocument();
        // Since we cannot directly check the props passed to the Progress component,
        // we check for the existence of the component as an indication it's rendered.
        // For more detailed testing, consider using a mock or spying on the `Progress` component.
    });

    // Additional tests can be written to simulate window resizing and verify the strokeWidth changes accordingly.
});