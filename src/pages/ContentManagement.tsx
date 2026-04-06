// src/pages/ContentManagement.tsx
import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Typography,
  message,
  Popconfirm,
  Tag,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import api from "../api/client";

const { Title, Text } = Typography;

const SECTION_OPTIONS = [
  { value: "daily", label: "일상 속 의외의 보상" },
  { value: "money", label: "놓치면 손해인 큰 돈" },
  { value: "tips", label: "이것도 알아두세요" },
];

const SECTION_COLORS: Record<string, string> = {
  daily: "blue",
  money: "green",
  tips: "orange",
};

interface CaseItem {
  caseId: string;
  sectionKey: string;
  title: string;
  tag: string;
  subtitle: string;
  description: string;
  tipTitle: string;
  tipContent: string;
  emoji: string;
  sortOrder: number;
}

export default function ContentManagement() {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CaseItem | null>(null);
  const [form] = Form.useForm();

  const fetchCases = async () => {
    setLoading(true);
    try {
      const data = await api.get("/api/admin/cases");
      setCases(data.data as CaseItem[]);
    } catch {
      message.error("사례집 불러오기 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const openCreate = () => {
    setEditingItem(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (item: CaseItem) => {
    setEditingItem(item);
    form.setFieldsValue(item);
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    try {
      if (editingItem) {
        await api.put(`/api/admin/cases/${editingItem.caseId}`, values);
        message.success("수정 완료");
      } else {
        await api.post("/api/admin/cases", values);
        message.success("추가 완료");
      }
      setModalOpen(false);
      fetchCases();
    } catch {
      message.error("저장 실패");
    }
  };

  const handleDelete = async (caseId: string) => {
    try {
      await api.delete(`/api/admin/cases/${caseId}`);
      message.success("삭제 완료");
      fetchCases();
    } catch {
      message.error("삭제 실패");
    }
  };

  const columns = [
    {
      title: "구분",
      dataIndex: "sectionKey",
      key: "sectionKey",
      width: 160,
      render: (v: string) => (
        <Tag color={SECTION_COLORS[v] || "default"}>
          {SECTION_OPTIONS.find((o) => o.value === v)?.label || v}
        </Tag>
      ),
      filters: SECTION_OPTIONS.map((o) => ({ text: o.label, value: o.value })),
      onFilter: (value: unknown, record: CaseItem) =>
        record.sectionKey === value,
    },
    { title: "이모지", dataIndex: "emoji", key: "emoji", width: 60 },
    { title: "제목", dataIndex: "title", key: "title" },
    { title: "태그", dataIndex: "tag", key: "tag", width: 120 },
    { title: "소제목", dataIndex: "subtitle", key: "subtitle" },
    {
      title: "순서",
      dataIndex: "sortOrder",
      key: "sortOrder",
      width: 70,
      sorter: (a: CaseItem, b: CaseItem) => a.sortOrder - b.sortOrder,
    },
    {
      title: "관리",
      key: "action",
      width: 120,
      render: (_: unknown, record: CaseItem) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => openEdit(record)}
          >
            수정
          </Button>
          <Popconfirm
            title="삭제하시겠습니까?"
            onConfirm={() => handleDelete(record.caseId)}
            okText="삭제"
            cancelText="취소"
            okButtonProps={{ danger: true }}
          >
            <Button icon={<DeleteOutlined />} size="small" danger>
              삭제
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
        }}
      >
        <div>
          <Title level={4} style={{ margin: 0 }}>
            콘텐츠 관리
          </Title>
          <Text type="secondary">앱 사례집 콘텐츠를 관리합니다.</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          콘텐츠 추가
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={cases}
        rowKey="caseId"
        loading={loading}
        pagination={{ pageSize: 10 }}
        size="middle"
      />

      <Modal
        title={editingItem ? "콘텐츠 수정" : "콘텐츠 추가"}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText={editingItem ? "수정" : "추가"}
        cancelText="취소"
        width={600}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="sectionKey"
            label="구분"
            rules={[{ required: true }]}
          >
            <Select options={SECTION_OPTIONS} placeholder="구분 선택" />
          </Form.Item>
          <Space style={{ width: "100%" }}>
            <Form.Item name="emoji" label="이모지" style={{ width: 100 }}>
              <Input placeholder="🚗" />
            </Form.Item>
            <Form.Item
              name="sortOrder"
              label="정렬 순서"
              style={{ width: 120 }}
            >
              <Input type="number" placeholder="0" />
            </Form.Item>
          </Space>
          <Form.Item name="title" label="제목" rules={[{ required: true }]}>
            <Input placeholder="제목을 입력하세요" />
          </Form.Item>
          <Form.Item name="tag" label="태그">
            <Input placeholder="태그" />
          </Form.Item>
          <Form.Item name="subtitle" label="소제목">
            <Input placeholder="소제목" />
          </Form.Item>
          <Form.Item name="description" label="설명">
            <Input.TextArea rows={3} placeholder="설명" />
          </Form.Item>
          <Form.Item name="tipTitle" label="팁 제목">
            <Input placeholder="팁 제목" />
          </Form.Item>
          <Form.Item name="tipContent" label="팁 내용">
            <Input.TextArea rows={2} placeholder="팁 내용" />
          </Form.Item>
          <Form.Item name="bgColor" label="배경색">
            <Input placeholder="#F5F5F5" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
