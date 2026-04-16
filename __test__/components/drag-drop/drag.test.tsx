// Drag.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GlobalContext } from '../../../src/Context'; // Adjust the import path as necessary
import Drag from '../../../src/components/drag-drop/Drag'; // Adjust the import path as necessary
import { Draggable } from 'react-beautiful-dnd';

jest.mock('react-beautiful-dnd', () => ({
    Draggable: jest.fn(({ children }) => children({
        draggableProps: {},
        dragHandleProps: {},
        innerRef: jest.fn(),
    }, {})),
}));

describe('Drag Component', () => {
    const setCategoriesMock = jest.fn();
    const categoriesMock = [
        { id: 'cat1', items: [{ id: 'item1' }, { id: 'item2' }] },
        { id: 'cat2', items: [{ id: 'item3' }, { id: 'item4' }] },
    ];

    it('renders correctly', () => {
        const { getByTestId } = render(
            <GlobalContext.Provider value={{ categories: categoriesMock, setCategories: setCategoriesMock }}>
                <Drag id="item1" index={0} />
            </GlobalContext.Provider>
        );

        expect(getByTestId('drag-handle')).toBeInTheDocument();
        expect(getByTestId('delete-button')).toBeInTheDocument();
    });

    it('contains a drag handle', () => {
        const { getByTestId } = render(
            <GlobalContext.Provider value={{ categories: categoriesMock, setCategories: setCategoriesMock }}>
                <Drag id="item1" index={0} />
            </GlobalContext.Provider>
        );

        expect(getByTestId('drag-handle')).toBeInTheDocument();
    });

    it('deletes an item when delete button is clicked', () => {
        const { getByTestId } = render(
            <GlobalContext.Provider value={{ categories: categoriesMock, setCategories: setCategoriesMock }}>
                <Drag id="item1" index={0} />
            </GlobalContext.Provider>
        );

        fireEvent.click(getByTestId('delete-button'));
        expect(setCategoriesMock).toHaveBeenCalled();
        // Further assertions can be made based on the expected outcome of setCategoriesMock
    });
});