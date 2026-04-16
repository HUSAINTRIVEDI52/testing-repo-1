import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SideTitleInfo from '../../../src/components/SideTitleInfo/SideTitleInfo';

describe('SideTitleInfo', () => {
    it('renders the title and subtitle', () => {
        const title = 'Test Title';
        const subTitle = 'Test Subtitle';
        render(<SideTitleInfo title={title} subTitle={subTitle}>Test Children</SideTitleInfo>);

        expect(screen.getByText(title)).toBeInTheDocument();
        expect(screen.getByText(subTitle)).toBeInTheDocument();
    });

    it('renders the children content', () => {
        const title = 'Test Title';
        const subTitle = 'Test Subtitle';
        const childrenContent = 'This is children content';
        render(<SideTitleInfo title={title} subTitle={subTitle}>{childrenContent}</SideTitleInfo>);

        expect(screen.getByText(childrenContent)).toBeInTheDocument();
    });
});