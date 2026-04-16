import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { GlobalContext } from '../../../src/Context';
import NestedDragDropEle from '../../../src/components/BlogScreens/NestedDragDropEle';

// Mock the DragDropContext if necessary to ensure it calls the onDragEnd prop correctly.


describe('NestedDragDropEle', () => {
    const mockCategories = [
        { id: '1', name: 'Category 1', items: [{ id: 'item1', name: 'Item 1' }] },
        { id: '2', name: 'Category 2', items: [{ id: 'item2', name: 'Item 2' }] }
    ];

    it('renders without crashing', () => {
        const { getByText } = render(
            <GlobalContext.Provider value={{ categories: mockCategories, setCategories: jest.fn() }}>
                <NestedDragDropEle loader={false} />
            </GlobalContext.Provider>
        );

        expect(getByText('Category 1')).toBeInTheDocument();
        expect(getByText('Category 2')).toBeInTheDocument();
    });



    it('handles category title input correctly', () => {
        const setCategoriesMock = jest.fn();
        const { getByPlaceholderText } = render(
            <GlobalContext.Provider value={{ categories: mockCategories, setCategories: setCategoriesMock }}>
                <NestedDragDropEle loader={false} />
            </GlobalContext.Provider>
        );

        fireEvent.change(getByPlaceholderText('Add new H2 title'), { target: { value: 'New Category' } });
        fireEvent.keyDown(getByPlaceholderText('Add new H2 title'), { key: 'Enter', code: 'Enter' });

        expect(setCategoriesMock).toHaveBeenCalled();
    });


});