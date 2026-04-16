import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateAiPersona from '../../../src/components/CreateAiPersona/CreateAiPersona';
import CreateContenEditor from '../../../src/components/CreateContenEditor/CreateContenEditor';

jest.mock('../../../src/components/CreateContenEditor/CreateContenEditor', () => (props: any) => {
    return (
        <div>
            <input
                placeholder={props.inputPlaceholder}
                onChange={(e) => props.handleEditorChange(e.target.value)}
            />
            <div>{props.editorPlaceholder}</div>
        </div>
    );
});

describe('CreateAiPersona', () => {
    test('renders CreateContenEditor component with correct placeholders', () => {
        render(<CreateAiPersona />);
        expect(screen.getByPlaceholderText('Enter your persona here...')).toBeInTheDocument();
        expect(screen.getByText('Define your persona here...')).toBeInTheDocument();
    });

    test('calls handleEditorChange on input change', () => {
        const consoleSpy = jest.spyOn(console, 'log');
        render(<CreateAiPersona />);
        fireEvent.change(screen.getByPlaceholderText('Enter your persona here...'), { target: { value: 'New content' } });
        expect(consoleSpy).toHaveBeenCalledWith('content', 'New content');
    });

    test('initial content state is an empty string', () => {
        render(<CreateAiPersona />);
        const inputElement = screen.getByPlaceholderText('Enter your persona here...') as HTMLInputElement;
        expect(inputElement.value).toBe('');
    });
});