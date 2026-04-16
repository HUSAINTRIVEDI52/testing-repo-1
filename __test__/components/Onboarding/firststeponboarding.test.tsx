import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import FirstStepOnboarding from '../../../src/components/Onboarding/FirstStepOnboarding';
import Onboarding from '../../../src/components/Onboarding/Onboarding';
import { onboardingConfigs } from '../../../src/components/Onboarding/Onboarding.config';

// Mock the Onboarding component
jest.mock('../../../src/components/Onboarding/Onboarding', () => jest.fn(() => null));

describe('FirstStepOnboarding Component', () => {
    it('renders Onboarding with correct props from onboardingConfigs', () => {
        const config = onboardingConfigs[1]; // Assuming this is the config we're testing against

        render(<FirstStepOnboarding />);

        expect(Onboarding).toHaveBeenCalledWith({
            heading: config.heading,
            data: config.data,
            isBack: true,
            id: config.id,
        }, {});
    });
});