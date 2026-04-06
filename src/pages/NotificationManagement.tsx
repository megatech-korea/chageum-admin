// src/pages/NotificationManagement.tsx
import { useState } from "react";
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Typography,
  message,
  Alert,
} from "antd";
import { SendOutlined } from "@ant-design/icons";
import api from "../api/client";

const { Title, Text } = Typography;

export default function NotificationManagement() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSend = async () => {
    const values = await form.validateFields();
    setLoading(true);
    try {
      const res = await api.post("/api/admin/notifications/push", {
        target: values.target,
        title: values.title,
        body: values.body,
      });
      const sent = (res.data as { sent: number }).sent;
      message.success(`${sent}명에게 푸시 알림 발송 완료!`);
      form.resetFields();
    } catch {
      message.error("발송 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>
          푸시 알림 발송
        </Title>
        <Text type="secondary">앱 사용자에게 푸시 알림을 발송합니다</Text>
      </div>

      <Alert
        message="마케팅 푸시 알림 동의 여부를 확인하고 발송하세요."
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Card style={{ maxWidth: 560 }}>
        <Form form={form} layout="vertical">
          <Form.Item
            name="target"
            label="발송 대상"
            rules={[{ required: true }]}
            initialValue="marketing"
          >
            <Select
              options={[
                { value: "marketing", label: "마케팅 동의 유저 전체" },
                { value: "all", label: "전체 유저" },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="title"
            label="제목"
            rules={[{ required: true, message: "제목을 입력하세요" }]}
          >
            <Input placeholder="알림 제목" maxLength={50} showCount />
          </Form.Item>
          <Form.Item
            name="body"
            label="내용"
            rules={[{ required: true, message: "내용을 입력하세요" }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="알림 내용"
              maxLength={200}
              showCount
            />
          </Form.Item>
          <Button
            type="primary"
            icon={<SendOutlined />}
            loading={loading}
            onClick={handleSend}
            block
            size="large"
          >
            발송하기
          </Button>
        </Form>
      </Card>
    </div>
  );
}
