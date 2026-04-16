import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Account from '../../../src/components/Account/Account';
import '@testing-library/jest-dom';

describe('Account Component', () => {
    test('it should navigate to the correct tab based on URL', () => {
        const { getByText } = render(
            <MemoryRouter initialEntries={['/account?tab=2']}>
                <Routes>
                    <Route path="/account" element={<Account />} />
                </Routes>
            </MemoryRouter>
        );

        expect(getByText('Plans & Billings')).toBeInTheDocument();
    });

    test('it should change URL when tab is changed', () => {
        const { getByText } = render(
            <MemoryRouter initialEntries={['/account']}>
                <Routes>
                    <Route path="/account" element={<Account />} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.click(getByText('Usage'));
        expect(window.location.search).toBe('');
    });
});