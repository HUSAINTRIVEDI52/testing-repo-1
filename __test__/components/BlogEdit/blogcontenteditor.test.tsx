import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BlogContentEditor from '../../../src/components/BlogEdit/BlogContentEditor';
import { GlobalContext } from '../../../src/Context';

describe('BlogContentEditor', () => {
    it('renders the editor', () => {
        const { getByRole } = render(<BlogContentEditor blogContent="" />);
        expect(getByRole('textbox', { hidden: true })).toBeInTheDocument();
    });

});