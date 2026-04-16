import React, { createContext, useState, useMemo } from 'react';

interface Step1Data {
  topic: string;
  selectedLocation: any;
  primaryKeyword: string;
  title: string;
  hasGeneratedTitle?: boolean;
  hasGeneratedPrimaryKeywords?: boolean;
}

interface Step3Data {
  secondaryKeywords: string[];
  temp: string[];
  removedRows: string[];
  hasGeneratedSecondaryKeywords?: boolean;
}

interface Draft {
  topic: '';
  selectedLocation: null;
  primaryKeyword: '';
  title: '';
  location: '';
  secondaryKeywords: [];
  links: [];
  brandVoice: string;
  blogGuide: string;
  outlineRegeneratedCount: number;
  outlineLastInputs: any;
}

export const GlobalContext = createContext({});

const GlobalProvider = ({ children }: any) => {
  const [identity, setIdentity] = useState<string>('Individual'); //
  const [role, setRole] = useState<string>('Business Owner'); //
  const [search, setSearch] = useState<string>('Google'); //
  const [currentScreen, setCurrentScreen] = useState<number>(1); // This state is for setting current screen in create blog module
  const [draftId, setDraftId] = useState<any>('');
  const [draftData, setDraftData] = useState<Draft>({
    topic: '',
    selectedLocation: null,
    primaryKeyword: '',
    title: '',
    location: '',
    secondaryKeywords: [],
    links: [],
    brandVoice: '',
    blogGuide: '',
    outlineRegeneratedCount: 0,
    outlineLastInputs: null
  });

  //step 1 data
  const [step1Data, setStep1Data] = useState<Step1Data>({
    topic: '',
    selectedLocation: null,
    primaryKeyword: '',
    title: '',
    hasGeneratedTitle: false,
    hasGeneratedPrimaryKeywords: false
  });

  const [stepLoader, setStepLoader] = useState(false);

  const [leaveFlag, setLeaveFlag] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  //step 2 data
  const [step2Data, setStep2Data] = useState<any>({
    scrappedUrl: [],
    files: []
  });

  const [planDetails, setPlanDetails] = useState<any>({});

  // step 3 data
  const [step3Data, setStep3Data] = useState<Step3Data>({
    secondaryKeywords: [],
    temp: [],
    removedRows: [],
    hasGeneratedSecondaryKeywords: false
  });

  //step 4 data
  const [step4Data, setStep4Data] = useState<any>({
    links: []
  });

  //step 5 data
  const [brandVoice, setBrandVoice] = useState([]);
  const [parsona, setParsona] = useState([]);
  const [styleGuide, setStyleGuide] = useState([]);
  const [userLanguage, setUserLanguage] = useState('English');
  const [userModel, setUserModel] = useState('Gemini-2.5 Flash');
  const [userName, setUserName] = useState<any>(' ');

  const [model, setModel] = useState([
    { value: 'GPT-4o', label: 'GPT-4o' },
    { value: 'GPT-o1-mini', label: 'GPT-o1-mini' },
    { value: 'Gemini_1.5_pro', label: 'Gemini_1.5_pro' },
    { value: 'Gemini_1.5_flash', label: 'Gemini_1.5_flash' },
    {
      value: 'Anthropic_claude_3.5_sonnet',
      label: 'Anthropic_claude_3.5_sonnet'
    }
  ]);

  const [visited, setVisited] = useState(0);
  const [language, setLanguage] = useState([
    { value: 1, label: 'English' },
    { value: 2, label: 'Mandarin' },
    { value: 3, label: 'Cantonese' },
    {
      value: 4,
      label: 'Spanish'
    },
    {
      value: 5,
      label: 'German'
    }
  ]);
  // step 5 data selected value
  const [selectedBrandVoice, setSelectedBrandVoice] = useState<string>();
  const [selectedBlogGuide, setSelectedBlogGuide] = useState<string>();
  const [selectedModel, setSelectedModel] = useState<string>();
  const [selectedLanguage, setSelectedLanguage] = useState<string>();

  // step 6 data
  const [categories, setCategories] = useState<any>([]);
  const [imgUrl, setImgUrl] = useState<string>();

  //Blog content
  const [blogContent, setBlogContent] = useState<any>();
  const [blogId, setBlogId] = useState<any>();

  const [editorContent, setEditorContent] = useState([]);
  const [regenerate, setRegenerate] = useState<boolean>(false);
  const [trialExhausted, setTrialExhausted] = useState<boolean>(false);
  const [titleOptions, setTitleOptions] = useState<any>([]);

  //User Data
  const [userDetail, setUserDetail] = useState({
    name: '',
    email: '',
    photo: '',
    planId: '',
    subscriptionId: '',
    firstName: '',
    lastName: ''
  });

  const [usage, setUsage] = useState<any>({
    usedBlog: 0,
    totalBlog: 0,
    usedPlagiarism: 0,
    totalPlagiarism: 0,
    usedRegeneration: 0,
    totalRegeneration: 0
  });

  const [lastOutlineInputs, setLastOutlineInputs] = useState<any>(null);

  const value = useMemo(
    () => ({
      identity,
      role,
      search,
      setIdentity,
      setRole,
      setSearch,
      step1Data,
      setStep1Data,
      currentScreen,
      setCurrentScreen,
      step2Data,
      setStep2Data,
      step3Data,
      setStep3Data,
      step4Data,
      setStep4Data,
      categories,
      setCategories,
      imgUrl,
      setImgUrl,
      blogContent,
      setBlogContent,
      brandVoice,
      setBrandVoice,
      parsona,
      setParsona,
      styleGuide,
      setStyleGuide,
      selectedBrandVoice,
      setSelectedBrandVoice,
      selectedBlogGuide,
      setSelectedBlogGuide,
      selectedModel,
      setSelectedModel,
      blogId,
      setBlogId,
      editorContent,
      setEditorContent,
      regenerate,
      setRegenerate,
      model,
      setModel,
      trialExhausted,
      setTrialExhausted,
      selectedLanguage,
      setSelectedLanguage,
      setLanguage,
      language,
      userDetail,
      setUserDetail,
      usage,
      setUsage,
      userLanguage,
      setUserLanguage,
      userModel,
      setUserModel,
      userName,
      setUserName,
      setDraftId,
      draftId,
      draftData,
      setDraftData,
      setLeaveFlag,
      leaveFlag,
      visited,
      setVisited,
      setPlanDetails,
      planDetails,
      setHasChanges,
      hasChanges,
      setStepLoader,
      stepLoader,
      titleOptions,
      setTitleOptions,
      lastOutlineInputs,
      setLastOutlineInputs
    }),
    [
      identity,
      visited,
      role,
      search,
      step1Data,
      currentScreen,
      step2Data,
      step3Data,
      step4Data,
      categories,
      imgUrl,
      blogContent,
      brandVoice,
      parsona,
      styleGuide,
      selectedBrandVoice,
      selectedBlogGuide,
      selectedModel,
      blogId,
      editorContent,
      regenerate,
      model,
      language,
      selectedLanguage,
      trialExhausted,
      userDetail,
      usage,
      userLanguage,
      userModel,
      draftId,
      userName,
      draftData,
      leaveFlag,
      planDetails,
      stepLoader,
      hasChanges,
      setHasChanges,
      titleOptions,
      lastOutlineInputs
    ]
  );

  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
};

export default GlobalProvider;
