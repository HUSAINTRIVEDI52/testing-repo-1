import React from 'react';
import { render } from '@testing-library/react';
import OnboardingIdentity from '../../../src/components/Onboarding/OnboardingIdentity';
import { onboardingConfigs } from '../../../src/components/Onboarding/Onboarding.config';
import Onboarding from '../../../src/components/Onboarding/Onboarding';

// Mock the Onboarding component
jest.mock('../../../src/components/Onboarding/Onboarding', () => {
    return jest.fn(() => null);
});

describe('OnboardingIdentity', () => {
    it('renders Onboarding component with correct props from onboardingConfigs', () => {
        render(<OnboardingIdentity />);
        const firstConfig = onboardingConfigs[0];

        expect(Onboarding).toHaveBeenCalledWith({
            heading: firstConfig.heading,
            data: firstConfig.data,
            isBack: false,
            id: firstConfig.id,
        }, {});
    });
});