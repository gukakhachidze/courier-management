import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { store } from '@/store';
import { ApolloWrapper } from '@/graphql/client';
import LoginPage from '@/pages/auth/LoginPage';
import AdminPage from '@/pages/admin/AdminPage';
import UserPage from '@/pages/user/UserPage';
import CourierPage from '@/pages/courier/CourierPage';
import ProtectedRoute from '@/components/ui/ProtectedRoute';

const theme = createTheme({
  palette: {
    background: { default: '#f8f9fc' },
    primary: { main: '#1a1a2e' },
  },
  typography: {
    fontFamily: '"Noto Sans Georgian", "Segoe UI", sans-serif',
    h5: { fontWeight: 700 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
  },
});

const App: React.FC = () => (
  <Provider store={store}>
    <ApolloWrapper>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user"
              element={
                <ProtectedRoute allowedRole="user">
                  <UserPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courier"
              element={
                <ProtectedRoute allowedRole="courier">
                  <CourierPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </ApolloWrapper>
  </Provider>
);

export default App;
