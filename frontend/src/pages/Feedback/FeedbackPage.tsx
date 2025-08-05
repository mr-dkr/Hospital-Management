import React, { useState, useEffect } from 'react';
import { MessageSquare, Search, Calendar, Filter, Smile, Meh, Frown, User, Star } from 'lucide-react';
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

    // Fetch feedback data on component mount
    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const feedbackData = await feedbackAPI.getFeedbacks(token);
                setFeedback(feedbackData);
            } catch (error) {
                console.error('Error fetching feedback:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeedback();
    }, []);

    const filteredFeedback = feedback.filter(item => {
        const matchesSearch = item.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.comments.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRating = ratingFilter === 'all' || item.rating === ratingFilter;
        const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
        const matchesDate = !dateFilter || item.submitted_date.includes(dateFilter);

        return matchesSearch && matchesRating && matchesCategory && matchesDate;
    });

    const feedbackStats = {
        total: feedback.length,
        happy: feedback.filter(f => f.rating === 'happy').length,
        satisfied: feedback.filter(f => f.rating === 'satisfied').length,
        notSatisfied: feedback.filter(f => f.rating === 'not-satisfied').length
    };

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
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading feedback statistics...</p>
                    </div>
                ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Feedback</p>
                            <p className="text-2xl font-bold text-gray-800">{feedbackStats.total}</p>
                        </div>
                        <MessageSquare className="w-8 h-8 text-blue-600" />
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Happy</p>
                            <p className="text-2xl font-bold text-green-600">{feedbackStats.happy}</p>
                            <p className="text-xs text-gray-500">{Math.round((feedbackStats.happy / feedbackStats.total) * 100)}%</p>
                        </div>
                        <Smile className="w-8 h-8 text-green-600" />
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Satisfied</p>
                            <p className="text-2xl font-bold text-yellow-600">{feedbackStats.satisfied}</p>
                            <p className="text-xs text-gray-500">{Math.round((feedbackStats.satisfied / feedbackStats.total) * 100)}%</p>
                        </div>
                        <Meh className="w-8 h-8 text-yellow-600" />
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Not Satisfied</p>
                            <p className="text-2xl font-bold text-red-600">{feedbackStats.notSatisfied}</p>
                            <p className="text-xs text-gray-500">{Math.round((feedbackStats.notSatisfied / feedbackStats.total) * 100)}%</p>
                        </div>
                        <Frown className="w-8 h-8 text-red-600" />
                    </div>
                </div>
                )}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search feedback..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <select
                            value={ratingFilter}
                            onChange={(e) => setRatingFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                        >
                            <option value="all">All Ratings</option>
                            <option value="happy">Happy</option>
                            <option value="satisfied">Satisfied</option>
                            <option value="not-satisfied">Not Satisfied</option>
                        </select>
                    </div>
                    <div>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Categories</option>
                            <option value="service">Service</option>
                            <option value="wait-time">Wait Time</option>
                            <option value="treatment">Treatment</option>
                            <option value="facilities">Facilities</option>
                            <option value="overall">Overall</option>
                        </select>
                    </div>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Feedback List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Patient Feedback ({filteredFeedback.length})
                            </h2>
                        </div>
                        <div className="space-y-4 p-6">
                            {filteredFeedback.length === 0 ? (
                                <div className="text-center py-12">
                                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">No feedback found matching your filters</p>
                                </div>
                            ) : (
                                filteredFeedback.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => setSelectedFeedback(item)}
                                        className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${selectedFeedback?.id === item.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <User className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-800">{item.patient_name}</h3>
                                                    <p className="text-sm text-gray-600">
                                                        Visit: {new Date(item.visit_date).toLocaleDateString('en-IN')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end space-y-2">
                                                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full border ${getRatingColor(item.rating)}`}>
                                                    {getRatingIcon(item.rating)}
                                                    <span className="text-xs font-medium capitalize">{item.rating.replace('-', ' ')}</span>
                                                </div>
                                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full capitalize">
                                                    {item.category.replace('-', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 line-clamp-3 mb-2">{item.comments}</p>
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span>Submitted: {new Date(item.submitted_date).toLocaleDateString('en-IN')}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Feedback Details */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-6">
                        {selectedFeedback ? (
                            <div>
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                            <User className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-800">{selectedFeedback.patient_name}</h2>
                                            <p className="text-sm text-gray-600">
                                                {new Date(selectedFeedback.visit_date).toLocaleDateString('en-IN', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border ${getRatingColor(selectedFeedback.rating)}`}>
                                            {getRatingIcon(selectedFeedback.rating)}
                                            <span className="font-medium capitalize">{selectedFeedback.rating.replace('-', ' ')}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 space-y-6">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-800 mb-2">Category</h3>
                                        <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm capitalize">
                                            {selectedFeedback.category.replace('-', ' ')}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-800 mb-3">Feedback Comments</h3>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-700 leading-relaxed">{selectedFeedback.comments}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-800 mb-2">Submission Details</h3>
                                        <div className="space-y-2 text-sm text-gray-600">
                                            <div className="flex justify-between">
                                                <span>Visit Date:</span>
                                                <span>{new Date(selectedFeedback.visit_date).toLocaleDateString('en-IN')}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Submitted:</span>
                                                <span>{new Date(selectedFeedback.submitted_date).toLocaleDateString('en-IN')}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Appointment ID:</span>
                                                <span className="font-mono text-xs">{selectedFeedback.appointment_id}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {selectedFeedback.rating === 'not-satisfied' && (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                            <h4 className="text-sm font-semibold text-red-800 mb-2">Action Required</h4>
                                            <p className="text-sm text-red-700">
                                                This patient expressed dissatisfaction. Consider following up to address their concerns.
                                            </p>
                                            <button className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors">
                                                Schedule Follow-up
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="p-6 text-center">
                                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">Select feedback to view details</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedbackPage;