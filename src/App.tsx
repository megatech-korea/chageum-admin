// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ContentManagement from "./pages/ContentManagement";
import UserManagement from "./pages/UserManagement";
import ClaimManagement from "./pages/ClaimManagement";
import Settings from "./pages/Settings";
import ReviewManagement from "./pages/ReviewManagement";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("admin_token");
  return token ? <>{children}</> : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/content"
          element={
            <PrivateRoute>
              <MainLayout>
                <ContentManagement />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <MainLayout>
                <UserManagement />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/claims"
          element={
            <PrivateRoute>
              <MainLayout>
                <ClaimManagement />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/reviews"
          element={
            <PrivateRoute>
              <MainLayout>
                <ReviewManagement />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <MainLayout>
                <Settings />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
