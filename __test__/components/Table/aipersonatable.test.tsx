import React from 'react';
import { render, screen } from '@testing-library/react';
import AiPersonaTable from '../../../src/components/Table/AiPersonaTable';
import '@testing-library/jest-dom';

describe('AiPersonaTable', () => {
    it('renders the table with the correct data', () => {
        render(<AiPersonaTable />);
        expect(screen.getByText('Example Persona')).toBeInTheDocument();
        expect(screen.getByText('06/05/2024')).toBeInTheDocument();
        expect(screen.getByText('07/05/2024')).toBeInTheDocument();
    });



    it('renders without pagination', () => {
        render(<AiPersonaTable />);
        const pagination = screen.queryByRole('navigation', { name: /pagination/i });
        expect(pagination).not.toBeInTheDocument();
    });
});