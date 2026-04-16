import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import PrivateLayout from '../src/PublicLayout';

describe('PrivateLayout Component', () => {
    const mockNavigate = jest.fn();
    const mockUseLocation = jest.fn();

    jest.mock('react-router-dom', () => ({
        useNavigate: () => mockNavigate,
        useLocation: () => mockUseLocation(),
    }));

    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.removeItem('accessToken');
    });


    it('should not navigate if accessToken is found in localStorage', () => {
        localStorage.setItem('accessToken', 'test-token');
        mockUseLocation.mockReturnValue({ pathname: '/dashboard' });
        render(<PrivateLayout><div>Test Child</div></PrivateLayout>);
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should render children if accessToken is present', () => {
        localStorage.setItem('accessToken', 'test-token');
        mockUseLocation.mockReturnValue({ pathname: '/dashboard' });
        const { getByText } = render(<PrivateLayout><div>Test Child</div></PrivateLayout>);
        expect(getByText('Test Child')).toBeInTheDocument();
    });

    // it('should render Sidebar except on excluded paths', () => {
    //     localStorage.setItem('accessToken', 'test-token');
    //     mockUseLocation.mockReturnValue({ pathname: '/dashboard' });
    //     const { queryByTestId } = render(<PrivateLayout><div>Test Child</div></PrivateLayout>);
    //     expect(queryByTestId('sidebar')).toBeInTheDocument();
    // });

    it('should not render Sidebar on excluded paths', () => {
        localStorage.setItem('accessToken', 'test-token');
        mockUseLocation.mockReturnValue({ pathname: '/create-ai-persona' });
        const { queryByTestId } = render(<PrivateLayout><div>Test Child</div></PrivateLayout>);
        expect(queryByTestId('sidebar')).not.toBeInTheDocument();
    });
});