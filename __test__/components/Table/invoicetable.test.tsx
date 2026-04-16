import React from 'react';
import { render, screen } from '@testing-library/react';
import InvoiceTable from '../../../src/components/Table/InvoiceTable';
import '@testing-library/jest-dom';

describe('InvoiceTable', () => {
    beforeEach(() => {
        render(<InvoiceTable />);
    });

    it('renders the table with correct data', () => {
        expect(screen.getAllByText('#564456').length).toBe(2);
        expect(screen.getAllByText('01/06/2024').length).toBe(2);
        expect(screen.getByText('Pro')).toBeInTheDocument();
        expect(screen.getByText('Basic')).toBeInTheDocument();
        expect(screen.getByText('49$')).toBeInTheDocument();
        expect(screen.getByText('29$')).toBeInTheDocument();
        expect(screen.getByText('Pending')).toBeInTheDocument();
        expect(screen.getByText('Paid')).toBeInTheDocument();
    });

    it('renders invoice icon for each row', () => {
        // Assuming the presence of alt text for icons, which might need to be added for accessibility
        // This test assumes that the InvoiceSvg icon is rendered for each row in the table
        // Since the actual rendering of the icon depends on the 'Icon' component from 'antd' and how it uses the 'component' prop,
        // there's no direct way to test for the icon's presence without specific identifiers like alt text or test IDs.
    });

    it('renders download button for each row', () => {
        const downloadButtons = screen.getAllByText('Download');
        expect(downloadButtons.length).toBe(2);
        // This checks for the presence of the download button in each row but does not verify the functionality of the button.
    });

    it('renders without pagination', () => {
        const pagination = screen.queryByRole('navigation', { name: /pagination/i });
        expect(pagination).not.toBeInTheDocument();
    });
});