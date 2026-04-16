import React, { useState } from "react";
import { Modal, Form, Input, Select, Button, message } from "antd";
import { CustomerServiceOutlined } from "@ant-design/icons";
import "./SupportTicketForm.scss"; // Import the SCSS file
import closeIcon from "../../assets/icons/fontisto_close.svg";
import axios from "axios";

const SupportTicketModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const userId = localStorage.getItem("userId");
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
  });
  const [form] = Form.useForm();

  // Fetch user details from backend
  const fetchUserDetails = async () => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/getuser?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        setUserDetails({
          username: res.data.name,
          email: res.data.email,
        });
      })
      .catch((err) => {
        console.error("Error fetching user details:", err);
      });
  };

  const handleOpenModal = async () => {
    await fetchUserDetails();
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  /// handle loading for submitting ticket
  const [loading, setLoading] = useState(false);

  const handleSubmit = (values: any) => {
    setLoading(true); // Set loading to true while submitting ticket
    const ticketData = {
      userId: userId,
      subject: values.subject,
      category: values.category,
      description: values.description,
    };

    /// submit ticket data to backend to stor in zoho desk
    axios
      .post(`${process.env.REACT_APP_SERVER_URL}/createticket`, ticketData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        message.success(res?.data?.message || "Ticket created successfully");
      })
      .catch((err) => {
        message.error(
          err?.response?.data?.error?.message || "Error creating ticket"
        );
      })
      .finally(() => {
        setLoading(false); // Set loading to false after submission
        form.resetFields(); // Reset form fields after submission
        handleCloseModal(); // Close modal on successful submission
      });
  };

  return (
    <div>
      {/* Floating Button to Open Modal */}
      <Button
        type="primary"
        onClick={handleOpenModal}
        className="floating-button"
      >
        <CustomerServiceOutlined />
      </Button>

      {/* Support Ticket Modal */}
      <Modal
        title={null}
        visible={isModalVisible}
        // onCancel={handleCloseModal}
        wrapClassName="support-modal-container"
        className="support-modal"
        footer={null}
        maskClosable={false}
        mask={false}
        // width={400}
        closeIcon={
          <img
            src={closeIcon}
            alt="closeIcon"
            onClick={handleCloseModal}
            className="img-cancle"
          />
        }
      >
        <div className="modal-header">
          <h2>
            Hi {userDetails.username}{" "}
            <span role="img" aria-label="wave">
              👋
            </span>
          </h2>
          <p>{userDetails.email}</p>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            category: "General Inquiry",
          }}
        >
          <Form.Item
            label={<strong>Subject</strong>}
            name="subject"
            rules={[
              { required: true, message: "Please enter your topic/issue" },
              {
                whitespace: true,
                message: "Subject cannot be empty or spaces only",
              },
            ]}
          >
            <Input placeholder="Please enter your topic/issue" />
          </Form.Item>

          <Form.Item
            label={<strong>Category</strong>}
            name="category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select>
              <Select.Option value="General Inquiry">
                General Inquiry
              </Select.Option>
              <Select.Option value="Technical Support">
                Technical Support
              </Select.Option>
              <Select.Option value="Billing">Billing</Select.Option>
              <Select.Option value="Others">Others</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label={<strong>Description</strong>}
            name="description"
            rules={[
              {
                required: true,
                message: "Please describe your topic/issue in detail",
              },
              {
                whitespace: true,
                message: "Description cannot be empty or spaces only",
              },
            ]}
          >
            <Input.TextArea
              placeholder="Describe your topic/issue in detail"
              rows={4}
            />
          </Form.Item>

          <Form.Item style={{ display: "flex", justifyContent: "start" }}>
            <Button
              type="primary"
              htmlType="submit"
              className="submit-button"
              style={{ width: "fit-content" }}
              loading={loading}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SupportTicketModal;
