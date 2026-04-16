import React, { useContext, useState, useEffect } from 'react';
import { Modal, Button, Input, Radio, Checkbox, Tag, message, Spin } from 'antd';
import { CloseOutlined, SearchOutlined, CheckCircleFilled } from '@ant-design/icons';
import { GlobalContext } from '../../../Context';
import './keyword-explorer.scss';

export default function KeywordExplorerModal({
  isModalOpen,
  setIsModalOpen,
  data,
  search,
  setSearch,
  onSearch,
  location,
  onGenerateTitles
}: any) {
  const { step1Data, setStep1Data, step3Data, setStep3Data, setVisited, currentScreen }: any = useContext(GlobalContext);
  const [searchLoader, setSearchLoader] = useState<boolean>(false);
  
  // Local state to manage selections before clicking "Done"
  const [localPrimary, setLocalPrimary] = useState<string>('');
  const [localSecondary, setLocalSecondary] = useState<string[]>([]);

  // Sync with context when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setLocalPrimary(step1Data?.primaryKeyword || '');
      setLocalSecondary(step3Data?.secondaryKeywords || []);
    }
  }, [isModalOpen, step1Data?.primaryKeyword, step3Data?.secondaryKeywords]);

  const handleSearch = async () => {
    if (!search.trim()) {
      message.error("Please enter a keyword to search");
      return;
    }
    setSearchLoader(true);
    if (onSearch) {
      await onSearch();
    }
    setSearchLoader(false);
  };

  const handlePrimarySelect = (keyword: string) => {
    setLocalPrimary(keyword);
    // Remove from secondary if it was there
    setLocalSecondary(prev => prev.filter(k => k !== keyword));
  };

  const toggleSecondary = (keyword: string) => {
    if (localSecondary.includes(keyword)) {
      setLocalSecondary(prev => prev.filter(k => k !== keyword));
    } else {
      if (localSecondary.length >= 5) {
        message.warning("You can select up to 5 secondary keywords");
        return;
      }
      setLocalSecondary(prev => [...prev, keyword]);
    }
  };

  const handleDone = () => {
    if (!localPrimary) {
      message.warning("Please select a Primary Keyword");
      return;
    }

    // Update Global Context
    setStep1Data((prev: any) => ({ ...prev, primaryKeyword: localPrimary }));
    setStep3Data((prev: any) => ({ 
      ...prev, 
      secondaryKeywords: localSecondary,
      hasGeneratedSecondaryKeywords: true,
      temp: [],
      removedRows: []
    }));

    // Trigger title generation if it's a new primary keyword
    if (localPrimary !== step1Data?.primaryKeyword) {
      if (onGenerateTitles) {
        onGenerateTitles(localPrimary, true); // Added true to skipSecondary
      }
      // Reset visited step to current screen (1) to prevent skipping ahead
      setVisited(currentScreen);
    }

    setIsModalOpen(false);
  };

  const keywordList = data || [];

  return (
    <Modal
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={null}
      closable={false}
      width={1000}
      className="keyword-explorer-modal"
      centered
      maskClosable={false}
    >
      <div className="keyword-explorer-header">
        <div className="header-title-row">
          <h2>Keyword Explorer <small>({location})</small></h2>
          <CloseOutlined className="close-icon" onClick={() => setIsModalOpen(false)} />
        </div>
        <div className="search-row">
          <Input 
            className="input-box" 
            placeholder="Search Keywords" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onPressEnter={handleSearch}
          />
          <Button 
            className="search-btn" 
            type="primary" 
            onClick={handleSearch}
            loading={searchLoader}
          >
            Search
          </Button>
        </div>
      </div>

      <div className="selected-tags-row">
        <div className="tag-section">
          <span className="label">Primary Keyword</span>
          <div className="selected-tag-container">
            {localPrimary ? (
              <div className="selected-tag">{localPrimary}</div>
            ) : (
              <span className="empty-tag">None selected</span>
            )}
          </div>
        </div>
        
        <div className="tag-section">
          <span className="label">Secondary Keywords ({localSecondary.length}/5)</span>
          <div className="selected-tag-container">
            {localSecondary.length > 0 ? (
              localSecondary.map(kw => (
                <div key={kw} className="selected-tag">
                  {kw} 
                  <CloseOutlined 
                    className="remove-icon" 
                    onClick={() => setLocalSecondary(prev => prev.filter(k => k !== kw))} 
                  />
                </div>
              ))
            ) : (
              <span className="empty-tag">None selected</span>
            )}
          </div>
        </div>
      </div>

      <div className="keyword-columns-container">
        {/* Primary Keywords Column */}
        <div className="column">
          <div className="column-header">
            <h3>Primary Keywords</h3>
            <div className="sort-info">Volume ↓</div>
          </div>
          <div className="column-content">
            {keywordList.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#bfbfbf' }}>No keywords found</div>
            ) : (
                keywordList.map((item: any) => (
                <div 
                    key={item.key} 
                    className={`keyword-row ${localPrimary === item.Keywords ? 'selected' : ''}`}
                    onClick={() => handlePrimarySelect(item.Keywords)}
                >
                    <Radio className="selector" checked={localPrimary === item.Keywords} />
                    <span className="keyword-text">{item.Keywords}</span>
                    <span className="volume-text">{item.Volume}</span>
                </div>
                ))
            )}
          </div>
        </div>

        {/* Secondary Keywords Column */}
        <div className="column">
          <div className="column-header">
            <h3>Secondary Keywords</h3>
            <div className="sort-info">Volume ↓</div>
          </div>
          <div className="column-content">
            {keywordList.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#bfbfbf' }}>Search to see suggestions</div>
            ) : (
                keywordList.map((item: any) => {
                const isPrimary = localPrimary === item.Keywords;
                return (
                    <div 
                    key={item.key} 
                    className={`keyword-row ${localSecondary.includes(item.Keywords) ? 'selected' : ''} ${isPrimary ? 'disabled' : ''}`}
                    onClick={() => !isPrimary && toggleSecondary(item.Keywords)}
                    >
                    <Checkbox 
                        className="selector" 
                        checked={localSecondary.includes(item.Keywords)} 
                        disabled={isPrimary}
                    />
                    <span className="keyword-text">{item.Keywords}</span>
                    <span className="volume-text">{item.Volume}</span>
                    </div>
                );
                })
            )}
          </div>
        </div>
      </div>

      <div className="modal-footer">
        <Button 
          className="done-btn" 
          type="primary" 
          onClick={handleDone}
          disabled={!localPrimary}
        >
          Done
        </Button>
      </div>
    </Modal>
  );
}
