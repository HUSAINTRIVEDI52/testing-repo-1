// Import necessary libraries and components for testing
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateStyleGuide from '../../../src/components/CreateStyleGuide/CreateStyleGuide'; // Adjust the import path as necessary
import CreateContenEditor from '../../../src//components/CreateContenEditor/CreateContenEditor'; // Ensure this is correctly imported for mocking

// Mock the CreateContenEditor component to isolate the test environment
jest.mock('../../../src//components/CreateContenEditor/CreateContenEditor', () => (props: any) => (
    <div>
        <input
            placeholder={props.inputPlaceholder}
            onChange={(e) => props.handleEditorChange(e.target.value)}
        />
        <textarea
            placeholder={props.editorPlaceholder}
            ref={props.editorRef}
            defaultValue={props.initialContent}
            onChange={(e) => props.setInitialContent(e.target.value)}
        />
    </div>
));

describe('CreateStyleGuide Component', () => {
    test('renders input and textarea with correct placeholders', () => {
        render(<CreateStyleGuide />);
        expect(screen.getByPlaceholderText('Enter your style name here...')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Define your style here...')).toBeInTheDocument();
    });

    test('calls handleEditorChange on input change', () => {
        const logSpy = jest.spyOn(console, 'log');
        render(<CreateStyleGuide />);
        const input = screen.getByPlaceholderText('Enter your style name here...');
        fireEvent.change(input, { target: { value: 'New Style Name' } });
        expect(logSpy).toHaveBeenCalledWith('content', 'New Style Name');
    });

    test('updates initialContent state on textarea change', () => {
        render(<CreateStyleGuide />);
        const textarea = screen.getByPlaceholderText('Define your style here...');
        fireEvent.change(textarea, { target: { value: 'Style Definition' } });
        expect(textarea).toHaveValue('Style Definition');
    });
});