import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter, Router } from 'react-router-dom';
import CommonAuth from '../../../src/components/Auth/CommonAuth'; // Adjust the import path as necessary

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
}));

describe('CommonAuth component', () => {


    test('renders the logo, top-section-details, and google-login', () => {
        const { getByAltText, getByText } = render(
            <BrowserRouter>
                <CommonAuth />
            </BrowserRouter>
        );

        // Check that the logo is rendered
        const logo = getByAltText('logo');
        expect(logo).toBeInTheDocument();

        // Check that the top-section-details are rendered
        const topSectionDetails = getByText('Let\'s create account and start writing blogs.');
        expect(topSectionDetails).toBeInTheDocument();

        // Check that the google-login button is rendered
        const googleLoginButton = getByText('Continue with Google');
        expect(googleLoginButton).toBeInTheDocument();

        // Check that the divider is rendered
        const divider = getByText('or');
        expect(divider).toBeInTheDocument();
    });

    test('redirects to the google login page when the google-login button is clicked', () => {
        const { getByText } = render(
            <CommonAuth />
        );

        const googleButton = getByText('Continue with Google');
        fireEvent.click(googleButton);

        expect(window.location.href).toBe(`http://localhost/`);
    });
});