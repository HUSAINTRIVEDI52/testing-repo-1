import React from 'react';
import { render, screen } from '@testing-library/react';
import StyleGuideTable from '../../../src/components/Table//StyleGuideTable';
import '@testing-library/jest-dom';

describe('StyleGuideTable', () => {
    beforeEach(() => {
        render(<StyleGuideTable />);
    });

    test('renders the table', () => {
        expect(screen.getByRole('table')).toBeInTheDocument();
    });

    test('displays the correct style guide name', () => {
        expect(screen.getByText('Example Persona')).toBeInTheDocument();
    });

    test('displays the correct created date', () => {
        expect(screen.getByText('06/05/2024')).toBeInTheDocument();
    });

    test('displays the correct last edited date', () => {
        expect(screen.getByText('07/05/2024')).toBeInTheDocument();
    });


});