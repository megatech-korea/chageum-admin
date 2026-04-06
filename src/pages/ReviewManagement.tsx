// src/pages/ReviewManagement.tsx
import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Typography,
  message,
  Popconfirm,
  Tag,
  Modal,
  Form,
  Input,
} from "antd";
import {
  DeleteOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import api from "../api/client";
import dayjs from "dayjs";

const { Title, Text } = Typography;

interface ReviewItem {
  reviewId: string;
  authorName: string;
  category: string;
  content: string;
  likes: number;
  blinded?: boolean;
  blindReason?: string;
  createdAt?: string;
}

export default function ReviewManagement() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [blindItem, setBlindItem] = useState<ReviewItem | null>(null);
  const [form] = Form.useForm();

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/reviews", {
        params: { limit: 100 },
      });
      setReviews(res.data as ReviewItem[]);
    } catch {
      message.error("후기 목록 불러오기 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (reviewId: string) => {
    try {
      await api.delete(`/api/admin/reviews/${reviewId}`);
      message.success("삭제 완료");
      fetchReviews();
    } catch {
      message.error("삭제 실패");
    }
  };

  const handleBlind = async () => {
    const { reason } = await form.validateFields();
    try {
      await api.patch(`/api/admin/reviews/${blindItem?.reviewId}/blind`, {
        reason,
      });
      message.success("블라인드 처리 완료");
      setBlindItem(null);
      fetchReviews();
    } catch {
      message.error("실패");
    }
  };

  const handleUnblind = async (reviewId: string) => {
    try {
      await api.patch(`/api/admin/reviews/${reviewId}/unblind`);
      message.success("블라인드 해제 완료");
      fetchReviews();
    } catch {
      message.error("실패");
    }
  };

  const columns = [
    { title: "작성자", dataIndex: "authorName", key: "authorName", width: 90 },
    { title: "카테고리", dataIndex: "category", key: "category", width: 120 },
    {
      title: "내용",
      dataIndex: "content",
      key: "content",
      render: (v: string) => (
        <span
          style={{
            WebkitLineClamp: 2,
            display: "-webkit-box",
            WebkitBoxOrient: "vertical" as const,
            overflow: "hidden",
          }}
        >
          {v}
        </span>
      ),
    },
    {
      title: "좋아요",
      dataIndex: "likes",
      key: "likes",
      width: 70,
      sorter: (a: ReviewItem, b: ReviewItem) => a.likes - b.likes,
    },
    {
      title: "상태",
      dataIndex: "blinded",
      key: "blinded",
      width: 90,
      render: (v: boolean) =>
        v ? <Tag color="red">블라인드</Tag> : <Tag color="green">정상</Tag>,
    },
    {
      title: "작성일",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (v: string) => (v ? dayjs(v).format("YYYY.MM.DD") : "-"),
    },
    {
      title: "관리",
      key: "action",
      width: 160,
      render: (_: unknown, record: ReviewItem) => (
        <Space>
          {record.blinded ? (
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleUnblind(record.reviewId)}
            >
              해제
            </Button>
          ) : (
            <Button
              size="small"
              icon={<EyeInvisibleOutlined />}
              onClick={() => {
                setBlindItem(record);
                form.resetFields();
              }}
            >
              블라인드
            </Button>
          )}
          <Popconfirm
            title="삭제하시겠습니까?"
            onConfirm={() => handleDelete(record.reviewId)}
            okText="삭제"
            cancelText="취소"
            okButtonProps={{ danger: true }}
          >
            <Button size="small" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>
          후기 관리
        </Title>
        <Text type="secondary">사용자 환급 후기 관리</Text>
      </div>

      <Table
        columns={columns}
        dataSource={reviews}
        rowKey="reviewId"
        loading={loading}
        pagination={{ pageSize: 20 }}
        size="middle"
      />

      <Modal
        title="블라인드 처리"
        open={!!blindItem}
        onOk={handleBlind}
        onCancel={() => setBlindItem(null)}
        okText="블라인드"
        cancelText="취소"
        okButtonProps={{ danger: true }}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="reason"
            label="블라인드 사유"
            rules={[{ required: true, message: "사유를 입력하세요" }]}
          >
            <Input.TextArea rows={3} placeholder="블라인드 사유 입력" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
