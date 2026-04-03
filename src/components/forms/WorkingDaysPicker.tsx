import React, { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  TextField,
  Typography,
  Chip,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import type { DayOfWeek, WorkingDays, WorkingHours } from '@/types';
import { DAY_LABELS, ALL_DAYS, generateTimeSlots } from '@/utils/mockData';

interface WorkingDayEntry {
  id: string;
  day: DayOfWeek | '';
  startHours: string;
  endHours: string;
}

interface WorkingDaysPickerProps {
  value: WorkingDays;
  onChange: (days: WorkingDays) => void;
  error?: string;
}

const TIME_SLOTS = generateTimeSlots();

const WorkingDaysPicker: React.FC<WorkingDaysPickerProps> = ({ value, onChange, error }) => {
  const [entries, setEntries] = useState<WorkingDayEntry[]>([
    { id: '1', day: '', startHours: '', endHours: '' },
  ]);

  const usedDays = entries.map((e) => e.day).filter(Boolean) as DayOfWeek[];

  const updateEntry = (id: string, field: keyof WorkingDayEntry, val: string) => {
    const updated = entries.map((e) => (e.id === id ? { ...e, [field]: val } : e));
    setEntries(updated);
    // Sync to parent
    const workingDays: WorkingDays = {};
    updated.forEach((e) => {
      if (e.day && e.startHours && e.endHours) {
        workingDays[e.day as DayOfWeek] = {
          startHours: e.startHours,
          endHours: e.endHours,
        };
      }
    });
    onChange(workingDays);
  };

  const addEntry = () => {
    setEntries((prev) => [
      ...prev,
      { id: String(Date.now()), day: '', startHours: '', endHours: '' },
    ]);
  };

  const removeEntry = (id: string) => {
    if (entries.length <= 1) return;
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    const workingDays: WorkingDays = {};
    updated.forEach((e) => {
      if (e.day && e.startHours && e.endHours) {
        workingDays[e.day as DayOfWeek] = { startHours: e.startHours, endHours: e.endHours };
      }
    });
    onChange(workingDays);
  };

  const filledCount = entries.filter((e) => e.day && e.startHours && e.endHours).length;

  return (
    <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
        <Typography variant="subtitle2" fontWeight={600} color="text.primary">
          სამუშაო დღეები
        </Typography>
        <Chip
          label={`${filledCount}/5 მინიმუმი`}
          size="small"
          color={filledCount >= 5 ? 'success' : 'default'}
        />
      </Box>

      {error && <Alert severity="error" sx={{ mb: 1.5 }}>{error}</Alert>}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {entries.map((entry) => (
          <Box key={entry.id} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
            {/* Day selector */}
            <TextField
              select
              label="დღე"
              value={entry.day}
              onChange={(e) => updateEntry(entry.id, 'day', e.target.value)}
              size="small"
              sx={{ minWidth: 140 }}
            >
              {ALL_DAYS.map((day) => (
                <MenuItem
                  key={day}
                  value={day}
                  disabled={usedDays.includes(day) && entry.day !== day}
                >
                  {DAY_LABELS[day]}
                </MenuItem>
              ))}
            </TextField>

            {/* Start time */}
            <TextField
              select
              label="დაწყება"
              value={entry.startHours}
              onChange={(e) => updateEntry(entry.id, 'startHours', e.target.value)}
              size="small"
              sx={{ minWidth: 100 }}
            >
              {TIME_SLOTS.map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </TextField>

            {/* End time */}
            <TextField
              select
              label="დასრულება"
              value={entry.endHours}
              onChange={(e) => updateEntry(entry.id, 'endHours', e.target.value)}
              size="small"
              sx={{ minWidth: 100 }}
            >
              {TIME_SLOTS.filter((t) => !entry.startHours || t > entry.startHours).map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </TextField>

            <IconButton
              onClick={() => removeEntry(entry.id)}
              disabled={entries.length <= 1}
              size="small"
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Box>

      <Button
        startIcon={<AddIcon />}
        onClick={addEntry}
        disabled={entries.length >= 7}
        size="small"
        sx={{ mt: 1.5 }}
        variant="outlined"
      >
        დღის დამატება
      </Button>
    </Box>
  );
};

export default WorkingDaysPicker;
