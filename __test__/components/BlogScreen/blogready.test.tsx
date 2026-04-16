import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BlogReady from '../../../src/components/BlogScreens/BlogReady';
import MarkdownContent from '../../../src/components/BlogScreens/MarkdownContent';

jest.mock('../../../src/components/BlogScreens/MarkdownContent', () => () => <div>Mocked Markdown Content</div>);

describe('BlogReady', () => {
    it('renders the component with a title, description, and MarkdownContent', () => {
        render(<BlogReady />);
        expect(screen.getByText('Your blog!')).toBeInTheDocument();
        expect(screen.getByText('define the topic to tailor your content for maximum impact')).toBeInTheDocument();
        expect(screen.getByText('Mocked Markdown Content')).toBeInTheDocument();
    });
});