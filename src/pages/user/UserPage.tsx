import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Chip, Avatar, Dialog, DialogTitle,
  DialogContent, DialogActions, MenuItem, TextField, Alert, CircularProgress,
  Tabs, Tab, Accordion, AccordionSummary, AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchAllData } from '@/store/slices/adminSlice';
import { fetchBookings, createBooking, cancelBooking } from '@/store/slices/bookingsSlice';
import { updateUser } from '@/store/slices/authSlice';
import type { DayOfWeek, CourierUser } from '@/types';
import { DAY_LABELS, ALL_DAYS } from '@/utils/mockData';
import type { RegularUser } from '@/types';

const UserPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const { couriers } = useAppSelector((s) => s.admin);
  const { bookings, isLoading: bookingsLoading } = useAppSelector((s) => s.bookings);
  const [tab, setTab] = useState(0);
  const [bookDialog, setBookDialog] = useState<CourierUser | null>(null);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | ''>('');
  const [bookError, setBookError] = useState('');
  const [bookSuccess, setBookSuccess] = useState('');

  const currentUser = user as RegularUser;

  useEffect(() => {
    dispatch(fetchAllData());
    dispatch(fetchBookings());
  }, [dispatch]);

  const myBookings = bookings.filter((b) => b.userId === currentUser?.id);

  const isSlotTaken = (courierId: string, day: DayOfWeek) => {
    return bookings.some((b) => b.courierId === courierId && b.day === day);
  };

  const hasConflict = (courierId: string, day: DayOfWeek) => {
    // Check if current user already has a booking at the same day/time
    const existingBooking = myBookings.find((b) => b.day === day);
    if (!existingBooking) return false;
    const courier = couriers.find((c) => c.id === courierId);
    if (!courier || !courier.workingDays[day]) return false;
    // Time overlap check
    const newStart = courier.workingDays[day]!.startHours;
    const newEnd = courier.workingDays[day]!.endHours;
    const existingCourier = couriers.find((c) => c.id === existingBooking.courierId);
    if (!existingCourier || !existingCourier.workingDays[day]) return false;
    const exStart = existingCourier.workingDays[day]!.startHours;
    const exEnd = existingCourier.workingDays[day]!.endHours;
    return newStart < exEnd && newEnd > exStart;
  };

  const handleBook = async () => {
    if (!bookDialog || !selectedDay || !currentUser) return;
    if (isSlotTaken(bookDialog.id, selectedDay as DayOfWeek)) {
      setBookError('ეს დრო უკვე დაჯავშნულია სხვა მომხმარებლის მიერ');
      return;
    }
    if (hasConflict(bookDialog.id, selectedDay as DayOfWeek)) {
      setBookError('ამ დღეს უკვე გაქვთ სხვა კურიერი დაჯავშნილი გადამფარავი დროით');
      return;
    }
    const wd = bookDialog.workingDays[selectedDay as DayOfWeek];
    if (!wd) return;
    await dispatch(createBooking({
      courierId: bookDialog.id,
      userId: currentUser.id,
      userName: `${currentUser.firstName} ${currentUser.lastName ?? ''}`.trim(),
      day: selectedDay as DayOfWeek,
      startHours: wd.startHours,
      endHours: wd.endHours,
    }));
    setBookSuccess(`კურიერი ${bookDialog.firstName} წარმატებით დაჯავშნა!`);
    setBookDialog(null);
    setSelectedDay('');
    setBookError('');
    setTimeout(() => setBookSuccess(''), 3000);
  };

  return (
    <DashboardLayout>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700} color="#1a1a2e">
          გამარჯობა, {currentUser?.firstName}! 👋
        </Typography>
        <Typography variant="body2" color="text.secondary">
          მართეთ თქვენი ინფორმაცია და კურიერის ჯავშნები
        </Typography>
      </Box>

      {bookSuccess && <Alert severity="success" sx={{ mb: 2 }}>{bookSuccess}</Alert>}

      <Paper elevation={0} sx={{ border: '1px solid #e8eaf0', borderRadius: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: '1px solid #e8eaf0', px: 2 }}>
          <Tab label="ჩემი ინფორმაცია" sx={{ fontWeight: 600 }} />
          <Tab label="კურიერები" sx={{ fontWeight: 600 }} />
          <Tab label="ჩემი ჯავშნები" sx={{ fontWeight: 600 }} />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* MY INFO */}
          {tab === 0 && currentUser && (
            <Box sx={{ display: 'grid', gridTemplateColumns: { sm: '1fr 1fr' }, gap: 2, maxWidth: 500 }}>
              {[
                { label: 'სახელი', value: currentUser.firstName },
                { label: 'გვარი', value: currentUser.lastName ?? '-' },
                { label: 'პირადი ნომერი', value: currentUser.pid },
                { label: 'ტელეფონი', value: currentUser.phoneNumber },
                { label: 'ელ-ფოსტა', value: currentUser.email },
                { label: 'კოორდინატები', value: `${currentUser.address.lng}, ${currentUser.address.lat}` },
              ].map((item) => (
                <Box key={item.label}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>{item.label}</Typography>
                  <Typography variant="body2" fontWeight={500}>{item.value}</Typography>
                </Box>
              ))}
            </Box>
          )}

          {/* COURIERS LIST */}
          {tab === 1 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {couriers.map((courier) => (
                <Accordion key={courier.id} elevation={0} sx={{ border: '1px solid #e8eaf0', borderRadius: '8px !important' }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', pr: 2 }}>
                      <Avatar sx={{ bgcolor: '#059669', width: 36, height: 36 }}>
                        {courier.firstName[0]}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography fontWeight={600}>{courier.firstName} {courier.lastName}</Typography>
                        <Typography variant="caption" color="text.secondary">{courier.vehicle} · {courier.phoneNumber}</Typography>
                      </Box>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<LocalShippingIcon />}
                        onClick={(e) => { e.stopPropagation(); setBookDialog(courier); setSelectedDay(''); setBookError(''); }}
                        sx={{ background: '#1a1a2e', '&:hover': { background: '#16213e' } }}
                      >
                        გამოძახება
                      </Button>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>სამუშაო გრაფიკი:</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      {ALL_DAYS.filter((d) => courier.workingDays[d]).map((day) => {
                        const taken = isSlotTaken(courier.id, day);
                        const wd = courier.workingDays[day]!;
                        return (
                          <Box key={day} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              label={DAY_LABELS[day]}
                              size="small"
                              color={taken ? 'error' : 'success'}
                              variant={taken ? 'filled' : 'outlined'}
                              sx={{ minWidth: 100 }}
                            />
                            <Typography variant="body2" color={taken ? 'error' : 'text.primary'}>
                              {wd.startHours} – {wd.endHours}
                              {taken && ' (დაკავებულია)'}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}

          {/* MY BOOKINGS */}
          {tab === 2 && (
            bookingsLoading ? <CircularProgress /> : myBookings.length === 0 ? (
              <Alert severity="info">ჯავშნები არ გაქვთ</Alert>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell fontWeight={700}>კურიერი</TableCell>
                      <TableCell fontWeight={700}>დღე</TableCell>
                      <TableCell fontWeight={700}>სამუშ. საათები</TableCell>
                      <TableCell fontWeight={700}>მოქმედება</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {myBookings.map((b) => {
                      const c = couriers.find((c) => c.id === b.courierId);
                      return (
                        <TableRow key={b.id}>
                          <TableCell>{c ? `${c.firstName} ${c.lastName ?? ''}` : b.courierId}</TableCell>
                          <TableCell><Chip label={DAY_LABELS[b.day]} size="small" /></TableCell>
                          <TableCell>{b.startHours} – {b.endHours}</TableCell>
                          <TableCell>
                            <Button size="small" color="error" onClick={() => dispatch(cancelBooking(b.id))}>
                              გაუქმება
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )
          )}
        </Box>
      </Paper>

      {/* Booking dialog */}
      <Dialog open={!!bookDialog} onClose={() => setBookDialog(null)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={700}>
          კურიერის გამოძახება — {bookDialog?.firstName}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {bookError && <Alert severity="error">{bookError}</Alert>}
            <TextField
              select
              fullWidth
              label="სამუშაო დღე"
              size="small"
              value={selectedDay}
              onChange={(e) => { setSelectedDay(e.target.value as DayOfWeek); setBookError(''); }}
            >
              {bookDialog && ALL_DAYS.filter((d) => bookDialog.workingDays[d]).map((day) => {
                const taken = isSlotTaken(bookDialog.id, day);
                return (
                  <MenuItem key={day} value={day} disabled={taken}>
                    {DAY_LABELS[day]} — {bookDialog.workingDays[day]!.startHours} – {bookDialog.workingDays[day]!.endHours}
                    {taken && ' 🔴 დაკავებული'}
                  </MenuItem>
                );
              })}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookDialog(null)}>გაუქმება</Button>
          <Button variant="contained" onClick={handleBook} disabled={!selectedDay} sx={{ background: '#1a1a2e' }}>
            დაჯავშნა
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default UserPage;
