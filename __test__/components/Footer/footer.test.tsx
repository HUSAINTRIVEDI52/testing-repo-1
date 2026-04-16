// Assuming you are using React Testing Library and Jest for testing
import React from "react";
import { render } from '@testing-library/react';
import Footer from '../../../src/components/Footer/Footer'; // Adjust the import path as necessary
import '@testing-library/jest-dom'

describe('Footer component tests', () => {
    test('renders Footer component', () => {
        const { getByText } = render(<Footer />);
        const footerElement = getByText(/Footer/i);
        expect(footerElement).toBeInTheDocument();
    });
});