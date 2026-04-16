import React from 'react';
import { handleKeywordHandler } from '../../src/utils/CommonFunction';
import axios from 'axios';
import { message } from 'antd';

jest.mock('axios', () => ({
    post: jest.fn(),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('antd', () => ({
    message: {
        error: jest.fn(),
    },
}));

describe('handleKeywordHandler', () => {
    const values = { keyword: 'test', country: 'USA' };
    const setKeywordExplorerLoader = jest.fn();
    const setKeywordData = jest.fn();
    const setIsModalOpen = jest.fn();

    beforeEach(() => {
        mockedAxios.post.mockClear();
    });

    test('should return early if keyword or country is empty', async () => {
        await handleKeywordHandler({ keyword: '', country: 'USA' }, setKeywordExplorerLoader, setKeywordData, setIsModalOpen);
        expect(setKeywordExplorerLoader).toHaveBeenCalledTimes(1);
        expect(setKeywordExplorerLoader).toHaveBeenCalledWith(false);
        expect(message.error).toHaveBeenCalledTimes(1);
        expect(message.error).toHaveBeenCalledWith('Please enter both keyword and country');
    });

    test('should make a POST request to the server with the correct headers', async () => {
        await handleKeywordHandler(values, setKeywordExplorerLoader, setKeywordData, setIsModalOpen);
        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(axios.post).toHaveBeenCalledWith(
            `${process.env.REACT_APP_SERVER_URL}/getKeywords`,
            values,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            }
        );
    });

    test('should handle a successful response from the server', async () => {
        const response = {
            status: 200,
            data: {
                text: [
                    { text: 'keyword1', keywordIdeaMetrics: { avgMonthlySearches: 100, competitionIndex: 0.5 } },
                    { text: 'keyword2', keywordIdeaMetrics: { avgMonthlySearches: 200, competitionIndex: 0.8 } },
                ],
            },
        };
        mockedAxios.post.mockResolvedValue(response);
        await handleKeywordHandler(values, setKeywordExplorerLoader, setKeywordData, setIsModalOpen);
        expect(setKeywordData).toHaveBeenCalledTimes(1);
        expect(setKeywordData).toHaveBeenCalledWith([
            { key: 0, Keywords: 'keyword1', Volume: 100, Difficulty: 0.5 },
            { key: 1, Keywords: 'keyword2', Volume: 200, Difficulty: 0.8 },
        ]);
        expect(setIsModalOpen).toHaveBeenCalledTimes(1);
        expect(setIsModalOpen).toHaveBeenCalledWith(true);
    });

    test('should handle an error response from the server', async () => {
        const response = {
            status: 400,
            data: { error: 'Error message from server' },
        };
        mockedAxios.post.mockRejectedValue(response);
        await handleKeywordHandler(values, setKeywordExplorerLoader, setKeywordData, setIsModalOpen);
        expect(message.error).toHaveBeenCalled();
        expect(message.error).toHaveBeenCalledWith(expect.any(String));
    });

    test('should handle a catch error', async () => {
        mockedAxios.post.mockRejectedValue(new Error('Network error'));
        await handleKeywordHandler(values, setKeywordExplorerLoader, setKeywordData, setIsModalOpen);
        expect(message.error).toHaveBeenCalled();
        expect(message.error).toHaveBeenCalledWith('Network error');
    });
});