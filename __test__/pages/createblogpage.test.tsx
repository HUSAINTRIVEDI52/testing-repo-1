import React from 'react';
import { render } from '@testing-library/react';
import CreateBlogPage from '../../src/pages/CreateBlog/CreateBlogPage'
import '@testing-library/jest-dom'

jest.mock('../../src/components/CreateBlog/CreateBlog.tsx', () => {
    return function Account() {
        return <div data-testid="account-component"></div>;
    };
});

describe('AccountPage', () => {
    it('renders the Account component', () => {
        const { getByTestId } = render(<CreateBlogPage />);
        expect(getByTestId('account-component')).toBeInTheDocument();
    });
});