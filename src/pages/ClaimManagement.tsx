// src/pages/ClaimManagement.tsx
import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Typography,
  message,
  Popconfirm,
  Tag,
  Select,
  Modal,
  Descriptions,
  Form,
  Input,
  InputNumber,
} from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import api from "../api/client";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const STATUS_OPTIONS = [
  { value: "PENDING", label: "접수 완료", color: "default" },
  { value: "IN_REVIEW", label: "검토 중", color: "processing" },
  { value: "PROCESSING", label: "처리 중", color: "warning" },
  { value: "COMPLETED", label: "완료", color: "success" },
  { value: "REJECTED", label: "반려", color: "error" },
];

type TagColor = "default" | "processing" | "warning" | "success" | "error";

const statusInfo = (status: string) =>
  STATUS_OPTIONS.find((s) => s.value === status) || {
    label: status,
    color: "default" as TagColor,
  };

interface ClaimItem {
  claimId: string;
  name: string;
  applicantType: string;
  roadAddress?: string;
  faultRatio?: string;
  hospitalVisit?: string;
  accidentDescription?: string;
  status: string;
  refundAmount?: number;
  adminMemo?: string;
  createdAt?: string;
}

export default function ClaimManagement() {
  const [claims, setClaims] = useState<ClaimItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [detailItem, setDetailItem] = useState<ClaimItem | null>(null);
  const [editItem, setEditItem] = useState<ClaimItem | null>(null);
  const [form] = Form.useForm();

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/claims", {
        params: {
          limit: 100,
          ...(statusFilter ? { status: statusFilter } : {}),
        },
      });
      setClaims(res.data as ClaimItem[]);
    } catch {
      message.error("신청 목록 불러오기 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [statusFilter]);

  const openEdit = (item: ClaimItem) => {
    setEditItem(item);
    form.setFieldsValue({
      status: item.status,
      refundAmount: item.refundAmount,
      adminMemo: item.adminMemo,
    });
  };

  const handleUpdateStatus = async () => {
    const values = await form.validateFields();
    try {
      await api.patch(`/api/admin/claims/${editItem?.claimId}/status`, values);
      message.success("상태 업데이트 완료");
      setEditItem(null);
      fetchClaims();
    } catch {
      message.error("실패");
    }
  };

  const handleDelete = async (claimId: string) => {
    try {
      await api.delete(`/api/admin/claims/${claimId}`);
      message.success("삭제 완료");
      fetchClaims();
    } catch {
      message.error("삭제 실패");
    }
  };

  const columns = [
    { title: "신청자", dataIndex: "name", key: "name", width: 90 },
    {
      title: "사고 지역",
      dataIndex: "roadAddress",
      key: "roadAddress",
      width: 120,
    },
    {
      title: "사고 유형",
      dataIndex: "faultRatio",
      key: "faultRatio",
      width: 100,
      render: (v: string) =>
        v === "solo" ? "단독" : v === "undecided" ? "모름" : `${v} 과실`,
    },
    {
      title: "상태",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (v: string) => {
        const s = statusInfo(v);
        return <Tag color={s.color as TagColor}>{s.label}</Tag>;
      },
    },
    {
      title: "환급금",
      dataIndex: "refundAmount",
      key: "refundAmount",
      width: 120,
      render: (v: number) => (v ? `${v.toLocaleString()}원` : "-"),
    },
    {
      title: "신청일",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (v: string) => (v ? dayjs(v).format("YYYY.MM.DD") : "-"),
    },
    {
      title: "관리",
      key: "action",
      width: 150,
      render: (_: unknown, record: ClaimItem) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => setDetailItem(record)}
          />
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEdit(record)}
          >
            상태
          </Button>
          <Popconfirm
            title="삭제하시겠습니까?"
            onConfirm={() => handleDelete(record.claimId)}
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
            환급 신청 관리
          </Title>
          <Text type="secondary">사용자 환급 신청 현황 및 상태 관리</Text>
        </div>
        <Select
          placeholder="상태 필터"
          allowClear
          style={{ width: 140 }}
          onChange={(v) => setStatusFilter(v || "")}
          options={STATUS_OPTIONS}
        />
      </div>

      <Table
        columns={columns}
        dataSource={claims}
        rowKey="claimId"
        loading={loading}
        pagination={{ pageSize: 20 }}
        size="middle"
      />

      <Modal
        title="신청 상세"
        open={!!detailItem}
        onCancel={() => setDetailItem(null)}
        footer={null}
        width={560}
      >
        {detailItem && (
          <Descriptions
            column={1}
            bordered
            size="small"
            style={{ marginTop: 16 }}
          >
            <Descriptions.Item label="신청 ID">
              {detailItem.claimId}
            </Descriptions.Item>
            <Descriptions.Item label="신청자">
              {detailItem.name}
            </Descriptions.Item>
            <Descriptions.Item label="신청 유형">
              {detailItem.applicantType === "SELF" ? "본인" : "대리인"}
            </Descriptions.Item>
            <Descriptions.Item label="사고 지역">
              {detailItem.roadAddress || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="과실 비율">
              {detailItem.faultRatio || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="병원 방문">
              {detailItem.hospitalVisit}
            </Descriptions.Item>
            <Descriptions.Item label="사고 경위">
              {detailItem.accidentDescription}
            </Descriptions.Item>
            <Descriptions.Item label="상태">
              {statusInfo(detailItem.status).label}
            </Descriptions.Item>
            <Descriptions.Item label="환급금">
              {detailItem.refundAmount
                ? `${detailItem.refundAmount.toLocaleString()}원`
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="메모">
              {detailItem.adminMemo || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="신청일">
              {detailItem.createdAt
                ? dayjs(detailItem.createdAt).format("YYYY.MM.DD HH:mm")
                : "-"}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      <Modal
        title="상태 변경"
        open={!!editItem}
        onOk={handleUpdateStatus}
        onCancel={() => setEditItem(null)}
        okText="저장"
        cancelText="취소"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="status" label="상태" rules={[{ required: true }]}>
            <Select options={STATUS_OPTIONS} />
          </Form.Item>
          <Form.Item name="refundAmount" label="환급금 (원)">
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              placeholder="환급금 입력"
            />
          </Form.Item>
          <Form.Item name="adminMemo" label="관리자 메모">
            <Input.TextArea rows={3} placeholder="내부 메모" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
