import React, { useContext, useState, useEffect } from 'react';

import './common-modal.scss';
import KeywordTable from '../../Table/KeywordTable';
import { Button, Input, message } from 'antd';
import { GlobalContext } from '../../../Context';

export default function PrimaryKeywordModal({
  data,
  type,
  search,
  setSearch,
  onSearch,
  selection,
  form,
  location,
  setIsModalOpen,
  isModalOpen,
  onGenerateTitles
}: any) {
  const [searchLoader, setSearchLoader] = useState<boolean>(false);
  const { step3Data, setStep3Data, step1Data, setStep1Data }: any = useContext(GlobalContext);
  const [localPrimaryKeyword, setLocalPrimaryKeyword] = useState<string>('');

  useEffect(() => {
    if (isModalOpen && type === 'primaryKeyword') {
      setLocalPrimaryKeyword(step1Data?.primaryKeyword || '');
    }
  }, [isModalOpen, type, step1Data?.primaryKeyword]);

  const handleSearch = async () => {
    if (!search.trim()) {
      message.error({ content: 'please input search values', key: 'keyword-input-error' });
      return;
    }
    setSearchLoader(true);
    if (onSearch) {
      // Check if onSearch is defined before calling it
      await onSearch();
    }
    setSearchLoader(false);
  };

  const handlePrimaryDone = () => {
    if (setStep1Data && localPrimaryKeyword) {
      setStep1Data((prev: any) => ({ ...prev, primaryKeyword: localPrimaryKeyword }));
      if (form) {
        form.setFieldsValue({ primaryKeyword: localPrimaryKeyword });
      }
      if (onGenerateTitles) {
        onGenerateTitles(localPrimaryKeyword);
      }
      setIsModalOpen(false);
    } else {
      setIsModalOpen(false);
    }
  };

  const handleSecondaryDone = () => {
    // For secondary keywords, just merge and close
    const mergedArray = Array.from(new Set([...step3Data?.secondaryKeywords, ...step3Data?.temp])).filter(
      (item) => !step3Data?.removedRows?.includes(item)
    );

    setStep3Data({
      ...step3Data,
      secondaryKeywords: mergedArray,
      temp: [],
      removedRows: []
    });
    setIsModalOpen(false);
  };

  return (
    <div className='keywordmodal-content-wrapper'>
      <div className='custom-header'>
        <div className='header-text'>
          <span className='model-header'>Keyword Explorer</span>
          <span className='model-subheader'>({location})</span>
        </div>
        <div className='search-keyword-container'>
          <Input
            value={search}
            className='input-box'
            placeholder='Search Keywords'
            onChange={(e) => setSearch(e.target.value)}
            onBlur={() => {
              /// remove the removed row from the mereged array
              const mergedArray = Array.from(new Set([...step3Data?.secondaryKeywords, ...step3Data?.temp])).filter(
                (item) => !step3Data?.removedRows?.includes(item)
              );

              setStep3Data({
                ...step3Data,
                secondaryKeywords: mergedArray,
                temp: [],
                removedRows: []
              });
            }}
          />
          <Button loading={searchLoader} onClick={handleSearch}>
            Search
          </Button>
        </div>
      </div>
      <div className='scrollable-table-container'>
        <KeywordTable
          data={data}
          type={type}
          selection={selection}
          form={form}
          currentSelection={type === 'primaryKeyword' ? localPrimaryKeyword : undefined}
          onRowSelect={type === 'primaryKeyword' ? setLocalPrimaryKeyword : undefined}
        />
      </div>
      <div className='modal-footer-actions'>
        <Button type='primary' onClick={type === 'primaryKeyword' ? handlePrimaryDone : handleSecondaryDone}>
          Done
        </Button>
      </div>
    </div>
  );
}
