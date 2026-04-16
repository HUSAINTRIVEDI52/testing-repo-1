import { ReactComponent as Blog } from './assets/icons/Property 1=icon-park_doc-search-two.svg';
import { ReactComponent as VoiceSvg } from './assets/icons/Property 1=iconoir_voice.svg';
import { ReactComponent as BlogGuideline } from './assets/icons/Property 1=Frame 158.svg';

export const sidebarMenu1 = [
  { key: '1', label: 'My Blogs', tooltip: 'List of blogs and drafts', icon: Blog, url: 'my-blog' },
  {
    key: '2',
    label: 'Brand Voice',
    tooltip:
      'Create a brand voice templates, you can select the template you need while creating a blog. it will reflect in your blogs.',
    icon: VoiceSvg,
    url: 'brand-voice'
  },
  {
    key: '3',
    label: 'Blog Guidelines',
    tooltip: 'Create a blog guideline that system will remember.',
    icon: BlogGuideline,
    url: 'blog-guideline'
  }
  // { key: '4', label: 'Style Guide', icon: StyleGuide, url: 'style-guide' },
  // { key: '5', label: 'AI Model', icon: AI_Model, url: 'ai-model' }
];

export const sidebarMenu2 = [
  // { key: '1', label: 'Guide', icon: Guide, dropdown: false },
  { key: '3', label: 'Account Settings', icon: Blog, dropdown: true }
];

export const modelDropdown = [
  {
    id: 'gemini-2.5-flash',
    value: 'Gemini-2.5 Flash',
    type: 'Free'
  },
  {
    id: 'gemini-2.5-pro',
    value: 'Gemini-2.5 Pro',
    type: 'Basic'
  },
  {
    id: 'o4-mini',
    value: 'o4-mini',
    type: 'Pro'
  },
  {
    id: 'gpt-5',
    value: 'GPT-5',
    type: 'Pro'
  },
  {
    id: 'claude_4.5_sonnet',
    value: 'Claude 4.5-Sonnet',
    type: 'Pro'
  }
];

export const languagesDropdown = [
  {
    id: 'en',
    value: 'English',
    type: 'Free'
  },
  {
    id: 'zh',
    value: 'Chinese (Traditional)',
    type: 'Pro'
  },
  {
    id: 'zh-HK',
    value: 'Chinese (Simplified)',
    type: 'Pro'
  },
  {
    id: 'es',
    value: 'Spanish',
    type: 'Pro'
  },
  {
    id: 'de',
    value: 'German',
    type: 'Pro'
  }
];

export const plans: { [key: string]: string[] } = {
  Free: ['Free'],
  Basic: ['Free', 'Basic'],
  Pro: ['Free', 'Basic', 'Pro'],
  Agency: ['Free', 'Basic', 'Pro']
};

