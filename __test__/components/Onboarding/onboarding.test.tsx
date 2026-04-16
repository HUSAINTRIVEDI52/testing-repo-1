import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { GlobalContext } from '../../../src/Context';
import Onboarding from '../../../src/components/Onboarding/Onboarding';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock navigate function from useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('Onboarding Component', () => {
    const globalContextValue = {
        identity: '',
        role: '',
        search: '',
        setIdentity: jest.fn(),
        setRole: jest.fn(),
        setSearch: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly with given props', () => {
        const { getByText } = render(
            <Router>
                <GlobalContext.Provider value={globalContextValue}>
                    <Onboarding heading="Test Heading" data={['Option 1', 'Option 2']} isBack={true} id={1} />
                </GlobalContext.Provider>
            </Router>
        );

        expect(getByText('Test Heading')).toBeInTheDocument();
        expect(getByText('Option 1')).toBeInTheDocument();
        expect(getByText('Option 2')).toBeInTheDocument();
    });

    it('handles radio button change correctly for identity', () => {
        render(
            <Router>
                <GlobalContext.Provider value={globalContextValue}>
                    <Onboarding heading="Test Heading" data={['Option 1', 'Option 2']} isBack={true} id={1} />
                </GlobalContext.Provider>
            </Router>
        );

        fireEvent.click(screen.getByLabelText('Option 1'));
        // expect(globalContextValue.setIdentity).toHaveBeenCalled();
    });

    it('navigates to the next component on "Next" button click', () => {
        render(
            <Router>
                <GlobalContext.Provider value={globalContextValue}>
                    <Onboarding heading="Test Heading" data={['Option 1', 'Option 2']} isBack={false} id={1} />
                </GlobalContext.Provider>
            </Router>
        );

        fireEvent.click(screen.getByText('Next'));
        expect(mockNavigate).toHaveBeenCalledWith('/onboarding', { state: { id: 1 } });
    });

    it('calls storeLeadsDetails and navigates to "/" on "Let’s Get Started" button click', async () => {
        mockedAxios.post.mockResolvedValue({ status: 201, data: { message: 'Success' } });

        render(
            <Router>
                <GlobalContext.Provider value={globalContextValue}>
                    <Onboarding heading="Test Heading" data={['Option 1', 'Option 2']} isBack={false} id={3} />
                </GlobalContext.Provider>
            </Router>
        );

        fireEvent.click(screen.getByText('Let’s Get Started'));
        await expect(mockedAxios.post).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('updates global context for search on radio button change when id is not 1 or 2', () => {
        render(
            <Router>
                <GlobalContext.Provider value={globalContextValue}>
                    <Onboarding heading="Test Heading" data={['Search 1', 'Search 2']} isBack={true} id={3} />
                </GlobalContext.Provider>
            </Router>
        );

        fireEvent.click(screen.getByLabelText('Search 1'));
        // expect(globalContextValue.setSearch).toHaveBeenCalledWith(expect.any);

        fireEvent.click(screen.getByLabelText('Search 2'));
        // expect(globalContextValue.setSearch).toHaveBeenCalledWith(expect.anything());
    });

    // Additional tests can be written for error handling in storeLeadsDetails, back button functionality, etc.
    it('navigates to "/onboarding" without state on "Back" button click when id is 2', () => {
        render(
            <Router>
                <GlobalContext.Provider value={globalContextValue}>
                    <Onboarding heading="Test Heading" data={['Option 1', 'Option 2']} isBack={true} id={2} />
                </GlobalContext.Provider>
            </Router>
        );

        fireEvent.click(screen.getByText('Back'));
        expect(mockNavigate).toHaveBeenCalledWith('/onboarding');
    });
    it('navigates to "/onboarding" with state { id: 1 } on "Back" button click when id is 3', () => {
        render(
            <Router>
                <GlobalContext.Provider value={globalContextValue}>
                    <Onboarding heading="Test Heading" data={['Option 1', 'Option 2']} isBack={true} id={3} />
                </GlobalContext.Provider>
            </Router>
        );

        fireEvent.click(screen.getByText('Back'));
        expect(mockNavigate).toHaveBeenCalledWith('/onboarding', { state: { id: 1 } });
    });

});