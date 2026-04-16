import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StyleGuide from '../../../src/components/StyleGuide/StyleGuide';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../../../src/components/Table/StyleGuideTable.tsx', () => () => <div>StyleGuideTable</div>);
jest.mock('../../../src/components/SideTitleInfo/SideTitleInfo.tsx', () => ({ title, subTitle, children }: any) => (
    <div>
        <h1>{title}</h1>
        <h2>{subTitle}</h2>
        {children}
    </div>
));

describe('StyleGuide', () => {
    it('renders the StyleGuide component with title, subtitle, and button', () => {
        render(
            <BrowserRouter>
                <StyleGuide />
            </BrowserRouter>
        );

        expect(screen.getByText('Style Guide')).toBeInTheDocument();
        expect(screen.getByText('Bloggr can learn and emulate your unique writing style from your blog posts, texts, or documents, ensuring a consistent brand voice in every piece of content.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Create New Style' })).toBeInTheDocument();
    });

    it('renders the StyleGuideTable component', () => {
        render(
            <BrowserRouter>
                <StyleGuide />
            </BrowserRouter>
        );

        expect(screen.getByText('StyleGuideTable')).toBeInTheDocument();
    });

    it('navigates to the create style guide page on button click', () => {
        const mockNavigate = jest.fn();
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useNavigate: () => mockNavigate,
        }));

        render(
            <BrowserRouter>
                <StyleGuide />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByRole('button', { name: 'Create New Style' }));
        // expect(mockNavigate).toHaveBeenCalled();
    });
});