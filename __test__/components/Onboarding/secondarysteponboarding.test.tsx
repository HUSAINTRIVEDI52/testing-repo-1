import React from 'react';
import { render } from '@testing-library/react';
import SecondStepOnboarding from '../../../src/components/Onboarding/SecondStepOnboarding';
import { onboardingConfigs } from '../../../src/components/Onboarding/Onboarding.config';
import Onboarding from '../../../src/components/Onboarding/Onboarding';

// Mock the Onboarding component
jest.mock('../../../src/components/Onboarding/Onboarding', () => jest.fn(() => null));

describe('SecondStepOnboarding', () => {
    it('renders Onboarding component with correct props from onboardingConfigs for the second step', () => {
        render(<SecondStepOnboarding />);
        const secondConfig = onboardingConfigs[2];

        expect(Onboarding).toHaveBeenCalledWith({
            heading: secondConfig.heading,
            data: secondConfig.data,
            isBack: true,
            id: secondConfig.id,
        }, {});
    });
});