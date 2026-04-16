import React, { useContext } from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GlobalProvider, { GlobalContext } from '../src/Context';

// Test component that uses the context
const TestComponent = () => {
    const { identity, setIdentity, search, setSearch }: any = useContext(GlobalContext);

    return (
        <div>
            <div data-testid="identity">{identity}</div>
            <div data-testid="search">{search}</div>
            <button onClick={() => setIdentity('Developer')}>Set Identity to Developer</button>
            <button onClick={() => setSearch('DuckDuckGo')}>Set Search to DuckDuckGo</button>
        </div>
    );
};

describe('GlobalProvider', () => {
    it('provides and updates context correctly', () => {
        render(
            <GlobalProvider>
                <TestComponent />
            </GlobalProvider>
        );

        // Initial values
        expect(screen.getByTestId('identity')).toHaveTextContent('Individual');
        expect(screen.getByTestId('search')).toHaveTextContent('Google');

        // Update context values
        fireEvent.click(screen.getByText('Set Identity to Developer'));
        fireEvent.click(screen.getByText('Set Search to DuckDuckGo'));

        // Updated values
        expect(screen.getByTestId('identity')).toHaveTextContent('Developer');
        expect(screen.getByTestId('search')).toHaveTextContent('DuckDuckGo');
    });
});