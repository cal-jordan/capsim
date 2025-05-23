import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import type { Report, ReportState } from '../../types';

const initialState: ReportState = {
  reports: [],
  loading: false,
  error: null,
};

export const fetchReports = createAsyncThunk<Report[]>(
  'report/fetchReports',
  async () => {
    const response = await api.get('/api/report');
    return response.data;
  },
);

const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch reports';
      });
  },
});

export default reportSlice.reducer;
