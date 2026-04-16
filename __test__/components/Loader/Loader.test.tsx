// Loader.test.js
import React from 'react';
import { render } from '@testing-library/react';
import Loader from '../../../src/components/Loader/Loader'; // Adjust the import path according to your project structure
import { Spin } from 'antd';

// Mock the antd Spin component
jest.mock('antd', () => {
    const originalModule = jest.requireActual('antd');

    return {
        __esModule: true,
        ...originalModule,
        Spin: jest.fn(() => null),
    };
});

describe('Loader component', () => {
    it('renders the Spin component with large size', () => {
        render(<Loader />);
        expect(Spin).toHaveBeenCalledWith(expect.objectContaining({ size: 'large' }), {});
    });
});