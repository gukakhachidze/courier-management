import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Avatar, Tabs, Tab, Alert, CircularProgress,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchAllData } from '@/store/slices/adminSlice';
import { fetchBookings } from '@/store/slices/bookingsSlice';
import { updateCourier } from '@/store/slices/adminSlice';
import type { CourierUser, WorkingDays } from '@/types';
import { DAY_LABELS, ALL_DAYS } from '@/utils/mockData';
import WorkingDaysPicker from '@/components/forms/WorkingDaysPicker';

const CourierPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const { couriers } = useAppSelector((s) => s.admin);
  const { bookings, isLoading: bookingsLoading } = useAppSelector((s) => s.bookings);
  const [tab, setTab] = useState(0);
  const [editDialog, setEditDialog] = useState(false);
  const [editWorkingDays, setEditWorkingDays] = useState<WorkingDays>({});
  const [wdError, setWdError] = useState('');

  const currentCourier = user as CourierUser;

  useEffect(() => {
    dispatch(fetchAllData());
    dispatch(fetchBookings());
  }, [dispatch]);

  const myBookings = bookings.filter((b) => b.courierId === currentCourier?.id);
  const otherCouriers = couriers.filter((c) => c.id !== currentCourier?.id);

  const handleSave = () => {
    const filled = Object.keys(editWorkingDays).length;
    if (filled < 5) { setWdError('მინიმუმ 5 დღე სავალდებულოა'); return; }
    dispatch(updateCourier({ id: currentCourier.id, workingDays: editWorkingDays }));
    setEditDialog(false);
  };

  return (
    <DashboardLayout>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700} color="#1a1a2e">
          გამარჯობა, {currentCourier?.firstName}! 🚚
        </Typography>
        <Typography variant="body2" color="text.secondary">კურიერის პანელი</Typography>
      </Box>

      {/* Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 2, mb: 3 }}>
        {[
          { label: 'ჯამური ჯავშნები', count: myBookings.length, color: '#4f46e5' },
          { label: 'სამ. დღეები', count: Object.keys(currentCourier?.workingDays ?? {}).length, color: '#059669' },
          { label: 'სხვა კურიერები', count: otherCouriers.length, color: '#d97706' },
        ].map((s) => (
          <Paper key={s.label} elevation={0} sx={{ border: '1px solid #e8eaf0', borderRadius: 2, p: 2.5 }}>
            <Typography variant="h4" fontWeight={800} sx={{ color: s.color }}>{s.count}</Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>{s.label}</Typography>
          </Paper>
        ))}
      </Box>

      <Paper elevation={0} sx={{ border: '1px solid #e8eaf0', borderRadius: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: '1px solid #e8eaf0', px: 2 }}>
          <Tab label="ჩემი ინფორმაცია" sx={{ fontWeight: 600 }} />
          <Tab label="ჩემი ჯავშნები" sx={{ fontWeight: 600 }} />
          <Tab label="სხვა კურიერები" sx={{ fontWeight: 600 }} />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* MY INFO */}
          {tab === 0 && currentCourier && (
            <Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: { sm: '1fr 1fr' }, gap: 2, maxWidth: 480, mb: 3 }}>
                {[
                  { label: 'სახელი', value: currentCourier.firstName },
                  { label: 'გვარი', value: currentCourier.lastName ?? '-' },
                  { label: 'პ/ნ', value: currentCourier.pid },
                  { label: 'ტელეფონი', value: currentCourier.phoneNumber },
                  { label: 'ელ-ფოსტა', value: currentCourier.email },
                  { label: 'სატრანსპ.', value: currentCourier.vehicle },
                ].map((item) => (
                  <Box key={item.label}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>{item.label}</Typography>
                    <Typography variant="body2" fontWeight={500}>{item.value}</Typography>
                  </Box>
                ))}
              </Box>

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="subtitle2" fontWeight={700}>სამუშაო გრაფიკი</Typography>
                  <Button
                    startIcon={<EditIcon />}
                    size="small"
                    variant="outlined"
                    onClick={() => { setEditWorkingDays(currentCourier.workingDays); setEditDialog(true); }}
                  >
                    რედაქტირება
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                  {ALL_DAYS.filter((d) => currentCourier.workingDays[d]).map((day) => {
                    const wd = currentCourier.workingDays[day]!;
                    const isBooked = myBookings.some((b) => b.day === day);
                    return (
                      <Box key={day} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Chip label={DAY_LABELS[day]} size="small" sx={{ minWidth: 110 }} />
                        <Typography variant="body2">{wd.startHours} – {wd.endHours}</Typography>
                        {isBooked && <Chip label="დაჯავშნული" size="small" color="warning" />}
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Box>
          )}

          {/* MY BOOKINGS */}
          {tab === 1 && (
            bookingsLoading ? <CircularProgress /> : myBookings.length === 0 ? (
              <Alert severity="info">ჯავშნები ჯერ არ გაქვთ</Alert>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell fontWeight={700}>მომხმარებელი</TableCell>
                      <TableCell fontWeight={700}>დღე</TableCell>
                      <TableCell fontWeight={700}>საათები</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {myBookings.map((b) => (
                      <TableRow key={b.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 26, height: 26, fontSize: '0.7rem', bgcolor: '#4f46e5' }}>
                              {b.userName[0]}
                            </Avatar>
                            {b.userName}
                          </Box>
                        </TableCell>
                        <TableCell><Chip label={DAY_LABELS[b.day]} size="small" /></TableCell>
                        <TableCell>{b.startHours} – {b.endHours}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )
          )}

          {/* OTHER COURIERS */}
          {tab === 2 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {otherCouriers.length === 0 ? (
                <Alert severity="info">სხვა კურიერები არ არიან</Alert>
              ) : (
                otherCouriers.map((c) => {
                  const cBookings = bookings.filter((b) => b.courierId === c.id);
                  return (
                    <Paper key={c.id} elevation={0} sx={{ border: '1px solid #e8eaf0', borderRadius: 2, p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                        <Avatar sx={{ bgcolor: '#059669' }}>{c.firstName[0]}</Avatar>
                        <Box>
                          <Typography fontWeight={600}>{c.firstName} {c.lastName}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {c.vehicle} · ჯამ. ჯავშ: <strong>{cBookings.length}</strong>
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                        {ALL_DAYS.filter((d) => c.workingDays[d]).map((day) => {
                          const wd = c.workingDays[day]!;
                          const taken = cBookings.some((b) => b.day === day);
                          return (
                            <Chip
                              key={day}
                              label={`${DAY_LABELS[day].slice(0, 3)} ${wd.startHours}-${wd.endHours}`}
                              size="small"
                              color={taken ? 'error' : 'default'}
                              variant={taken ? 'filled' : 'outlined'}
                            />
                          );
                        })}
                      </Box>
                    </Paper>
                  );
                })
              )}
            </Box>
          )}
        </Box>
      </Paper>

      {/* Edit working days */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>სამ. გრაფიკის რედაქტირება</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <WorkingDaysPicker value={editWorkingDays} onChange={setEditWorkingDays} error={wdError} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>გაუქმება</Button>
          <Button variant="contained" onClick={handleSave} sx={{ background: '#1a1a2e' }}>შენახვა</Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default CourierPage;
