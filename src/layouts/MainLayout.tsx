// src/layouts/MainLayout.tsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Layout, Menu, Button, Avatar, Dropdown, Badge, theme } from "antd";
import {
  DashboardOutlined,
  FileTextOutlined,
  UserOutlined,
  FileSearchOutlined,
  StarOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
} from "@ant-design/icons";

const { Sider, Header, Content } = Layout;

const MENU_ITEMS = [
  { key: "/dashboard", icon: <DashboardOutlined />, label: "대시보드" },
  { key: "/content", icon: <FileTextOutlined />, label: "콘텐츠 관리" },
  { key: "/users", icon: <UserOutlined />, label: "사용자 관리" },
  { key: "/claims", icon: <FileSearchOutlined />, label: "환급 신청 관리" },
  { key: "/reviews", icon: <StarOutlined />, label: "후기 관리" },
  { key: "/settings", icon: <SettingOutlined />, label: "설정" },
];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/");
  };

  const userMenu = {
    items: [
      {
        key: "logout",
        icon: <LogoutOutlined />,
        label: "로그아웃",
        danger: true,
        onClick: handleLogout,
      },
    ],
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* 흰색 사이드바 */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={220}
        style={{
          background: "#fff",
          borderRight: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        {/* 로고 */}
        <div
          style={{
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            padding: collapsed ? 0 : "0 20px",
            gap: 10,
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "#0A88FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 11 }}>
              차금
            </span>
          </div>
          {!collapsed && (
            <div>
              <div
                style={{
                  color: "#0A88FF",
                  fontWeight: 800,
                  fontSize: 15,
                  letterSpacing: "-0.5px",
                  lineHeight: 1.2,
                }}
              >
                차금차금.
              </div>
              <div style={{ color: "#aaa", fontSize: 10 }}>관리자 시스템</div>
            </div>
          )}
        </div>

        {/* 메뉴 - 라이트 테마 */}
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={MENU_ITEMS}
          onClick={({ key }) => navigate(key)}
          style={{ border: "none", marginTop: 8 }}
        />
      </Sider>

      {/* 오른쪽: 회색 배경 */}
      <Layout style={{ background: "#f4f6f9" }}>
        {/* 헤더 */}
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 60,
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 18, color: "#555" }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Badge count={0}>
              <Button
                type="text"
                icon={<BellOutlined style={{ fontSize: 18, color: "#555" }} />}
              />
            </Badge>
            <Dropdown menu={userMenu} placement="bottomRight">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                }}
              >
                <Avatar
                  style={{ background: "#0A88FF" }}
                  icon={<UserOutlined />}
                />
                <span style={{ fontSize: 13, color: "#333", fontWeight: 500 }}>
                  관리자
                </span>
              </div>
            </Dropdown>
          </div>
        </Header>

        {/* 콘텐츠: 회색 배경 위에 흰 카드 */}
        <Content style={{ padding: 24, minHeight: "calc(100vh - 60px)" }}>
          <div
            style={{
              background: "#fff",
              borderRadius: 8,
              padding: 24,
              minHeight: "calc(100vh - 108px)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
