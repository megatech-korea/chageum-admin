// src/pages/Settings.tsx
import { Typography, Card, Descriptions, Button, message } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

export default function Settings() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    message.success("로그아웃 되었습니다.");
    navigate("/");
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>
          설정
        </Title>
        <Text type="secondary">관리자 계정 및 시스템 설정</Text>
      </div>

      <Card title="계정 정보" style={{ maxWidth: 500, marginBottom: 16 }}>
        <Descriptions column={1}>
          <Descriptions.Item label="서비스">
            차금차금 관리자 시스템
          </Descriptions.Item>
          <Descriptions.Item label="API 서버">
            https://api.chageum.co.kr
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Button danger icon={<LogoutOutlined />} onClick={handleLogout}>
        로그아웃
      </Button>
    </div>
  );
}
