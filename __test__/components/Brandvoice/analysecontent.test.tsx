import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnalyseContent from '../../../src/components/BrandVoice/AnalyseContent';
import { Button } from 'antd';

// Mocking antd Button component
jest.mock('antd', () => ({
    Button: ({ children, className }: any) => <button className={className}>{children}</button>,
}));

describe('AnalyseContent Component', () => {
    beforeEach(() => {
        render(<AnalyseContent />);
    });

    it('renders the component correctly', () => {
        expect(screen.getByText('Your analysed brand voice will appear here.')).toBeInTheDocument();
        // expect(screen.getByText('The writing style is professional and informative, with a clear focus on organization and accessibility.')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
        expect(screen.getByText('Save')).toBeInTheDocument();
    });

    it('has a cancel button with correct class', () => {
        const cancelButton = screen.getByText('Cancel');
        expect(cancelButton).toHaveClass('cancel');
    });

    it('has a save button without any specific class', () => {
        const saveButton = screen.getByText('Save');
        expect(saveButton).not.toHaveClass('cancel'); // Assuming 'cancel' is the only class that could be mistakenly applied
    });

    // Additional tests can be added to simulate user interactions if needed
});