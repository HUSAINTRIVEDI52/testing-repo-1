import React from 'react';
import { render, screen } from '@testing-library/react';
import ReferenceArticle from '../../../../src/components/BlogScreens/TitleScreen/ReferenceArticle';
import '@testing-library/jest-dom';

describe('ReferenceArticle Component', () => {
    beforeEach(() => {
        render(<ReferenceArticle />);
    });

    test('renders the main title correctly', () => {
        expect(screen.getByText('Share your reference data')).toBeInTheDocument();
    });

    test('renders the subtitle correctly', () => {
        expect(screen.getByText(/Share the most relevant and useful content for your blog./)).toBeInTheDocument();
    });

    test('renders the external URL section', () => {
        expect(screen.getByText('Reference External URLs')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Add links here')).toBeInTheDocument();
    });

    test('renders the upload files section', () => {
        expect(screen.getByText('Reference Files')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Upload Files from computer')).toBeInTheDocument();
    });

    test('renders the back and next buttons', () => {
        expect(screen.getByText('Back')).toBeInTheDocument();
        expect(screen.getByText('Next')).toBeInTheDocument();
    });

    test('renders the predefined link in the external URL section', () => {
        expect(screen.getByText('EXPLORING GPT4O: THE FUTURE OF MULTIMODAL AI')).toBeInTheDocument();
        expect(screen.getByText('https://www.creolestudios.com/exploring-gpt4o-future-mu')).toBeInTheDocument();
    });

    test('renders the predefined file in the upload files section', () => {
        expect(screen.getByText('Future of AI and Chat GPT.PDF')).toBeInTheDocument();
    });
});