export const planDetail = [
  {
    id: 1,
    title: 'Free',
    price: '0',
    billed: 'Billed Annually',
    discount: '0',
    content: [
      { text: '1 Blog generation', disabled: false },
      { text: '0 File upload', disabled: false },
      { text: '10k embedding word count', disabled: false },
      { text: 'Key word research', disabled: true },
      { text: 'plagiarism check', disabled: true },
      { text: 'link crawl limit', disabled: true },
      { text: 'multilingual support', disabled: true },
      { text: 'Unlimited Outline generation', disabled: true }
    ],
    llm: [
      { text: 'Gemini-2.5-Flash', disabled: false },
      { text: 'Gemini-2.5-pro', disabled: false }
    ]
  },
  {
    id: 2,
    title: 'Basic',
    time: 'monthly',
    planId: process.env.REACT_APP_PLAN_ID_BASIC_MONTHLY,
    price: '4.99',
    billed: 'Billed Monthly',
    discount: '0',
    content: [
      { text: '5 Blog generation', disabled: false },
      { text: '4 File upload', disabled: false },
      { text: '30k embedding word count', disabled: false },
      { text: 'Key word research', disabled: false },
      { text: 'plagiarism check', disabled: true },
      { text: 'link crawl limit', disabled: true },
      { text: 'multilingual support', disabled: true },
      { text: 'Unlimited Outline generation', disabled: true }
    ],
    llm: [
      { text: 'Gemini-2.5-Flash', disabled: false },
      { text: 'Gemini-2.5-pro', disabled: false }
    ]
  },
  {
    id: 3,
    title: 'Pro',
    time: 'monthly',
    planId: process.env.REACT_APP_PLAN_ID_PRO_MONTHLY,
    price: '11.99',
    billed: 'Billed Monthly',
    discount: '0',
    content: [
      { text: '10 Blog generation', disabled: false },
      { text: '10 File upload', disabled: false },
      { text: '100k embedding word count', disabled: false },
      { text: 'Key word research', disabled: false },
      { text: 'plagiarism check', disabled: false },
      { text: '10 link crawl limit', disabled: false },
      { text: 'multilingual support', disabled: false },
      { text: 'Unlimited Outline generation', disabled: false }
    ],
    llm: [
      { text: 'Gemini-2.5-Flash', disabled: false },
      { text: 'Gemini-2.5-pro', disabled: false }
    ]
  },
  {
    id: 4,
    title: 'Agency',
    price: '34.99',
    time: 'monthly',
    planId: process.env.REACT_APP_PLAN_ID_AGENCY_MONTHLY,
    billed: 'Billed Monthly',
    discount: '10',
    content: [
      { text: '10 Blog generation', disabled: false },
      { text: '10 File upload', disabled: false },
      { text: '100k embedding word count', disabled: false },
      { text: 'Key word research', disabled: false },
      { text: 'plagiarism check', disabled: false },
      { text: '10 link crawl limit', disabled: false },
      { text: 'multilingual support', disabled: false },
      { text: 'Unlimited Outline generation', disabled: false }
    ],
    llm: [
      { text: 'Gemini-2.5-Flash', disabled: false },
      { text: 'Gemini-2.5-pro', disabled: false }
    ]
  },
  {
    id: 5,
    title: 'Basic',
    time: 'yearly',
    planId: process.env.REACT_APP_PLAN_ID_BASIC_YEARLY,
    price: '40.99',
    billed: 'Billed Annually',
    discount: '0',
    content: [
      { text: '5 Blog generation', disabled: false },
      { text: '4 File upload', disabled: false },
      { text: '30k embedding word count', disabled: false },
      { text: 'Key word research', disabled: false },
      { text: 'plagiarism check', disabled: true },
      { text: 'link crawl limit', disabled: true },
      { text: 'multilingual support', disabled: true },
      { text: 'Unlimited Outline generation', disabled: true }
    ],
    llm: [
      { text: 'Gemini-2.5-Flash', disabled: false },
      { text: 'Gemini-2.5-pro', disabled: false }
    ]
  },
  {
    id: 6,
    title: 'Pro',
    price: '111.99',
    time: 'yearly',
    planId: process.env.REACT_APP_PLAN_ID_PRO_YEARLY,
    billed: 'Billed Annually',
    discount: '10',
    content: [
      { text: '10 Blog generation', disabled: false },
      { text: '10 File upload', disabled: false },
      { text: '100k embedding word count', disabled: false },
      { text: 'Key word research', disabled: false },
      { text: 'plagiarism check', disabled: false },
      { text: '10 link crawl limit', disabled: false },
      { text: 'multilingual support', disabled: false },
      { text: 'Unlimited Outline generation', disabled: false }
    ],
    llm: [
      { text: 'Gemini-2.5-Flash', disabled: false },
      { text: 'Gemini-2.5-pro', disabled: false }
    ]
  },
  {
    id: 7,
    title: 'Agency',
    price: '340.99',
    time: 'yearly',
    planId: process.env.REACT_APP_PLAN_ID_AGENCY_YEARLY,
    billed: 'Billed Annually',
    discount: '10',
    content: [
      { text: '10 Blog generation', disabled: false },
      { text: '10 File upload', disabled: false },
      { text: '100k embedding word count', disabled: false },
      { text: 'Key word research', disabled: false },
      { text: 'plagiarism check', disabled: false },
      { text: '10 link crawl limit', disabled: false },
      { text: 'multilingual support', disabled: false },
      { text: 'Unlimited Outline generation', disabled: false }
    ],
    llm: [
      { text: 'Gemini-2.5-Flash', disabled: false },
      { text: 'Gemini-2.5-pro', disabled: false }
    ]
  }
];
export const planTab = [
  {
    id: 1,
    title: 'Yearly(Save12%)'
  },
  {
    id: 2,
    title: 'Monthly'
  }
];
