import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import WritingStyle from '../../../src/components/BlogScreens/WritingStyle';
import { GlobalContext } from '../../../src/Context';
import '@testing-library/jest-dom';

const mockSetCurrentScreen = jest.fn();
const mockSetBrandVoice = jest.fn();
const mockSetParsona = jest.fn();
const mockSetStyleGuide = jest.fn();
const mockSelectedBrandVoice = 'Creole Studio’s Voice';
const mockselectedBlogGuide = 'Content Writer 1';
const mockSelectedStyleGuide = 'General Guidelines 1';

const contextValue = {
  setCurrentScreen: mockSetCurrentScreen,
  brandVoice: [],
  parsona: [],
  styleGuide: [],
  setBrandVoice: mockSetBrandVoice,
  setParsona: mockSetParsona,
  setStyleGuide: mockSetStyleGuide,
  selectedBrandVoice: mockSelectedBrandVoice,
  selectedBlogGuide: mockselectedBlogGuide,
  selectedStyleGuide: mockSelectedStyleGuide
};

describe('WritingStyle', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <GlobalContext.Provider value={contextValue}>
        <WritingStyle />
      </GlobalContext.Provider>
    );

    expect(getByText('Writing Style')).toBeInTheDocument();
    expect(
      getByText('Choose the right brand voice, persona & style guide as defined under global settings')
    ).toBeInTheDocument();
  });

  it('calls onChange when select option is changed', () => {
    const { getByRole } = render(
      <GlobalContext.Provider value={contextValue}>
        <WritingStyle />
      </GlobalContext.Provider>
    );

    const selectBrandVoice = getByRole('combobox', { name: 'Brand Voice' });
    fireEvent.change(selectBrandVoice, { target: { value: 'Personal Voice' } });

    expect(mockSetBrandVoice).toHaveBeenCalledTimes(2);
    expect(mockSetBrandVoice).toHaveBeenCalledWith(expect.anything());
  });

  it('calls onFinish when form is submitted', async () => {
    const { getByText } = render(
      <GlobalContext.Provider value={contextValue}>
        <WritingStyle />
      </GlobalContext.Provider>
    );

    const form = await screen.findByTestId('formwrite');
    const submitButton = getByText('Next');
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSetCurrentScreen).toHaveBeenCalledTimes(1));
    expect(mockSetCurrentScreen).toHaveBeenCalledWith(6);
  });

  it('calls onChange when select option is changed', () => {
    const { getByRole } = render(
      <GlobalContext.Provider value={contextValue}>
        <WritingStyle />
      </GlobalContext.Provider>
    );

    const selectBrandVoice = getByRole('combobox', { name: 'Brand Voice' });
    fireEvent.change(selectBrandVoice, { target: { value: 'Personal Voice' } });

    expect(mockSetBrandVoice).toHaveBeenCalledTimes(4);
    expect(mockSetBrandVoice).toHaveBeenCalledWith(expect.anything());
  });

  it('calls onChange when persona select option is changed', () => {
    const { getByRole } = render(
      <GlobalContext.Provider value={contextValue}>
        <WritingStyle />
      </GlobalContext.Provider>
    );

    const selectParsona = getByRole('combobox', { name: 'Persona' });
    fireEvent.change(selectParsona, { target: { value: 'Content Writer 2' } });

    expect(mockSetParsona).toHaveBeenCalledTimes(5);
    expect(mockSetParsona).toHaveBeenCalledWith(expect.anything());
  });

  it('calls onChange when style guide select option is changed', () => {
    const { getByRole } = render(
      <GlobalContext.Provider value={contextValue}>
        <WritingStyle />
      </GlobalContext.Provider>
    );

    const selectStyleGuide = getByRole('combobox', { name: 'Style Guide' });
    fireEvent.change(selectStyleGuide, { target: { value: 'General Guidelines 2' } });

    expect(mockSetStyleGuide).toHaveBeenCalledTimes(6);
    expect(mockSetStyleGuide).toHaveBeenCalledWith(expect.anything());
  });

  it('calls onFinish when form is submitted', async () => {
    const { getByText } = render(
      <GlobalContext.Provider value={contextValue}>
        <WritingStyle />
      </GlobalContext.Provider>
    );

    const form = await screen.findByTestId('formwrite');
    const submitButton = getByText('Next');
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSetCurrentScreen).toHaveBeenCalledTimes(1));
    expect(mockSetCurrentScreen).toHaveBeenCalledWith(6);
  });
});
