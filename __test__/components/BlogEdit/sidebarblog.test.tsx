import React from 'react';
import { render } from '@testing-library/react';
import SidebarBlog from '../../../src/components/BlogEdit/SidebarBlog';
import '@testing-library/jest-dom'

describe('SidebarBlog Component', () => {
    test('renders with data', () => {
        const testData = [
            { title: 'Blog Title 1', description: 'Description 1' },
            { title: 'Blog Title 2', description: 'Description 2' },
        ];

        const { getByText } = render(<SidebarBlog data={testData} />);

        // Check that each blog item is rendered
        testData.forEach(item => {
            expect(getByText(item.title)).toBeInTheDocument();
            expect(getByText(item.description)).toBeInTheDocument();
        });
    });

    test('renders correctly without data', () => {
        const { container } = render(<SidebarBlog data={[]} />);

        // Check that no blog items are rendered
        const sidebarItems = container.querySelectorAll('.sidebar-blog-item');
        expect(sidebarItems.length).toBe(0);
    });

    test('renders correctly with undefined data', () => {
        const { container } = render(<SidebarBlog data={undefined} />);

        // Check that no blog items are rendered
        const sidebarItems = container.querySelectorAll('.sidebar-blog-item');
        expect(sidebarItems.length).toBe(0);
    });
});
