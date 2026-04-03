import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AdminState, CourierUser, RegularUser } from '@/types';
import { mockUsers, mockCouriers, mockBookings } from '@/utils/mockData';

const initialState: AdminState = {
  users: [],
  couriers: [],
  bookings: [],
  isLoading: false,
  error: null,
};

export const fetchAllData = createAsyncThunk('admin/fetchAll', async () => {
  await new Promise((r) => setTimeout(r, 600));
  return { users: mockUsers, couriers: mockCouriers, bookings: mockBookings };
});

export const deleteUser = createAsyncThunk('admin/deleteUser', async (id: string) => {
  await new Promise((r) => setTimeout(r, 300));
  return id;
});

export const deleteCourier = createAsyncThunk('admin/deleteCourier', async (id: string) => {
  await new Promise((r) => setTimeout(r, 300));
  return id;
});

export const updateCourier = createAsyncThunk(
  'admin/updateCourier',
  async (data: Partial<CourierUser> & { id: string }) => {
    await new Promise((r) => setTimeout(r, 300));
    return data;
  }
);

export const addUser = createAsyncThunk('admin/addUser', async (user: RegularUser) => {
  await new Promise((r) => setTimeout(r, 300));
  return user;
});

export const addCourier = createAsyncThunk('admin/addCourier', async (courier: CourierUser) => {
  await new Promise((r) => setTimeout(r, 300));
  return courier;
});

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.users;
        state.couriers = action.payload.couriers;
        state.bookings = action.payload.bookings;
      })
      .addCase(fetchAllData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Error';
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
      })
      .addCase(deleteCourier.fulfilled, (state, action) => {
        state.couriers = state.couriers.filter((c) => c.id !== action.payload);
      })
      .addCase(updateCourier.fulfilled, (state, action) => {
        const idx = state.couriers.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) {
          state.couriers[idx] = { ...state.couriers[idx], ...action.payload };
        }
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(addCourier.fulfilled, (state, action) => {
        state.couriers.push(action.payload);
      });
  },
});

export default adminSlice.reducer;
