import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { fetchReports } from '../store/slices/reportSlice';
import { useAppDispatch } from '../hooks/useAppDispatch';
import ApexCharts from 'react-apexcharts';

interface ScoreRange {
  range: string;
  count: number;
}

const Report: React.FC = () => {
  const dispatch = useAppDispatch();
  const { reports, loading, error } = useSelector(
    (state: RootState) => state.report,
  );

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  if (loading) {
    return <div className="text-center">Loading reports...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  const series = [
    {
      data: reports.map((d: ScoreRange) => d.count),
    },
  ];

  const options = {
    chart: { type: 'bar' as const, height: 350 },
    plotOptions: {
      bar: { horizontal: true },
    },
    dataLabels: { enabled: true },
    xaxis: {
      categories: reports.map((d: ScoreRange) => d.range),
      title: { text: 'Number of users' },
    },
    title: { text: 'Capsim Quiz Score Distribution', align: 'center' as const },
  };

  return (
    <div className="report-container p-4">
      <h2 className="mb-4">Quiz Score Distribution</h2>
      <div className="card">
        <div className="card-body">
          <ApexCharts
            options={options}
            series={series}
            type="bar"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default Report;
