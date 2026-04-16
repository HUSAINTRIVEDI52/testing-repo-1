// Import necessary utilities from testing-library
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import React from 'react';
import AiModel from '../../../src/components/AiModel/AiModel'; // Adjust the import path as necessary
import { Form } from 'antd';

// Mock necessary imports
jest.mock('../../../src/components/SideTitleInfo/SideTitleInfo', () => () => <div>SideTitleInfo Mock</div>);

describe('AiModel Component', () => {
    it('renders without crashing', () => {
        render(<AiModel />);
        expect(screen.getByText(/AI Model/i)).toBeInTheDocument();
        expect(screen.getByText(/SideTitleInfo Mock/i)).toBeInTheDocument();
    });

    it('changes value on select', () => {
        const { getByRole } = render(<AiModel />);
        const select = getByRole('combobox') as HTMLSelectElement;
        fireEvent.change(select, { target: { value: '2' } });
        expect(select.value).toBe('');
    });
});