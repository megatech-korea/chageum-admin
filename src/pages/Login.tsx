// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import api from "../api/client";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values: {
    username: string;
    password: string;
    remember: boolean;
  }) => {
    setLoading(true);
    try {
      const res = await api.post("/api/admin/login", {
        username: values.username,
        password: values.password,
      });
      const token = res.data?.token;
      if (!token) throw new Error("토큰 없음");
      localStorage.setItem("admin_token", token);
      if (values.remember)
        localStorage.setItem("admin_username", values.username);
      else localStorage.removeItem("admin_username");
      navigate("/dashboard");
    } catch {
      message.error("아이디 또는 비밀번호가 올바르지 않습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f0f4f8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 420,
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 4px 32px rgba(10,136,255,0.08)",
          padding: "48px 40px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "#0A88FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>
                차금
              </span>
            </div>
            <span
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#0A88FF",
                letterSpacing: "-0.5px",
              }}
            >
              차금차금.
            </span>
          </div>
          <div style={{ fontSize: 13, color: "#8c8c8c", marginTop: 4 }}>
            관리자 시스템
          </div>
        </div>

        <Form
          layout="vertical"
          onFinish={handleLogin}
          initialValues={{
            username: localStorage.getItem("admin_username") ?? "",
            remember: !!localStorage.getItem("admin_username"),
          }}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "아이디를 입력해주세요" }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "#bbb" }} />}
              placeholder="아이디"
              size="large"
              style={{ borderRadius: 10 }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "비밀번호를 입력해주세요" }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#bbb" }} />}
              placeholder="비밀번호"
              size="large"
              style={{ borderRadius: 10 }}
            />
          </Form.Item>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Form.Item
              name="remember"
              valuePropName="checked"
              style={{ margin: 0 }}
            >
              <Checkbox style={{ fontSize: 13, color: "#555" }}>
                아이디 저장
              </Checkbox>
            </Form.Item>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={loading}
            style={{
              borderRadius: 10,
              height: 48,
              fontWeight: 600,
              fontSize: 15,
            }}
          >
            로그인
          </Button>
        </Form>

        <div
          style={{
            textAlign: "center",
            marginTop: 24,
            fontSize: 12,
            color: "#bbb",
          }}
        >
          차금차금 관리자만 접근 가능합니다
        </div>
      </div>
    </div>
  );
}
