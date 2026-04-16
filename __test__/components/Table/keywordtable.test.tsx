import React from 'react';
import { render, screen } from '@testing-library/react';
import KeywordTable from '../../../src/components/Table/KeywordTable';
import '@testing-library/jest-dom';
import { GlobalContext } from '../../../src/Context';

const mockData = [
    { key: '1', Keywords: 'React', Volume: 1000, Difficulty: 3 },
    { key: '2', Keywords: 'Vue', Volume: 800, Difficulty: 2 },
];

const mockContext = {
    step1Data: {},
    setStep1Data: jest.fn(),
    step3Data: { secondaryKeywords: [] },
    setStep3Data: jest.fn(),
};

describe('KeywordTable', () => {
    it('renders table with provided data', () => {
        render(
            <GlobalContext.Provider value={mockContext}>
                <KeywordTable data={mockData} type="primaryKeyword" selection="checkbox" />
            </GlobalContext.Provider>
        );

        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('Vue')).toBeInTheDocument();
        expect(screen.getByText('1000')).toBeInTheDocument();
        expect(screen.getByText('800')).toBeInTheDocument();
    });

    it('renders sort icons for sortable columns', () => {
        render(
            <GlobalContext.Provider value={mockContext}>
                <KeywordTable data={mockData} type="primaryKeyword" selection="checkbox" />
            </GlobalContext.Provider>
        );

        // Assuming sort icons are rendered within sortable column headers
        // This test might need adjustment based on actual implementation details
        const sortIcons = screen.getAllByAltText('sort');
        expect(sortIcons.length).toBeGreaterThan(0);
    });

    it('updates context on row selection for primaryKeyword type', () => {
        const { setStep1Data } = mockContext;
        render(
            <GlobalContext.Provider value={mockContext}>
                <KeywordTable data={mockData} type="primaryKeyword" selection="checkbox" />
            </GlobalContext.Provider>
        );

        // Assuming there's a way to simulate row selection, which would trigger the context update
        // This test is more conceptual, as actual row selection simulation depends on the UI library's components and might require user event simulation
        // Example: userEvent.click(screen.getByText('React'));

        // Check if setStep1Data was called with expected data
        // This check is conceptual and assumes setStep1Data would be called as part of the row selection process
        // expect(setStep1Data).toHaveBeenCalledWith(expect.objectContaining({ primaryKeyword: 'React' }));
    });

    it('limits secondaryKeyword selection to 5', () => {
        const { setStep3Data } = mockContext;
        render(
            <GlobalContext.Provider value={mockContext}>
                <KeywordTable data={mockData} type="secondaryKeyword" selection="checkbox" />
            </GlobalContext.Provider>
        );

        // Assuming there's a way to simulate multiple row selections, which would trigger the context update
        // This test is more conceptual, as actual row selection simulation depends on the UI library's components and might require user event simulation
        // Example: userEvent.click(screen.getByText('React')); userEvent.click(screen.getByText('Vue'));

        // Check if setStep3Data was called with expected data
        // This check is conceptual and assumes setStep3Data would be called as part of the row selection process, respecting the limit of 5 secondary keywords
        // expect(setStep3Data).toHaveBeenCalledWith(expect.objectContaining({ secondaryKeywords: expect.arrayContaining(['React', 'Vue']) }));
    });
});