import React, { useEffect, useState } from 'react';
import { Button, message, Table } from 'antd';
import Icon from '@ant-design/icons';
import { ReactComponent as InvoiceSvg } from '../../assets/icons/invoice.svg';
import { ReactComponent as DownloadIcon } from '../../assets/icons/fill-down-arrow.svg';
import axios from 'axios';

const InvoiceTable = () => {
  //   const invoiceDataSource = [
  //     {
  //       key: "1",
  //       invoiceId: "#564456",
  //       invoiceDate: "01/06/2024",
  //       datePaid: "01/06/2024",
  //       amount: "49",
  //       status: "Pending",
  //       invoicePDF: "invoice.pdf",
  //     },
  //     {
  //       key: "2",
  //       invoiceId: "#564456",
  //       invoiceDate: "01/06/2024",
  //       datePaid: "01/06/2024",
  //       amount: "29",
  //       status: "Paid",
  //       invoicePDF: "invoice.pdf",
  //     },
  //   ];

  const [invoiceDataSource, setInvoiceDataSource] = useState([]);

  const columns = [
    {
      title: <span style={{ color: '#000000' }}>Invoice Date</span>,
      dataIndex: 'invoiceDate',
      key: 'invoiceDate',
      render: (_: any, record: any) => {
        return <div className='content-wrap'>{record?.invoiceDate}</div>;
      }
    },
    {
      title: <span style={{ color: '#000000' }}>Invoice ID</span>,
      dataIndex: 'invoiceId',
      key: 'invoiceId',
      render: (_: any, record: any) => {
        return (
          <div className='content-wrap'>
            <div className='invoice-title'>#{record?.invoiceId}</div>
          </div>
        );
      }
    },
    {
      title: <span style={{ color: '#000000' }}>Date Paid</span>,
      dataIndex: 'datePaid',
      key: 'datePaid',
      render: (_: any, record: any) => {
        return <div className='content-wrap'>{record?.datePaid}</div>;
      }
    },

    {
      title: <span style={{ color: '#000000' }}>Amount</span>,
      dataIndex: 'amount',
      key: 'amount',
      width: 130,
      render: (_: any, record: any) => {
        return <div className='content-wrap'>${record?.amount}</div>;
      }
    },
    {
      title: <span style={{ color: '#000000' }}>Status</span>,
      dataIndex: 'status',
      key: 'status',
      width: 160,
      render: (_: any, record: any) => {
        return (
          <div className='content-wrap'>
            <span className={`status ${record?.status.toLowerCase()}`}>{record?.status}</span>
          </div>
        );
      }
    },
    {
      title: <span style={{ color: '#000000' }}>Invoice PDF</span>,
      dataIndex: 'invoicePDF',
      key: 'invoicePDF',
      width: 130,
      render: (_: any, record: any) => {
        return (
          <div className='content-wrap'>
            <Button
              className='action'
              onClick={() => {
                if (record?.invoicePDF) window.open(record?.invoicePDF);
                else message.error({ content: 'No invoice PDF found', key: 'no-invoice' });
              }}
            >
              <Icon component={DownloadIcon} /> Download
            </Button>
          </div>
        );
      }
    }
  ];

  const getInvoices = async () => {
    // fetch invoices
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/invoices/list?limit=10&userId=${localStorage.getItem('userId')}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      /// set invoice data source
      setInvoiceDataSource(response.data);
    } catch (error) {
      message.error('Failed to fetch invoices');
    }
  };

  useEffect(() => {
    getInvoices();
  }, []);

  return (
    <div className='table-wrapper invoice-table'>
      <Table sticky scroll={{ x: 950 }} dataSource={invoiceDataSource} columns={columns} pagination={false} />
    </div>
  );
};

export default InvoiceTable;
