// src/layouts/MainLayout.tsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Layout, Menu, Button, Avatar, Dropdown, theme } from "antd";
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
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={220}
        style={{
          background: "#fff",
          borderRight: `1px solid ${token.colorBorderSecondary}`,
          boxShadow: "2px 0 8px rgba(0,0,0,0.04)",
        }}
      >
        {/* 로고 */}
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            padding: collapsed ? 0 : "0 20px",
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            gap: 10,
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
            <span
              style={{
                fontWeight: 800,
                fontSize: 16,
                color: "#0A88FF",
                letterSpacing: "-0.5px",
              }}
            >
              차금차금.
            </span>
          )}
        </div>

        {/* 메뉴 */}
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={MENU_ITEMS}
          onClick={({ key }) => navigate(key)}
          style={{ border: "none", marginTop: 8 }}
        />
      </Sider>

      <Layout>
        {/* 헤더 */}
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            height: 64,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 16 }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Button
              type="text"
              icon={<BellOutlined />}
              style={{ fontSize: 16 }}
            />
            <Dropdown menu={userMenu} placement="bottomRight">
              <Avatar
                style={{ background: "#0A88FF", cursor: "pointer" }}
                icon={<UserOutlined />}
              />
            </Dropdown>
          </div>
        </Header>

        {/* 콘텐츠 */}
        <Content
          style={{
            margin: 24,
            padding: 24,
            background: "#fff",
            borderRadius: 12,
            minHeight: "calc(100vh - 112px)",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
