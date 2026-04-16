import React, { useContext, useEffect, useState } from 'react';
import { Table, message } from 'antd';
import type { TableColumnsType } from 'antd';
import './table.scss';
import { GlobalContext } from '../../Context';
import sortSvg from '../../assets/icons/sort.svg';
import { ReactComponent as CloseIcon } from '../../assets/icons/fontisto_close.svg';
import Icon from '@ant-design/icons';

interface DataType {
  key: React.Key;
  Keywords: string;
  Volume: number | string;
  Difficulty: number;
}

const SortIcon = () => (
  <>
    <img src={sortSvg} alt='sort' />
  </>
);

export default function KeywordTable({ data, type, selection, form, currentSelection, onRowSelect }: any) {
  const { step1Data, setStep1Data, step3Data, setStep3Data }: any = useContext(GlobalContext);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [secondary, setSecondary]: any = useState([]);

  const selectionType: 'checkbox' | 'radio' = selection;

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Keywords',
      dataIndex: 'Keywords',
      render: (text: string) => <a>{text}</a>,
      width: '400px'
    },
    {
      title: 'Volume',
      dataIndex: 'Volume',
      sorter: (a: any, b: any) => a?.Volume - b?.Volume,
      ellipsis: true,
      render: (text: string) => <div className='volume-text'>{text}</div>,
      sortIcon: SortIcon,
      showSorterTooltip: false,
      className: 'volume'
    }
  ];

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[], e: any) => {
      setSelectedRowKeys(selectedRowKeys);
      if (type === 'primaryKeyword') {
        if (onRowSelect) {
          onRowSelect(selectedRows[0]?.Keywords);
        } else {
          setStep1Data({
            ...step1Data,
            primaryKeyword: selectedRows[0].Keywords
          });
          form.setFieldsValue({
            primaryKeyword: selectedRows[0].Keywords
          });
        }
      }
      if (type === 'secondaryKeyword') {
        const selectedKeywords = selectedRows.map((item) => item.Keywords);
        const removedRows = step3Data?.secondaryKeywords?.filter((item: any) => !selectedKeywords?.includes(item));
        const keywordsData = data?.map((item: any) => item.Keywords);
        const removedRowsData = removedRows?.filter((item: any) => keywordsData?.includes(item));
        // setStep3Data({
        //   ...step3Data,
        //   temp: selectedKeywords,
        //   removedRows: removedRowsData
        // });

        const mergedArray = Array.from(new Set([...step3Data?.secondaryKeywords, ...selectedKeywords])).filter(
          (item) => !removedRowsData?.includes(item)
        );

        setStep3Data({
          ...step3Data,
          secondaryKeywords: mergedArray,
          temp: [],
          removedRows: []
        });
      }
    },
    getCheckboxProps: (record: DataType) => {
      let length = step3Data?.secondaryKeywords?.length + step3Data?.temp?.length;
      const duplicateKeywords = step3Data?.temp.filter((item: any) => step3Data.secondaryKeywords.includes(item));
      length = length - duplicateKeywords.length - step3Data.removedRows.length;

      if (length >= 5) {
        const isSelected =
          step3Data?.secondaryKeywords?.includes(record.Keywords) || step3Data?.temp?.includes(record.Keywords);

        const shouldDisable = length >= 5 && isSelected;

        return { disabled: !(shouldDisable && isSelected) };
      }
      // }

      return {};
    }
  };

  useEffect(() => {
    // Reset selected rows when data changes
    if (type === 'primaryKeyword') {
      const targetKeyword = currentSelection !== undefined ? currentSelection : step1Data.primaryKeyword;
      const selectedKeys = data
        ?.map((item: any) => (targetKeyword == item.Keywords ? item.key : null))
        .filter((value: any) => value !== null);
      setSelectedRowKeys(selectedKeys);
    }

    if (type === 'secondaryKeyword') {
      /// selected keys will only be the secondary keywords
      const selectedKeys = data?.map((item: any) =>
        step3Data.secondaryKeywords.includes(item.Keywords) ? item.key : null
      );

      setSelectedRowKeys(selectedKeys);
    }
  }, [data, currentSelection, step1Data.primaryKeyword]);

  return (
    <div className='table-wrapper'>
      {type === 'secondaryKeyword' && (
        <div className='selected-keywords'>
          <h3>Selected Secondary Keywords:</h3>
          <div className='keywords-list'>
            {Array.from(new Set([...step3Data.secondaryKeywords, ...step3Data.temp])).map((keyword, index) => (
              <span key={index} className='keyword-tag'>
                {keyword}
                <span
                  className='remove-keyword'
                  onClick={() => {
                    const updatedKeywords = step3Data.secondaryKeywords.filter((kw: string) => kw !== keyword);
                    const updatedTemp = step3Data.temp.filter((kw: string) => kw !== keyword);

                    setStep3Data({
                      ...step3Data,
                      secondaryKeywords: updatedKeywords,
                      temp: updatedTemp
                    });

                    setSelectedRowKeys((prevKeys) =>
                      prevKeys.filter((key) => data.find((item: any) => item.key === key)?.Keywords !== keyword)
                    );
                  }}
                >
                  <Icon component={CloseIcon} />
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
      {type === 'primaryKeyword' && (
        <div className='selected-keywords'>
          <h3>
            Selected Primary Keywords: <span className='keyword-tag'>{currentSelection !== undefined ? currentSelection : step1Data.primaryKeyword}</span>
          </h3>
        </div>
      )}
      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection
        }}
        onRow={(record) => ({
          onClick: () => {
            if (type === 'primaryKeyword') {
              if (onRowSelect) {
                onRowSelect(record.Keywords);
              } else {
                setStep1Data({
                  ...step1Data,
                  primaryKeyword: record.Keywords
                });
                form.setFieldsValue({
                  primaryKeyword: record.Keywords
                });
              }
              setSelectedRowKeys([record.key]);
            }
          },
          style: { cursor: 'pointer' }
        })}
        dataSource={data}
        columns={columns}
        pagination={false}
        rowKey={(record) => record.key}
      />
    </div>
  );
}
