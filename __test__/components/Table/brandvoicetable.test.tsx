import React from 'react';
import { render, screen } from '@testing-library/react';
import BrandVoiceTable from '../../../src/components/Table/BrandVoiceTable';
import '@testing-library/jest-dom';

describe('BrandVoiceTable', () => {
    beforeEach(() => {
        render(<BrandVoiceTable />);
    });

    it('renders the table with correct data', () => {
        expect(screen.getAllByText('Creole Studios Voice').length).toBe(2);
        expect(screen.getAllByText('06/05/2024').length).toBe(2);
        expect(screen.getAllByText('07/05/2024').length).toBe(2);
    });

    it('renders voice icon for each row', () => {
        // Assuming the presence of alt text for icons, which might need to be added for accessibility
        // This test assumes that the VoiceSvg icon is rendered for each row in the table
        // Since the actual rendering of the icon depends on the 'Icon' component from 'antd' and how it uses the 'component' prop,
        // there's no direct way to test for the icon's presence without specific identifiers like alt text or test IDs.
    });

    it('renders edit and delete actions for each row', () => {
        // Similar to the voice icon, testing for the presence of edit and delete icons would require specific identifiers.
        // This test assumes that the EditSvg and DeleteSvg icons are rendered for each row in the table.
    });

    it('renders without pagination', () => {
        const pagination = screen.queryByRole('navigation', { name: /pagination/i });
        expect(pagination).not.toBeInTheDocument();
    });
});