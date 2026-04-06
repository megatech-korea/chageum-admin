// src/pages/UserManagement.tsx
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
  Input,
  Modal,
  Descriptions,
} from "antd";
import {
  StopOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import api from "../api/client";
import dayjs from "dayjs";

const { Title, Text } = Typography;

interface AdminUser {
  uid: string;
  name?: string;
  phone?: string;
  email?: string;
  gender?: string;
  birthDate?: string;
  roadAddress?: string;
  provider?: string;
  deleted?: boolean;
  createdAt?: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState<string>("");
  const [search, setSearch] = useState("");
  const [detailUser, setDetailUser] = useState<AdminUser | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/users", {
        params: { limit: 100, ...(provider ? { provider } : {}) },
      });
      setUsers(res.data as AdminUser[]);
    } catch {
      message.error("사용자 목록 불러오기 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [provider]);

  const handleDeactivate = async (uid: string) => {
    try {
      await api.patch(`/api/admin/users/${uid}/deactivate`);
      message.success("비활성화 완료");
      fetchUsers();
    } catch {
      message.error("실패");
    }
  };

  const handleActivate = async (uid: string) => {
    try {
      await api.patch(`/api/admin/users/${uid}/activate`);
      message.success("활성화 완료");
      fetchUsers();
    } catch {
      message.error("실패");
    }
  };

  const handleDelete = async (uid: string) => {
    try {
      await api.delete(`/api/admin/users/${uid}`);
      message.success("삭제 완료");
      fetchUsers();
    } catch {
      message.error("삭제 실패");
    }
  };

  const filtered = users.filter(
    (u) =>
      !search ||
      u.name?.includes(search) ||
      u.phone?.includes(search) ||
      u.email?.includes(search),
  );

  const columns = [
    {
      title: "이름",
      dataIndex: "name",
      key: "name",
      width: 100,
      render: (v: string) => v || "-",
    },
    {
      title: "연락처",
      dataIndex: "phone",
      key: "phone",
      width: 140,
      render: (v: string) => v || "-",
    },
    { title: "이메일", dataIndex: "email", key: "email" },
    {
      title: "가입 경로",
      dataIndex: "provider",
      key: "provider",
      width: 90,
      render: (v: string) => (
        <Tag color={v === "kakao" ? "gold" : v === "naver" ? "green" : "blue"}>
          {v?.toUpperCase() || "-"}
        </Tag>
      ),
    },
    {
      title: "상태",
      dataIndex: "deleted",
      key: "deleted",
      width: 90,
      render: (v: boolean) =>
        v ? <Tag color="red">비활성</Tag> : <Tag color="green">활성</Tag>,
    },
    {
      title: "가입일",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (v: string) => (v ? dayjs(v).format("YYYY.MM.DD") : "-"),
    },
    {
      title: "관리",
      key: "action",
      width: 180,
      render: (_: unknown, record: AdminUser) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => setDetailUser(record)}
          />
          {record.deleted ? (
            <Button
              size="small"
              icon={<CheckCircleOutlined />}
              onClick={() => handleActivate(record.uid)}
            >
              복구
            </Button>
          ) : (
            <Popconfirm
              title="비활성화하시겠습니까?"
              onConfirm={() => handleDeactivate(record.uid)}
              okText="확인"
              cancelText="취소"
            >
              <Button size="small" icon={<StopOutlined />} danger>
                비활성화
              </Button>
            </Popconfirm>
          )}
          <Popconfirm
            title="완전 삭제하시겠습니까?"
            onConfirm={() => handleDelete(record.uid)}
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
            사용자 관리
          </Title>
          <Text type="secondary">가입 사용자 목록 및 계정 관리</Text>
        </div>
        <Space>
          <Input
            placeholder="이름/연락처/이메일 검색"
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 220 }}
          />
          <Select
            placeholder="가입 경로"
            allowClear
            style={{ width: 120 }}
            onChange={(v) => setProvider(v || "")}
            options={[
              { value: "kakao", label: "카카오" },
              { value: "naver", label: "네이버" },
              { value: "google", label: "구글" },
            ]}
          />
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filtered}
        rowKey="uid"
        loading={loading}
        pagination={{ pageSize: 20 }}
        size="middle"
      />

      <Modal
        title="사용자 상세"
        open={!!detailUser}
        onCancel={() => setDetailUser(null)}
        footer={null}
        width={500}
      >
        {detailUser && (
          <Descriptions
            column={1}
            bordered
            size="small"
            style={{ marginTop: 16 }}
          >
            <Descriptions.Item label="UID">{detailUser.uid}</Descriptions.Item>
            <Descriptions.Item label="이름">
              {detailUser.name || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="이메일">
              {detailUser.email || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="연락처">
              {detailUser.phone || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="성별">
              {detailUser.gender || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="생년월일">
              {detailUser.birthDate || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="주소">
              {detailUser.roadAddress || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="가입 경로">
              {detailUser.provider || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="가입일">
              {detailUser.createdAt
                ? dayjs(detailUser.createdAt).format("YYYY.MM.DD HH:mm")
                : "-"}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
