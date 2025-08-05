import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  Calendar,
  Filter,
  Smile,
  Meh,
  Frown,
  User,
  Star,
} from 'lucide-react';
import { feedbackAPI, Feedback } from '../../api/feedback';

const FeedbackPage: React.FC = () => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);

  const getRatingIcon = (rating: string) => {
    switch (rating) {
      case 'happy':
        return <Smile className="w-5 h-5 text-green-600" />;
      case 'satisfied':
        return <Meh className="w-5 h-5 text-yellow-600" />;
      case 'not-satisfied':
        return <Frown className="w-5 h-5 text-red-600" />;
      default:
        return <Star className="w-5 h-5 text-gray-600" />;
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'happy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'satisfied':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'not-satisfied':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const feedbackData = await feedbackAPI.getFeedbacks(token);
        setFeedback(feedbackData);
      } catch (error: any) {
        console.error('Error fetching feedback:', error?.message || error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  const filteredFeedback = feedback.filter((item) => {
    const matchesSearch =
      (item.patient_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (item.comments?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    const matchesRating = ratingFilter === 'all' || item.rating === ratingFilter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesDate = !dateFilter || item.submitted_date.includes(dateFilter);

    return matchesSearch && matchesRating && matchesCategory && matchesDate;
  });

  const feedbackStats = {
    total: feedback.length,
    happy: feedback.filter((f) => f.rating === 'happy').length,
    satisfied: feedback.filter((f) => f.rating === 'satisfied').length,
    notSatisfied: feedback.filter((f) => f.rating === 'not-satisfied').length,
  };

  const getPercentage = (count: number) =>
    feedbackStats.total > 0 ? Math.round((count / feedbackStats.total) * 100) : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Patient Feedback</h1>
          <p className="text-gray-600">Review and manage patient feedback and satisfaction ratings</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-4 text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
            <p className="mt-4 text-gray-600">Loading feedback statistics...</p>
          </div>
        ) : (
          <>
            <StatCard title="Total Feedback" value={feedbackStats.total} icon={<MessageSquare className="w-8 h-8 text-blue-600" />} />
            <StatCard title="Happy" value={feedbackStats.happy} percentage={getPercentage(feedbackStats.happy)} icon={<Smile className="w-8 h-8 text-green-600" />} />
            <StatCard title="Satisfied" value={feedbackStats.satisfied} percentage={getPercentage(feedbackStats.satisfied)} icon={<Meh className="w-8 h-8 text-yellow-600" />} />
            <StatCard title="Not Satisfied" value={feedbackStats.notSatisfied} percentage={getPercentage(feedbackStats.notSatisfied)} icon={<Frown className="w-8 h-8 text-red-600" />} />
          </>
        )}
      </div>

      {/* Filters */}
      {/* ... (no changes to filters, same as your version) */}

      {/* Feedback List + Details */}
      {/* ... (no major change, cleaned up minor spacing/indentation) */}
    </div>
  );
};

// Reusable stat card component
const StatCard = ({ title, value, percentage, icon }: { title: string; value: number; percentage?: number; icon: React.ReactNode }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className={`text-2xl font-bold ${title === 'Happy' ? 'text-green-600' : title === 'Satisfied' ? 'text-yellow-600' : title === 'Not Satisfied' ? 'text-red-600' : 'text-gray-800'}`}>
          {value}
        </p>
        {percentage !== undefined && <p className="text-xs text-gray-500">{percentage}%</p>}
      </div>
      {icon}
    </div>
  </div>
);

export default FeedbackPage;
