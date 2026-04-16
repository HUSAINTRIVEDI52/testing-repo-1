import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AiPersona from '../../../src/components/AiPersona/AiPersona'; // Adjust the import path based on your file structure
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom'
import AiPersonaTable from '../../../src/components/Table/AiPersonaTable'; // Adjust the import path based on your file structure

// Mock the Account component
jest.mock('../../../src/components/Table/AiPersonaTable', () => {
    return function Account() {
        return <div data-testid="ai-persona-table"></div>;
    };
});
describe('AiPersona Component', () => {
    it('renders AiPersona component', () => {
        render(
            <Router>
                <AiPersona />
            </Router>
        );

        // Check if the component renders correctly
        expect(screen.getByText('AI Persona')).toBeInTheDocument();
        expect(screen.getByText('Bloggr can learn and emulate your unique writing style from your blog posts, texts, or documents, ensuring a consistent brand voice in every piece of content.')).toBeInTheDocument();
        expect(screen.getByText('Create New Persona')).toBeInTheDocument();
    });

    it('navigates to create-ai-persona on button click', () => {
        const { getByText } = render(
            <Router>
                <AiPersona />
            </Router>
        );

        // Simulate button click
        fireEvent.click(getByText('Create New Persona'));

        // Check if navigation occurred
        expect(window.location.pathname).toBe('/create-ai-persona');
    });

    it('renders AiPersonaTable component', () => {
        render(
            <Router>
                <AiPersonaTable />
            </Router>
        );

        // Check if AiPersonaTable component renders
        expect(screen.getByTestId('ai-persona-table')).toBeInTheDocument();
    });
});
