import React from 'react';
import { render } from '@testing-library/react';
import Home from '../../../src/components/Home/Home';
// Import the actual module for typing purposes
import * as LetsStartModule from '../../../src/components/LetsStart/LetsStart';
import '@testing-library/jest-dom'
jest.mock('../../../src/components/LetsStart/LetsStart'); // Mock LetsStart component

describe('Home Component', () => {
    it('renders LetsStart component', () => {
        // Cast the mocked LetsStart to its jest.Mocked type
        const mockedLetsStart = LetsStartModule.default as jest.MockedFunction<typeof LetsStartModule.default>;
        mockedLetsStart.mockImplementation(() => <div>LetsStartComponentMock</div>);

        const { getByText } = render(<Home />);
        expect(getByText('LetsStartComponentMock')).toBeInTheDocument();
    });
});