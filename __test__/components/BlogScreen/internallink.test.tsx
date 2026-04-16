import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import InternalLink from '../../../src/components/BlogScreens/InternalLink';
import { GlobalContext } from "../../../src/Context";
import { message } from "antd";
import { MemoryRouter } from 'react-router-dom';

jest.mock('antd', () => {
    const antd = jest.requireActual('antd');
    return {
        ...antd,
        message: {
            ...antd.message,
            error: jest.fn(),
        },
    };
});

describe('InternalLink Component', () => {
    const mockStep4Data: any = {
        links: []
    };

    const mockSetStep4Data = jest.fn();
    const mockSetCurrentScreen = jest.fn();

    beforeEach(() => {
        render(
            <MemoryRouter>
                <GlobalContext.Provider value={{
                    step4Data: mockStep4Data,
                    setStep4Data: mockSetStep4Data,
                    setCurrentScreen: mockSetCurrentScreen
                }}>
                    <InternalLink />
                </GlobalContext.Provider>
            </MemoryRouter>
        );
    });
    test('should display error message when trying to add more than 5 links', async () => {
        // Mock step4Data with 5 links
        mockStep4Data.links = new Array(5).fill({ keyword: 'test', link: 'http://test.com' });

        fireEvent.click(await screen.findByTestId('plus-icon'));


        // Wait for the error message to be called
        await waitFor(() => expect(message.error).toHaveBeenCalledWith('You can only add up to 5 links'));
    });

    test('should display error message for duplicate keyword', async () => {
        // Mock step4Data with a link
        mockStep4Data.links = [{ keyword: 'test', link: 'http://test.com' }];

        fireEvent.change(screen.getByPlaceholderText('Key word'), { target: { value: 'test' } });
        fireEvent.change(screen.getByPlaceholderText('Add links here'), { target: { value: 'http://newtest.com' } });
        fireEvent.click(await screen.findByTestId('plus-icon'));

        // await waitFor(() => screen.getByText('Duplicate keyword is not allowed'));

        await waitFor(() => expect(message.error).toHaveBeenCalledWith('Duplicate keyword is not allowed'));
    });

    test('should display error message for invalid URL', async () => {
        fireEvent.change(screen.getByPlaceholderText('Key word'), { target: { value: 'uniqueKeyword' } });
        fireEvent.change(screen.getByPlaceholderText('Add links here'), { target: { value: 'invalidURL' } });
        fireEvent.click(await screen.findByTestId('plus-icon'));

        // await waitFor(() => screen.getByText('Invalid URL'));

        await waitFor(() => expect(message.error).toHaveBeenCalledWith('Invalid URL'));
    });

    test('should add a link when valid data is provided', async () => {
        fireEvent.change(screen.getByPlaceholderText('Key word'), { target: { value: 'validKeyword' } });
        fireEvent.change(screen.getByPlaceholderText('Add links here'), { target: { value: 'http://validurl.com' } });
        fireEvent.click(await screen.findByTestId('plus-icon'));


        await waitFor(() => expect(mockSetStep4Data).toHaveBeenCalledWith(expect.anything()));

        expect(mockSetStep4Data).toHaveBeenCalledTimes(1);
    });

    test('should proceed to the next screen when at least one link is added and next button is clicked', async () => {
        // Mock step4Data with a link
        mockStep4Data.links = [{ keyword: 'nextStep', link: 'http://nextstep.com' }];

        fireEvent.click(screen.getByText('Next'));

        await waitFor(() => expect(mockSetCurrentScreen).toHaveBeenCalledWith(5));

        expect(mockSetCurrentScreen).toHaveBeenCalledWith(5);
    });


});