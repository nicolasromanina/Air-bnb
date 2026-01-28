import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { TrendingUp, Users, DollarSign, Star, Loader, AlertCircle } from 'lucide-react';
import { api } from '@/services/api';

interface DashboardStats {
  currentMonth: {
    totalBookings: number;
    totalRevenue: number;
    averageBookingValue: number;
    bookingChangePercent: number;
    revenueChangePercent: number;
  };
  yearToDate: {
    totalBookings: number;
    totalRevenue: number;
    averageBookingValue: number;
  };
  allTime: {
    totalBookings: number;
    totalRevenue: number;
  };
}

interface ChartData {
  month: string;
  revenue: number;
  bookings: number;
}

interface ApartmentStats {
  _id: { apartmentId: number; title: string };
  bookings: number;
  revenue: number;
  averagePrice: number;
}

interface ReviewAnalytics {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  pendingReviews: number;
}

export const AnalyticsDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueChart, setRevenueChart] = useState<ChartData[]>([]);
  const [apartmentStats, setApartmentStats] = useState<ApartmentStats[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, revenueRes, apartmentRes, reviewRes] = await Promise.all([
          api.get('/analytics/dashboard/stats'),
          api.get('/analytics/revenue/monthly'),
          api.get('/analytics/apartments'),
          api.get('/analytics/reviews')
        ]);

        setStats(statsRes.data);
        setRevenueChart(revenueRes.data);
        setApartmentStats(apartmentRes.data.slice(0, 5));
        setReviewStats(reviewRes.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader className="animate-spin" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex gap-3">
        <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
        <div>
          <h3 className="font-bold text-red-900">Error Loading Analytics</h3>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">Track your property performance and revenue</p>
      </div>

      {/* Key Metrics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Current Month Bookings */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-600 text-sm font-medium">This Month</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {stats.currentMonth.totalBookings}
                </h3>
              </div>
              <Users className="text-blue-600" size={24} />
            </div>
            <p
              className={`text-sm font-medium ${
                stats.currentMonth.bookingChangePercent >= 0
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {stats.currentMonth.bookingChangePercent >= 0 ? '+' : ''}
              {stats.currentMonth.bookingChangePercent.toFixed(1)}% vs last month
            </p>
          </div>

          {/* Current Month Revenue */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-600 text-sm font-medium">Monthly Revenue</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  €{stats.currentMonth.totalRevenue.toFixed(0)}
                </h3>
              </div>
              <DollarSign className="text-green-600" size={24} />
            </div>
            <p
              className={`text-sm font-medium ${
                stats.currentMonth.revenueChangePercent >= 0
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {stats.currentMonth.revenueChangePercent >= 0 ? '+' : ''}
              {stats.currentMonth.revenueChangePercent.toFixed(1)}% vs last month
            </p>
          </div>

          {/* Year to Date */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-600 text-sm font-medium">Year to Date</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {stats.yearToDate.totalBookings}
                </h3>
              </div>
              <TrendingUp className="text-purple-600" size={24} />
            </div>
            <p className="text-sm text-gray-600">
              €{stats.yearToDate.totalRevenue.toFixed(0)} revenue
            </p>
          </div>

          {/* Average Booking Value */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-600 text-sm font-medium">Avg. Booking</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  €{stats.currentMonth.averageBookingValue.toFixed(0)}
                </h3>
              </div>
              <DollarSign className="text-orange-600" size={24} />
            </div>
            <p className="text-sm text-gray-600">Per reservation</p>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Trend (12 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="displayLabel" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip formatter={(value) => `€${value}`} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bookings Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Bookings Trend (12 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="displayLabel" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="bookings" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Apartment Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Apartments */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top Performing Properties</h3>
          <div className="space-y-4">
            {apartmentStats.map((apt, idx) => (
              <div key={apt._id.apartmentId} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">{idx + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{apt._id.title}</p>
                  <p className="text-sm text-gray-600">
                    {apt.bookings} bookings • €{apt.revenue.toFixed(0)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Review Distribution */}
        {reviewStats && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Review Distribution</h3>
            <div className="flex gap-8">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie
                    data={[
                      { name: '5 Stars', value: reviewStats.ratingDistribution[5] },
                      { name: '4 Stars', value: reviewStats.ratingDistribution[4] },
                      { name: '3 Stars', value: reviewStats.ratingDistribution[3] },
                      { name: '2 Stars', value: reviewStats.ratingDistribution[2] },
                      { name: '1 Star', value: reviewStats.ratingDistribution[1] }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {[0, 1, 2, 3, 4].map((index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="flex-1 flex flex-col justify-center space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">Average Rating</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {reviewStats.averageRating.toFixed(1)}/5
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    {reviewStats.totalReviews} Reviews
                  </p>
                  {reviewStats.pendingReviews > 0 && (
                    <p className="text-sm text-orange-600">
                      {reviewStats.pendingReviews} pending moderation
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
