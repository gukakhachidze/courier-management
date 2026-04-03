import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Tabs, Tab, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Button, Chip,
  Avatar, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, CircularProgress, Tooltip, Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchAllData, deleteUser, deleteCourier, updateCourier } from '@/store/slices/adminSlice';
import type { CourierUser } from '@/types';
import { DAY_LABELS } from '@/utils/mockData';
import WorkingDaysPicker from '@/components/forms/WorkingDaysPicker';
import RegistrationForm from '@/components/forms/RegistrationForm';

const AdminPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, couriers, bookings, isLoading } = useAppSelector((s) => s.admin);
  const [tab, setTab] = useState(0);
  const [editCourier, setEditCourier] = useState<CourierUser | null>(null);
  const [viewBookings, setViewBookings] = useState<string | null>(null); // courierId
  const [addDialog, setAddDialog] = useState<'user' | 'courier' | null>(null);
  const [editWorkingDays, setEditWorkingDays] = useState(editCourier?.workingDays ?? {});

  useEffect(() => { dispatch(fetchAllData()); }, [dispatch]);

  const handleDeleteUser = (id: string) => {
    if (confirm('დარწმუნებული ხართ?')) dispatch(deleteUser(id));
  };
  const handleDeleteCourier = (id: string) => {
    if (confirm('დარწმუნებული ხართ?')) dispatch(deleteCourier(id));
  };

  const handleSaveCourier = () => {
    if (!editCourier) return;
    dispatch(updateCourier({ id: editCourier.id, workingDays: editWorkingDays }));
    setEditCourier(null);
  };

  const courierBookings = viewBookings
    ? bookings.filter((b) => b.courierId === viewBookings)
    : [];

  return (
    <DashboardLayout>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700} color="#1a1a2e">ადმინ პანელი</Typography>
        <Typography variant="body2" color="text.secondary">მართეთ მომხმარებლები და კურიერები</Typography>
      </Box>

      {/* Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 2, mb: 3 }}>
        {[
          { label: 'მომხმარებლები', count: users.length, color: '#4f46e5' },
          { label: 'კურიერები', count: couriers.length, color: '#059669' },
          { label: 'ჯამური ჯავშნები', count: bookings.length, color: '#d97706' },
        ].map((s) => (
          <Paper key={s.label} elevation={0} sx={{ border: '1px solid #e8eaf0', borderRadius: 2, p: 2.5 }}>
            <Typography variant="h4" fontWeight={800} sx={{ color: s.color }}>{s.count}</Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>{s.label}</Typography>
          </Paper>
        ))}
      </Box>

      <Paper elevation={0} sx={{ border: '1px solid #e8eaf0', borderRadius: 2 }}>
        <Box sx={{ borderBottom: '1px solid #e8eaf0', px: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)}>
            <Tab label="მომხმარებლები" sx={{ fontWeight: 600 }} />
            <Tab label="კურიერები" sx={{ fontWeight: 600 }} />
          </Tabs>
          <Button
            startIcon={<PersonAddIcon />}
            variant="contained"
            size="small"
            onClick={() => setAddDialog(tab === 0 ? 'user' : 'courier')}
            sx={{ background: '#1a1a2e', '&:hover': { background: '#16213e' } }}
          >
            {tab === 0 ? 'მომხმარებლის დამატება' : 'კურიერის დამატება'}
          </Button>
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* USERS TAB */}
            {tab === 0 && (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>მომხმარებელი</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>პ/ნ</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>ტელეფონი</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>ელ-ფოსტა</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>მისამართი</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>მოქმედება</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem', bgcolor: '#4f46e5' }}>
                              {u.firstName[0]}
                            </Avatar>
                            {u.firstName} {u.lastName}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontFamily: 'monospace' }}>{u.pid}</TableCell>
                        <TableCell>{u.phoneNumber}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                          {u.address.lng.toFixed(4)}, {u.address.lat.toFixed(4)}
                        </TableCell>
                        <TableCell>
                          <Tooltip title="წაშლა">
                            <IconButton size="small" color="error" onClick={() => handleDeleteUser(u.id)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* COURIERS TAB */}
            {tab === 1 && (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>კურიერი</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>სატრანსპ.</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>სამ. დღეები</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>ჯამ. ჯავშ.</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>მოქმედება</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {couriers.map((c) => (
                      <TableRow key={c.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem', bgcolor: '#059669' }}>
                              {c.firstName[0]}
                            </Avatar>
                            {c.firstName} {c.lastName}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip label={c.vehicle} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {Object.keys(c.workingDays).map((d) => (
                              <Chip key={d} label={DAY_LABELS[d as keyof typeof DAY_LABELS]?.slice(0, 3)} size="small" sx={{ fontSize: '0.65rem' }} />
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip label={c.totalBookings ?? 0} size="small" color="primary" />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="ჯავშნების ნახვა">
                              <IconButton size="small" color="primary" onClick={() => setViewBookings(c.id)}>
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="სამ. დღეების რედაქტირება">
                              <IconButton size="small" color="info" onClick={() => { setEditCourier(c); setEditWorkingDays(c.workingDays); }}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="წაშლა">
                              <IconButton size="small" color="error" onClick={() => handleDeleteCourier(c.id)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
      </Paper>

      {/* Edit courier working days dialog */}
      <Dialog open={!!editCourier} onClose={() => setEditCourier(null)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>კურიერის სამ. დღეების რედაქტირება</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <WorkingDaysPicker value={editWorkingDays} onChange={setEditWorkingDays} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditCourier(null)}>გაუქმება</Button>
          <Button variant="contained" onClick={handleSaveCourier} sx={{ background: '#1a1a2e' }}>შენახვა</Button>
        </DialogActions>
      </Dialog>

      {/* Courier bookings dialog */}
      <Dialog open={!!viewBookings} onClose={() => setViewBookings(null)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>კურიერის ჯავშნები</DialogTitle>
        <DialogContent>
          {courierBookings.length === 0 ? (
            <Alert severity="info">ჯავშნები არ არის</Alert>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell fontWeight={700}>მომხმარებელი</TableCell>
                  <TableCell fontWeight={700}>დღე</TableCell>
                  <TableCell fontWeight={700}>დრო</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courierBookings.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>{b.userName}</TableCell>
                    <TableCell>{DAY_LABELS[b.day]}</TableCell>
                    <TableCell>{b.startHours} – {b.endHours}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewBookings(null)}>დახურვა</Button>
        </DialogActions>
      </Dialog>

      {/* Add user/courier dialog */}
      <Dialog open={!!addDialog} onClose={() => setAddDialog(null)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>
          {addDialog === 'user' ? 'მომხმარებლის დამატება' : 'კურიერის დამატება'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            {addDialog && <RegistrationForm role={addDialog} onSuccess={() => setAddDialog(null)} />}
          </Box>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminPage;
