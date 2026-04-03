import React from "react";
import { AppBar, Box, Toolbar, Typography, Button, Avatar, Chip, Tooltip } from "@mui/material";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { logout } from "@/store/slices/authSlice";

const ROLE_LABELS: Record<string, string> = {
  admin: "ადმინი",
  user: "მომხმარებელი",
  courier: "კურიერი",
};

const ROLE_COLORS: Record<string, "error" | "primary" | "success"> = {
  admin: "error",
  user: "primary",
  courier: "success",
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "#f8f9fc" }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "#ffffff",
          borderBottom: "1px solid #e8eaf0",
          color: "text.primary",
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexGrow: 1,
              cursor: "pointer",
            }}
            onClick={() => navigate(`/${user?.role}`)}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1.5,
                background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DeliveryDiningIcon sx={{ color: "#fff", fontSize: 18 }} />
            </Box>
            <Typography variant="subtitle1" fontWeight={700} color="#1a1a2e">
              Courier Management
            </Typography>
          </Box>

          {user && (
            <>
              <Chip
                label={ROLE_LABELS[user.role]}
                color={ROLE_COLORS[user.role]}
                size="small"
                sx={{ fontWeight: 600 }}
              />
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar
                  src={(user as { profileImage?: string }).profileImage}
                  sx={{ width: 32, height: 32, fontSize: "0.8rem" }}
                >
                  {user.firstName[0]}
                </Avatar>
                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                  <Typography variant="body2" fontWeight={600} lineHeight={1.2}>
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
              </Box>
              <Tooltip title="გამოსვლა">
                <Button
                  onClick={handleLogout}
                  size="small"
                  color="inherit"
                  startIcon={<LogoutIcon />}
                  sx={{ color: "text.secondary" }}
                >
                  გამოსვლა
                </Button>
              </Tooltip>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1400, mx: "auto" }}>{children}</Box>
    </Box>
  );
};

export default DashboardLayout;
