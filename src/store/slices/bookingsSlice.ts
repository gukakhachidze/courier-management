import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { CourierBooking } from '@/types';
import { mockBookings } from '@/utils/mockData';

interface BookingsState {
  bookings: CourierBooking[];
  isLoading: boolean;
  error: string | null;
}

const initialState: BookingsState = {
  bookings: [],
  isLoading: false,
  error: null,
};

export const fetchBookings = createAsyncThunk('bookings/fetchAll', async () => {
  await new Promise((r) => setTimeout(r, 400));
  return mockBookings;
});

export const createBooking = createAsyncThunk(
  'bookings/create',
  async (booking: Omit<CourierBooking, 'id'>, { rejectWithValue }) => {
    try {
      await new Promise((r) => setTimeout(r, 400));
      const newBooking: CourierBooking = { ...booking, id: `b_${Date.now()}` };
      return newBooking;
    } catch {
      return rejectWithValue('Failed to create booking');
    }
  }
);

export const cancelBooking = createAsyncThunk('bookings/cancel', async (id: string) => {
  await new Promise((r) => setTimeout(r, 300));
  return id;
});

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    addBookingOptimistic(state, action: PayloadAction<CourierBooking>) {
      state.bookings.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Error';
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.bookings.push(action.payload);
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.bookings = state.bookings.filter((b) => b.id !== action.payload);
      });
  },
});

export const { addBookingOptimistic } = bookingsSlice.actions;
export default bookingsSlice.reducer;
