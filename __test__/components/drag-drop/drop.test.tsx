// Import necessary testing utilities and the component to test
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Drop from '../../../src/components/drag-drop/Drop'; // Adjust the import path according to your project structure

// Mock 'react-beautiful-dnd' Droppable component
jest.mock('react-beautiful-dnd', () => ({
    Droppable: ({ children }: any) => children({
        droppableProps: {
            'data-testid': 'droppable',
        },
        innerRef: jest.fn(),
        placeholder: <div data-testid="placeholder"></div>,
    }),
}));

describe('Drop Component', () => {
    it('renders correctly with given props', () => {
        const { getByTestId } = render(
            <Drop id="drop1" type="TYPE">
                <div>Child Content</div>
            </Drop>
        );

        // Check if the component renders its children
        expect(getByTestId('droppable')).toContainHTML('Child Content');
        // Check if the placeholder is rendered
        expect(getByTestId('placeholder')).toBeInTheDocument();
    });

    // Add more tests here to cover other aspects or edge cases
});