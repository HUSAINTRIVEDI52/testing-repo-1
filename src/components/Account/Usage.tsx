import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { GlobalContext } from '../../Context';
import { Collapse, message, Progress, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import Icon from '@ant-design/icons';
import { ReactComponent as DownArrow } from '../../assets/icons/DownArrow.svg';
import { ReactComponent as Dot } from '../../assets/icons/dot.svg';

const Usage = () => {
  const { usage }: any = useContext(GlobalContext);
  

  const [activeKey, setActiveKey] = useState<string>('1');
  const [usageDataSource, setUsageDataSource] = useState([[]]);
  const tableComponents = {
    header: {
      cell: (props: any) => (
        <th
          {...props}
          style={{
            ...(props.style || {}),
            borderColor: '#bdbdbd'
          }}
        />
      )
    },
    body: {
      cell: (props: any) => (
        <td
          {...props}
          style={{
            ...(props.style || {}),
            borderColor: '#bdbdbd'
          }}
        />
      )
    }
  };
  const columns: ColumnsType<any> = [
    {
      title: <span style={{ color: '#000000' }}>Date</span>,
      dataIndex: 'date',
      key: 'date',
      align: 'center',
      width: '20%',

      render: (_: any, record: any) => {
        const dateString = new Date(record.createdAt).toLocaleDateString('en-GB');
        return <div>{dateString}</div>;
      }
    },
    {
      title: <span style={{ color: '#000000' }}>Activity</span>,
      align: 'left',
      dataIndex: 'activity',
      key: 'activity',
      render: (_: any, record: any) => {
        return (
          <div>
            <Dot style={{ fill: record.count > 0 ? 'green' : 'red' }} /> {record.message}
          </div>
        );
      }
    },
    {
      title: <span style={{ color: '#000000' }}>Count</span>,
      dataIndex: 'count',
      key: 'count',
      align: 'center',
      width: '20%',

      render: (_: any, record: any) => {
        return <div style={{ color: record.count > 0 ? 'green' : 'red' }}>{record.count}</div>;
      }
    },
    {
      title: <span style={{ color: '#000000' }}>Remaining Count</span>,
      dataIndex: 'totalCount',
      key: 'totalCount',
      align: 'center',
      width: '20%',

      render: (_: any, record: any) => {
        return <div>{record.totalCount}</div>;
      }
    }
  ];

  const getInvoices = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/usage-logs?userId=${localStorage.getItem('userId')}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      /// set invoice data source
      setUsageDataSource(response.data);
    } catch (error) {
      message.error({ content: 'Failed to fetch invoices', key: 'invoice-fetch-failed' });
    }
  };
  const onChange = (key: any) => {
    setActiveKey(key);
  };
  const blogItems: any = [
    {
      key: '1',
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#777777', fontSize: '18px' }}>
          Credit usage breakdown
          <Icon
            component={DownArrow}
            style={{
              transform: activeKey.includes('1') ? 'rotate(180deg)' : 'rotate(0deg)',
              fontSize: '20px',
              color: '#ff7c02',
              transition: 'transform 0.3s'
            }}
          />
        </div>
      ),
      children: (
        <div className='table-wrapper invoice-table'>
          <Table
            sticky
            bordered
            components={tableComponents}
            dataSource={usageDataSource[0]}
            columns={columns}
            pagination={false}
          />
        </div>
      )
    }
  ];

  const PlagItems: any = [
    {
      key: '3',
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#777777', fontSize: '18px' }}>
          Credit usage breakdown
          <Icon
            component={DownArrow}
            style={{
              transform: activeKey.includes('3') ? 'rotate(180deg)' : 'rotate(0deg)',
              fontSize: '20px',
              color: '#ff7c02',
              transition: 'transform 0.3s'
            }}
          />
        </div>
      ),
      children: (
        <div className='table-wrapper invoice-table'>
          <Table
            sticky
            bordered
            components={tableComponents}
            dataSource={usageDataSource[2]}
            columns={columns}
            pagination={false}
          />
        </div>
      )
    }
  ];

  useEffect(() => {
    getInvoices();
  }, []);

  // ✅ Skeleton Loader (Placed AFTER hooks)
  if (!usage || (usage.totalBlog === 0 && usage.usedBlog === 0 && usage.totalPlagiarism === 0)) {
    return (
      <div className='usage-container'>
        {[1, 2, 3].map((i) => (
          <div className='item-container' key={i}>
            {/* Title Skeleton */}
            <h2 style={{ width: '200px', height: '24px', backgroundColor: '#f0f0f0', borderRadius: '4px', marginBottom: '16px' }} />
            
            {/* Subtext Skeleton */}
            <p style={{ width: '300px', height: '20px', backgroundColor: '#f0f0f0', borderRadius: '4px', marginBottom: '16px' }} />
            
            {/* Progress Bar Skeleton */}
            <div style={{ width: '100%', height: '8px', backgroundColor: '#f0f0f0', borderRadius: '10px', marginBottom: '16px' }} />
            
            {/* Collapse Header Skeleton */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '180px', height: '20px', backgroundColor: '#f0f0f0', borderRadius: '4px' }} />
              <div style={{ width: '20px', height: '20px', backgroundColor: '#f0f0f0', borderRadius: '50%' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className='usage-container'>
      <div className='item-container'>
        <h2>Blog Count</h2>
        <p style={{ color: '#777777', fontSize: '16px' }}>
          {usage?.usedBlog || 0} out of {usage?.totalBlog || 0} Blogs count/mo{' '}
        </p>
        <Progress 
          percent={usage?.totalBlog ? ((usage.usedBlog / usage.totalBlog) * 100) : 0} 
          showInfo={false} 
          strokeColor={'#ff7c02'} 
        />

        <Collapse expandIcon={() => null} activeKey={activeKey} onChange={onChange} items={blogItems} />
      </div>

      <div className='item-container'>
        <h2>Plagiarism Count</h2>
        <p style={{ color: '#777777', fontSize: '16px' }}>
          {usage?.usedPlagiarism || 0} out of {usage?.totalPlagiarism || 0} Plagiarism count/mo{' '}
        </p>
        <Progress
          percent={usage?.totalPlagiarism ? ((usage.usedPlagiarism / usage.totalPlagiarism) * 100) : 0}
          showInfo={false}
          strokeColor={'#ff7c02'}
        />
        <Collapse expandIcon={() => null} activeKey={activeKey} onChange={onChange} items={PlagItems} />
      </div>
      {/* {usageDataSource[0].length > 0 && (
        <div className='table-wrapper invoice-table'>
          <Table sticky scroll={{ x: 950 }} dataSource={usageDataSource[0]} columns={columns} pagination={false} />
        </div>
      )} */}
    </div>
  );
};

export default Usage;
