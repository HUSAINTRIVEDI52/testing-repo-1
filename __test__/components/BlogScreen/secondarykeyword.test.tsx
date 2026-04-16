import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SecondaryKeyword from '../../../src/components/BlogScreens/SecondaryKeyword';
import { GlobalContext } from '../../../src/Context';
import { message } from 'antd';

// Mocking message.error to avoid implementation details leaking in tests
jest.mock('antd', () => {
    const antd = jest.requireActual('antd');
    const message = { error: jest.fn() };
    return {
        ...antd,
        message,
    };
});

describe('SecondaryKeyword Component', () => {
    test('removes a secondary keyword correctly', () => {
        const mockSetStep3Data = jest.fn();
        const initialContextValue = {
            step3Data: {
                secondaryKeywords: ['keyword1', 'keyword2', 'keyword3'],
            },
            setStep3Data: mockSetStep3Data,
        };

        const { getByText } = render(
            <GlobalContext.Provider value={initialContextValue}>
                <SecondaryKeyword />
            </GlobalContext.Provider>
        );

        // Assuming your component renders tags that can be closed, and the close button has text 'Close'
        // This part might need adjustment based on how the tags are actually rendered
        const closeButtons = getByText('keyword1')?.parentNode?.querySelector('.ant-tag-close-icon');
        if (closeButtons) {
            fireEvent.click(closeButtons);
        }

        expect(mockSetStep3Data).toHaveBeenCalledWith({
            secondaryKeywords: ['keyword2', 'keyword3'],
        });
    });
});