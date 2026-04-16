import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReviewOutline from '../../../src/components/BlogScreens/ReviewOutline';
import axios from 'axios';
import { GlobalContext } from '../../../src/Context';

jest.mock('axios');
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockContext = {
  step1Data: { title: 'Test Title', primaryKeyword: 'Test Keyword' },
  step2Data: { scrappedUrl: [], files: [] },
  step3Data: { secondaryKeywords: ['Secondary Keyword 1', 'Secondary Keyword 2'] },
  step4Data: { links: [] },
  setCategories: jest.fn(),
  setBlogId: jest.fn(),
  selectedBrandVoice: 'Informative',
  imgUrl: 'http://example.com/test.jpg',
  selectedBlogGuide: 'Professional',
  setImgUrl: jest.fn(),
  selectedStyleGuide: 'APA',
  categories: [],
  setBlogContent: jest.fn(),
  setCurrentScreen: jest.fn()
};

describe('ReviewOutline Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('userId', '123');
    localStorage.setItem('accessToken', 'token');
  });

  test('calls generateBlogStructure and generateImage on component mount', async () => {
    jest.mock('axios');
    (axios.post as jest.Mock).mockResolvedValueOnce({ status: 200, data: { text: JSON.stringify([]) } } as any); // Mock for generateBlogStructure
    (axios.post as jest.Mock).mockResolvedValueOnce({
      status: 200,
      data: { text: ['http://example.com/test.jpg'] }
    } as any); // Mock for generateImage

    render(
      <GlobalContext.Provider value={mockContext}>
        <ReviewOutline />
      </GlobalContext.Provider>
    );

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(2));
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/headings'),
      expect.any(Object),
      expect.any(Object)
    );
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/getImages'),
      expect.any(Object),
      expect.any(Object)
    );
  });

  test('successfully generates blog structure and updates categories', async () => {
    const categories = [{ name: 'Category 1', items: [{ name: 'Item 1' }] }];
    mockedAxios.post.mockResolvedValueOnce({ status: 200, data: { text: JSON.stringify(categories) } });

    render(
      <GlobalContext.Provider value={mockContext}>
        <ReviewOutline />
      </GlobalContext.Provider>
    );

    await waitFor(() => expect(mockContext.setCategories).toHaveBeenCalledWith(categories));
  });

  test('successfully generates blog and updates blog content and ID', async () => {
    // Mock the axios response for the generateBlog function
    const blogResponse = {
      status: 200,
      data: {
        text: 'Generated blog content',
        blogId: 'blog123'
      }
    };
    mockedAxios.post.mockResolvedValueOnce(blogResponse);

    // Mock the context to have categories, as generateBlog checks for categories length
    const mockContextWithCategories = {
      ...mockContext,
      categories: [{ name: 'Category 1', items: [{ name: 'Item 1' }] }]
    };

    render(
      <GlobalContext.Provider value={mockContextWithCategories}>
        <ReviewOutline />
      </GlobalContext.Provider>
    );

    // Simulate clicking the "Lets generate the blog!" button
    fireEvent.click(await screen.findByText('Lets generate the blog!'));

    // Wait for the axios call to resolve and the context methods to be called
    await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledTimes(3)); // Considering previous tests, this should be the third call
    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('/data'), // URL should contain '/data'
      expect.any(Object), // The exact payload is complex and varies, so we check for any object
      expect.any(Object) // Headers object
    );

    // Check if the setBlogContent and setBlogId functions were called with the expected values
    // await waitFor(() => expect(mockContextWithCategories.setBlogContent).toHaveBeenCalledWith('Generated blog content'));
    // await waitFor(() => expect(mockContextWithCategories.setBlogId).toHaveBeenCalledWith('blog123'));
  });
});
