import React, { useContext, useState } from "react";
import { Modal, Table, message, Tooltip } from "antd";
import "./table.scss";
import Icon from "@ant-design/icons";
import { ReactComponent as BlogSvg } from "../../assets/icons/blogsvg.svg";
import { ReactComponent as DeleteSvg } from "../../assets/icons/delete.svg";
import { ReactComponent as EditSvg } from "../../assets/icons/outline-edit.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../Context";
import DeleteConfirmationModal from "../Model/ConfirmDeleteModel";

const DraftTable = ({ draft, fetchBlogData }: any) => {
  const navigate = useNavigate();
  const {
    setStep4Data,
    setStep1Data,
    setParsona,
    setBrandVoice,
    setStep3Data,
    step3Data,
    setDraftId,
    setCurrentScreen,
    setStep2Data,
    setRegenerate,
  }: any = useContext(GlobalContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recordId, setRecordId] = useState([]);
  const deleteModel = (record: any) => {
    setRecordId(record);
    setIsModalOpen(true);
  };
  const columns = [
    {
      title: "Draft Title",
      dataIndex: "title",
      key: "title",
      render: (_: any, record: any) => {
        return (
          <div className="content-wrap">
            <Icon component={BlogSvg} />{" "}
            <span className="title">{record?.title}</span>
          </div>
        );
      },
    },
    {
      title: "Date Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 160,
      render: (_: any, record: any) => {
        const dateObj = new Date(record.createdAt);
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = dateObj.toLocaleString('en-US', { month: 'short' });
        const year = dateObj.getFullYear();
        const dateString = `${day} ${month} ${year}`;
        return (
          <div className="content-wrap">
            <span>{dateString}</span>
          </div>
        );
      },
    },
    {
      title: "Last Edited",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 160,
      render: (_: any, record: any) => {
        const dateObj = new Date(record.updatedAt || record.createdAt);
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = dateObj.toLocaleString('en-US', { month: 'short' });
        const year = dateObj.getFullYear();
        const dateString = `${day} ${month} ${year}`;
        return (
          <div className="content-wrap">
            <span>{dateString}</span>
          </div>
        );
      },
    },
    {
      title: "",
      width: 45,
      render: (_: any, record: any) => {
        return (
          <div className="table-action">
            <Icon
              component={EditSvg}
              className="edit-icon"
              onClick={() => {
                setStep1Data((prevData: any) => ({
                  ...prevData,
                  topic: record.topic,
                  title: record.title,
                  selectedLocation: record.location,
                  primaryKeyword: record.primaryKeyword,
                  hasGeneratedTitle: record.hasGeneratedTitle,
                  hasGeneratedPrimaryKeywords: record.hasGeneratedPrimaryKeywords,
                }));
                setParsona(record.aiPersona);
                setBrandVoice(record.brandVoice);
                setStep4Data({
                  links: record.internalLinks ? record.internalLinks : [],
                });
                setStep3Data({
                  ...step3Data,
                  secondaryKeywords: record.secondaryKeywords,
                  hasGeneratedSecondaryKeywords: record.hasGeneratedSecondaryKeywords,
                });
                setDraftId(record.id);
                setRegenerate(false);
                setCurrentScreen(1);
                setStep2Data({
                  scrappedUrl: [],
                  files: [],
                });
                navigate(`/createblog`);
              }}
            />
          </div>
        );
      },
    },
    {
      title: "",
      width: 45,
      render: (_: any, record: any) => {
        return (
          <div className="table-action">
            <Tooltip title="Delete">
              <Icon
                component={DeleteSvg}
                data-testid="delete-blog"
                onClick={(e) => deleteModel(record)}
                className="delete-icon"
              />
            </Tooltip>
          </div>
        );
      },
    },
  ];
  //This function is for deleting blog
  const handleDelete = async (record: any) => {
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/delete-draft?id=${record?.id}`,
        "",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (result.status === 200) {
        message.success(result?.data?.message);
        fetchBlogData();
      } else {
        message.error(result?.data?.error);
      }
    } catch (error: any) {
      message.error(
        error?.response?.data?.error
          ? error?.response?.data?.error
          : error?.message
      );
    }
  };

  return (
    <div className="table-wrapper table-blog">
      <Table
        sticky
        scroll={{
          x: 750,
          y:
            window.innerWidth < 1441
              ? "calc(100vh - 240px)"
              : "calc(100vh - 270px)",
        }}
        dataSource={draft}
        columns={columns}
        pagination={false}
        rowKey={(record) => record.key}
      />
      <Modal
        centered
        className="keyword-model"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        closable={false}
      >
        <DeleteConfirmationModal
          setIsModalOpen={setIsModalOpen}
          handleDelete={handleDelete}
          recordId={recordId}
        />
      </Modal>
    </div>
  );
};

export default DraftTable;
