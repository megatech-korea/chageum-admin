// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Typography, List, Tag } from "antd";
import {
  UserOutlined,
  FileSearchOutlined,
  StarOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import api from "../api/client";
import dayjs from "dayjs";

const { Title, Text } = Typography;

interface Stats {
  totalUsers: number;
  totalClaims: number;
  pendingClaims: number;
  completedClaims: number;
  totalReviews: number;
  totalCases: number;
  todayUsers: number;
  todayClaims: number;
}

interface RecentClaim {
  claimId: string;
  name: string;
  status: string;
  createdAt: string;
}

const STATUS_COLOR: Record<string, string> = {
  PENDING: "default",
  IN_REVIEW: "processing",
  PROCESSING: "warning",
  COMPLETED: "success",
  REJECTED: "error",
};
const STATUS_LABEL: Record<string, string> = {
  PENDING: "접수",
  IN_REVIEW: "검토중",
  PROCESSING: "처리중",
  COMPLETED: "완료",
  REJECTED: "반려",
};

const todayStart = () => dayjs().startOf("day");

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalClaims: 0,
    pendingClaims: 0,
    completedClaims: 0,
    totalReviews: 0,
    totalCases: 0,
    todayUsers: 0,
    todayClaims: 0,
  });
  const [recentClaims, setRecentClaims] = useState<RecentClaim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [usersRes, claimsRes, reviewsRes, casesRes] = await Promise.all([
          api.get("/api/admin/users", { params: { limit: 200 } }),
          api.get("/api/admin/claims", { params: { limit: 200 } }),
          api.get("/api/admin/reviews", { params: { limit: 100 } }),
          api.get("/api/admin/cases"),
        ]);

        const users = usersRes.data as { createdAt?: string }[];
        const claims = claimsRes.data as RecentClaim[];
        const reviews = reviewsRes.data as unknown[];
        const cases = casesRes.data as unknown[];

        const todayStr = todayStart();
        const todayUsers = users.filter(
          (u) => u.createdAt && dayjs(u.createdAt).isAfter(todayStr),
        ).length;
        const todayClaims = claims.filter(
          (c) => c.createdAt && dayjs(c.createdAt).isAfter(todayStr),
        ).length;

        setStats({
          totalUsers: users.length,
          totalClaims: claims.length,
          pendingClaims: claims.filter((c) => c.status === "PENDING").length,
          completedClaims: claims.filter((c) => c.status === "COMPLETED")
            .length,
          totalReviews: reviews.length,
          totalCases: cases.length,
          todayUsers,
          todayClaims,
        });
        setRecentClaims(claims.slice(0, 5));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const todayCards = [
    {
      title: "오늘 가입자",
      value: stats.todayUsers,
      icon: <RiseOutlined />,
      color: "#0A88FF",
      bg: "#e6f4ff",
    },
    {
      title: "오늘 신청건수",
      value: stats.todayClaims,
      icon: <RiseOutlined />,
      color: "#52c41a",
      bg: "#f6ffed",
    },
  ];

  const statCards = [
    {
      title: "전체 사용자",
      value: stats.totalUsers,
      icon: <UserOutlined />,
      color: "#0A88FF",
      bg: "#e6f4ff",
    },
    {
      title: "전체 신청",
      value: stats.totalClaims,
      icon: <FileSearchOutlined />,
      color: "#52c41a",
      bg: "#f6ffed",
    },
    {
      title: "접수 대기",
      value: stats.pendingClaims,
      icon: <ClockCircleOutlined />,
      color: "#fa8c16",
      bg: "#fff7e6",
    },
    {
      title: "처리 완료",
      value: stats.completedClaims,
      icon: <CheckCircleOutlined />,
      color: "#13c2c2",
      bg: "#e6fffb",
    },
    {
      title: "후기",
      value: stats.totalReviews,
      icon: <StarOutlined />,
      color: "#722ed1",
      bg: "#f9f0ff",
    },
    {
      title: "사례집",
      value: stats.totalCases,
      icon: <FileTextOutlined />,
      color: "#eb2f96",
      bg: "#fff0f6",
    },
  ];

  const StatCard = ({
    title,
    value,
    icon,
    color,
    bg,
  }: (typeof statCards)[0]) => (
    <Card
      style={{ borderRadius: 8 }}
      styles={{ body: { padding: "16px 20px" } }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {title}
          </Text>
          <Statistic
            value={value}
            valueStyle={{ color, fontSize: 28, fontWeight: 700 }}
          />
        </div>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            color,
          }}
        >
          {icon}
        </div>
      </div>
    </Card>
  );

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>
          대시보드
        </Title>
        <Text type="secondary">
          차금차금 서비스 현황을 한눈에 확인하세요 ·{" "}
          {dayjs().format("YYYY.MM.DD")}
        </Text>
      </div>

      {/* 오늘 현황 */}
      <div style={{ marginBottom: 8 }}>
        <Text strong style={{ fontSize: 13, color: "#555" }}>
          오늘 현황
        </Text>
      </div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {todayCards.map((card) => (
          <Col xs={12} sm={12} md={6} lg={4} key={card.title}>
            <StatCard {...card} />
          </Col>
        ))}
      </Row>

      {/* 전체 통계 */}
      <div style={{ marginBottom: 8 }}>
        <Text strong style={{ fontSize: 13, color: "#555" }}>
          전체 현황
        </Text>
      </div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {statCards.map((card) => (
          <Col xs={12} sm={8} md={8} lg={4} key={card.title}>
            <StatCard {...card} />
          </Col>
        ))}
      </Row>

      {/* 최근 신청 */}
      <Card title="최근 환급 신청" style={{ borderRadius: 8 }}>
        <List
          loading={loading}
          dataSource={recentClaims}
          locale={{ emptyText: "신청 내역이 없습니다." }}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={<Text strong>{item.name}</Text>}
                description={
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {item.createdAt
                      ? dayjs(item.createdAt).format("YYYY.MM.DD HH:mm")
                      : "-"}
                  </Text>
                }
              />
              <Tag color={STATUS_COLOR[item.status] as string}>
                {STATUS_LABEL[item.status] || item.status}
              </Tag>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
