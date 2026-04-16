import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateBlog from '../../../src/components/CreateBlog/CreateBlog';
import { GlobalContext } from '../../../src/Context';

// Mocking modules
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: {} }))
}));
jest.mock('../../assets/icons/Sprinkle.svg', () => {});
jest.mock('../../../src/components/BlogScreens/TitleScreen/TitleScreen', () => () => <div>TitleScreen Component</div>);
jest.mock('../../../src/components/BlogScreens/ReferenceArticle', () => () => <div>ReferenceArticle Component</div>);
jest.mock('../../../src/components/BlogScreens/SecondaryKeyword', () => () => <div>SecondaryKeyword Component</div>);
jest.mock('../../../src/components/BlogScreens/InternalLink', () => () => <div>InternalLink Component</div>);
jest.mock('../../../src/components/BlogScreens/WritingStyle', () => () => <div>WritingStyle Component</div>);
jest.mock('../../../src/components/BlogScreens/ReviewOutline', () => () => <div>ReviewOutline Component</div>);
jest.mock('../../../src/components/BlogScreens/BlogReady', () => () => <div>BlogReady Component</div>);

const mockGlobalContext = {
  currentScreen: 1,
  step1Data: { title: 'Test Title' },
  step2Data: { scrappedUrl: [], files: [] },
  step3Data: { secondaryKeywords: [] },
  step4Data: { links: [] },
  selectedBrandVoice: '',
  selectedBlogGuide: '',
  selectedStyleGuide: ''
};

describe('CreateBlog Component', () => {
  it('renders correctly', () => {
    render(
      <GlobalContext.Provider value={mockGlobalContext}>
        <CreateBlog />
      </GlobalContext.Provider>
    );

    expect(screen.getByText('Creating your blog')).toBeInTheDocument();
    expect(screen.getByText('Start Writing...')).toBeInTheDocument();
  });

  it('displays the correct step content based on currentScreen', () => {
    render(
      <GlobalContext.Provider value={{ ...mockGlobalContext, currentScreen: 1 }}>
        <CreateBlog />
      </GlobalContext.Provider>
    );

    expect(screen.getByText('TitleScreen Component')).toBeInTheDocument();
  });

  it('updates document title on mount', () => {
    render(
      <GlobalContext.Provider value={mockGlobalContext}>
        <CreateBlog />
      </GlobalContext.Provider>
    );

    expect(document.title).toEqual('Bloggr Ai | Create Blog');
  });

  // Add more tests as needed to cover functionality, interactions, and edge cases
});
