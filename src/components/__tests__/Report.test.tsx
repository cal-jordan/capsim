import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Report from '../Report';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import reportReducer from '../../store/slices/reportSlice';

vi.mock('react-apexcharts', () => ({
  __esModule: true,
  default: vi.fn(() => <div data-testid="mock-chart">Chart Component</div>),
}));

vi.mock('../../store/slices/reportSlice', () => ({
  __esModule: true,
  default: (state = {
    reports: [],
    loading: false,
    error: null,
  }, action: any) => state,
  fetchReports: () => ({ type: 'report/fetchReports' }),
}));

describe('Report Component', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        report: reportReducer,
      },
    });

    store.getState = vi.fn().mockReturnValue({
      report: {
        reports: [
          { range: '0-20%', count: 5 },
          { range: '21-40%', count: 12 },
          { range: '41-60%', count: 25 },
          { range: '61-80%', count: 30 },
          { range: '81-100%', count: 18 },
        ],
        loading: false,
        error: null,
      },
    });
  });

  it('renders loading state correctly', () => {
    store.getState = vi.fn().mockReturnValue({
      report: {
        reports: [],
        loading: true,
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <Report />
      </Provider>
    );
    
    expect(screen.getByText('Loading reports...')).toBeInTheDocument();
  });

  it('renders error state correctly', () => {
    store.getState = vi.fn().mockReturnValue({
      report: {
        reports: [],
        loading: false,
        error: 'Failed to fetch reports',
      },
    });

    render(
      <Provider store={store}>
        <Report />
      </Provider>
    );
    
    expect(screen.getByText('Failed to fetch reports')).toBeInTheDocument();
  });

  it('renders the chart with the correct title when data is available', () => {
    render(
      <Provider store={store}>
        <Report />
      </Provider>
    );
    
    expect(screen.getByText('Quiz Score Distribution')).toBeInTheDocument();
    expect(screen.getByTestId('mock-chart')).toBeInTheDocument();
  });
}); 