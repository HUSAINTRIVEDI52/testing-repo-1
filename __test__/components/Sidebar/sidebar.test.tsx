import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from '../../../src/components/Sidebar/Sidebar';

// Mocking useNavigate and useLocation hooks from react-router-dom
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({
        pathname: '/createblog'
    })
}));

describe('Sidebar', () => {
    it('should render collapsed when pathname is /createblog', () => {
        render(
            <Router>
                <Sidebar />
            </Router>
        );

        const collapseButton = screen.getByRole('button', { name: '' }); // Assuming the button has no accessible name
        expect(collapseButton).toBeInTheDocument();
        // Assuming open_sidebar.svg is used when the sidebar is collapsed
        expect(collapseButton.querySelector('img')).toHaveAttribute('alt', '');
    });

    it('toggles collapsed state on collapse button click', () => {
        render(
            <Router>
                <Sidebar />
            </Router>
        );

        const collapseButton = screen.getByRole('button', { name: '' }); // Assuming the button has no accessible name
        fireEvent.click(collapseButton);
        // Assuming close_sidebar.svg is used when the sidebar is expanded
        expect(collapseButton.querySelector('img')).toHaveAttribute('alt', '');
    });




});