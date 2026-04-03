import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Tab,
  Tabs,
  Alert,
  CircularProgress,
  Divider,
  Link,
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import { useNavigate } from 'react-router-dom';
import type { UserRole } from '@/types';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { loginUser } from '@/store/slices/authSlice';
import RegistrationForm from '@/components/forms/RegistrationForm';

const ROLE_META: Record<UserRole, { label: string; icon: React.ReactNode; hint: string }> = {
  admin: {
    label: 'ადმინი',
    icon: <AdminPanelSettingsIcon />,
    hint: 'admin@courier.ge',
  },
  user: {
    label: 'მომხმარებელი',
    icon: <PersonIcon />,
    hint: 'giorgi@example.ge',
  },
  courier: {
    label: 'კურიერი',
    icon: <DeliveryDiningIcon />,
    hint: 'courier@courier.ge',
  },
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error, user } = useAppSelector((s) => s.auth);

  const [role, setRole] = useState<UserRole>('user');
  const [tab, setTab] = useState(0); // 0=login, 1=register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Redirect after login
  React.useEffect(() => {
    if (user) {
      navigate(`/${user.role}`);
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(loginUser({ email, password, role }));
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#f8f9fc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      {/* Decorative shapes */}
      <Box
        sx={{
          position: 'fixed',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(26,26,46,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'fixed',
          bottom: -80,
          left: -80,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(22,33,62,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <Box sx={{ width: '100%', maxWidth: 480 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              mb: 1.5,
            }}
          >
            <DeliveryDiningIcon sx={{ color: '#fff', fontSize: 28 }} />
          </Box>
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{ letterSpacing: '-0.5px', color: '#1a1a2e' }}
          >
            Courier Management
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            მართეთ კურიერები, მომხმარებლები და შეკვეთები
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            border: '1px solid #e8eaf0',
            borderRadius: 3,
            overflow: 'hidden',
            background: '#ffffff',
          }}
        >
          {/* Role selector */}
          <Box sx={{ px: 3, pt: 3, pb: 2 }}>
            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              შედით როგორც
            </Typography>
            <ToggleButtonGroup
              value={role}
              exclusive
              onChange={(_, v) => v && setRole(v)}
              fullWidth
              size="small"
              sx={{ gap: 1 }}
            >
              {(Object.keys(ROLE_META) as UserRole[]).map((r) => (
                <ToggleButton
                  key={r}
                  value={r}
                  sx={{
                    flex: 1,
                    borderRadius: '8px !important',
                    border: '1px solid #e0e0e0 !important',
                    py: 1,
                    gap: 0.5,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    '&.Mui-selected': {
                      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                      color: '#fff',
                      borderColor: '#1a1a2e !important',
                    },
                  }}
                >
                  {ROLE_META[r].icon}
                  {ROLE_META[r].label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>

          <Divider />

          {/* Tabs */}
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{ px: 3, pt: 1 }}
          >
            <Tab label="შესვლა" sx={{ fontWeight: 600, fontSize: '0.85rem' }} />
            <Tab label="რეგისტრაცია" sx={{ fontWeight: 600, fontSize: '0.85rem' }} />
          </Tabs>

          <Box sx={{ px: 3, py: 3 }}>
            {tab === 0 ? (
              /* LOGIN */
              <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {error && <Alert severity="error" sx={{ py: 0.5 }}>{error}</Alert>}
                <TextField
                  label="ელ-ფოსტა"
                  type="email"
                  fullWidth
                  required
                  size="small"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={ROLE_META[role].hint}
                  helperText={`სადემო: ${ROLE_META[role].hint}`}
                />
                <TextField
                  label="პაროლი"
                  type="password"
                  fullWidth
                  required
                  size="small"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  helperText="ნებისმიერი პაროლი (სადემო)"
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isLoading}
                  sx={{
                    py: 1.3,
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                    borderRadius: 2,
                    fontWeight: 600,
                    letterSpacing: '0.3px',
                    '&:hover': { background: 'linear-gradient(135deg, #16213e 0%, #0f3460 100%)' },
                  }}
                >
                  {isLoading ? <CircularProgress size={20} color="inherit" /> : 'შესვლა'}
                </Button>
              </Box>
            ) : (
              /* REGISTER */
              <RegistrationForm role={role} onSuccess={() => setTab(0)} />
            )}
          </Box>
        </Paper>

        <Typography variant="caption" color="text.disabled" sx={{ display: 'block', textAlign: 'center', mt: 2 }}>
          © 2024 Courier Management System
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;
