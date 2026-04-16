import React from 'react';
import { render, screen } from '@testing-library/react';
import Invoice from '../../../src/components/Account/Invoice'; // Adjust the import path as necessary
import '@testing-library/jest-dom';
import BasicInfo from '../../../src/components/Account/BasicInfo';
import InvoiceTable from '../../../src/components/Table/InvoiceTable';

// Mocking BasicInfo and InvoiceTable components
jest.mock('../../../src/components/Account/BasicInfo', () => (props: any) => <div data-testid="basic-info" {...props}></div>);
jest.mock('../../../src/components/Table/InvoiceTable', () => () => <div data-testid="invoice-table"></div>);

describe('Invoice Component', () => {
    test('renders without crashing', () => {
        render(<Invoice />);
        expect(screen.getByTestId('basic-info')).toBeInTheDocument();
        expect(screen.getByText('Master Card')).toBeInTheDocument();
        expect(screen.getByTestId('invoice-table')).toBeInTheDocument();
    });

    test('renders BasicInfo with correct props', () => {
        render(<Invoice />);
        const basicInfoComponent = screen.getByTestId('basic-info');
        expect(basicInfoComponent).toHaveAttribute('plan', 'Current Plan');
        expect(basicInfoComponent).toHaveAttribute('currentPlanTitle', 'Basic');
    });

    test('displays "Master Card" text', () => {
        render(<Invoice />);
        expect(screen.getByText('Master Card')).toBeInTheDocument();
    });

    test('renders InvoiceTable component', () => {
        render(<Invoice />);
        expect(screen.getByTestId('invoice-table')).toBeInTheDocument();
    });
});