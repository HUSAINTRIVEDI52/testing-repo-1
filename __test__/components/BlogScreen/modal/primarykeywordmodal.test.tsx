import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PrimaryKeywordModal from '../../../../src/components/BlogScreens/Modal/PrimaryKeywordModal';
import { message } from 'antd';

jest.mock('antd', () => {
    const antd = jest.requireActual('antd');
    const message = { error: jest.fn() };
    return {
        ...antd,
        message,
    };
});

describe('PrimaryKeywordModal', () => {
    const mockSetSearch = jest.fn();
    const mockOnSearch = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should display error message when search is empty and search button is clicked', async () => {
        const { getByText, getByPlaceholderText } = render(
            <PrimaryKeywordModal
                search=""
                setSearch={mockSetSearch}
                onSearch={mockOnSearch}
            />
        );

        fireEvent.change(getByPlaceholderText('Search Keywords'), { target: { value: '' } });
        fireEvent.click(getByText('Search'));

        expect(message.error).toHaveBeenCalledWith('please input search values');
    });

    it('should call onSearch when search is not empty and search button is clicked', async () => {
        const { getByText, getByPlaceholderText } = render(
            <PrimaryKeywordModal
                search="test"
                setSearch={mockSetSearch}
                onSearch={mockOnSearch}
            />
        );

        fireEvent.change(getByPlaceholderText('Search Keywords'), { target: { value: 'test' } });
        fireEvent.click(getByText('Search'));

        await waitFor(() => expect(mockOnSearch).toHaveBeenCalled());
    });
});