// OnboardingPage.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OnboardingPage from '../../src/pages/Onboarding/OnboardingPage';
import '@testing-library/jest-dom'

// Mock components
jest.mock('../../src/components/Onboarding/FirstStepOnboarding.tsx', () => () => <div>FirstStepOnboarding</div>);
jest.mock('../../src/components/Onboarding/SecondStepOnboarding', () => () => <div>SecondStepOnboarding</div>);
jest.mock('../../src/components/Onboarding/OnboardingIdentity', () => () => <div>OnboardingIdentity</div>);

// Mock useLocation hook
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
    useLocation: () => ({
        search: '?token=someToken&userId=123',
        state: { id: undefined }
    })
}));

describe('OnboardingPage', () => {
    // Mock localStorage.setItem
    beforeEach(() => {
        jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('sets token and userId in localStorage', () => {
        render(
            <MemoryRouter>
                <OnboardingPage />
            </MemoryRouter>
        );
        expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', 'someToken');
        expect(localStorage.setItem).toHaveBeenCalledWith('userId', '123');
    });





    test('renders OnboardingIdentity by default', () => {
        render(
            <MemoryRouter>
                <OnboardingPage />
            </MemoryRouter>
        );
        expect(screen.getByText('OnboardingIdentity')).toBeInTheDocument();
    });
});