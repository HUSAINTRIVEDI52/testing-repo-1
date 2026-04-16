import React from 'react';
import { render } from '@testing-library/react';
import MyBlogPage from '../../src/pages/MyBlog/MyBlogPage'
import '@testing-library/jest-dom'

jest.mock('../../src/components/MyBlog/MyBlog.tsx', () => {
    return function Account() {
        return <div data-testid="account-component"></div>;
    };
});

describe('AccountPage', () => {
    it('renders the Account component', () => {
        const { getByTestId } = render(<MyBlogPage />);
        expect(getByTestId('account-component')).toBeInTheDocument();
    });
});