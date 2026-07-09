import React, { useState, useMemo } from 'react';
import { X, Wallet, Calendar, CheckCircle2, History } from 'lucide-react';
import { Teacher } from '../../types/teachers';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../../features/admin/hooks/useCurrency';
import { useGetTeacherStats } from '../../features/admin/hooks/useTeacher';

interface TeacherFinancialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: Teacher;
}

export default function TeacherFinancialsModal({ isOpen, onClose, teacher }: TeacherFinancialsModalProps) {
  const { t, i18n } = useTranslation();
  const language = i18n.language.split('-')[0];
  
  const { data: currenciesData } = useCurrency();
  const currencySymbol = useMemo(() => {
    if (!teacher || !currenciesData?.currencies) return '';
    const currency = currenciesData.currencies.find((c: any) => c.id === teacher.currencyId);
    return currency ? (currency.symbol || currency.code) : '';
  }, [teacher, currenciesData]);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [appliedStartDate, setAppliedStartDate] = useState('');
  const [appliedEndDate, setAppliedEndDate] = useState('');
  const [isFiltered, setIsFiltered] = useState(false);
  const [filteredWithdrawals, setFilteredWithdrawals] = useState(teacher?.WithdrawalsResult || []);
  const [filteredSessions, setFilteredSessions] = useState(teacher?.completedSessionsCount || 0);
  
  
  const walletBalance = teacher?.user?.wallet?.[0]?.balance || 0;

  // Sync data if teacher changes
  React.useEffect(() => {
    if (teacher) {
      setFilteredWithdrawals(teacher.WithdrawalsResult || []);
      setFilteredSessions(teacher.completedSessionsCount || 0);
      setIsFiltered(false);
      setStartDate('');
      setEndDate('');
      setAppliedStartDate('');
      setAppliedEndDate('');
    }
  }, [teacher]);

  const { data: stats } = useGetTeacherStats(
    teacher?.id || '',
    appliedStartDate,
    appliedEndDate,
    isOpen && !!teacher?.id && isFiltered
  );

  // Sync data if stats API updates when filtered
  React.useEffect(() => {
    if (stats?.data && isFiltered) {
      setFilteredWithdrawals(stats.data.WithdrawalsResult || []);
      setFilteredSessions(stats.data.completedSessionsCount || 0);
    }
  }, [stats, isFiltered]);

  if (!isOpen || !teacher) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate && !endDate) {
       // Reset filters
       setFilteredWithdrawals(teacher.WithdrawalsResult || []);
       setIsFiltered(false);
       setAppliedStartDate('');
       setAppliedEndDate('');
       return;
    }

    setAppliedStartDate(startDate);
    setAppliedEndDate(endDate);
    setIsFiltered(true);

    const start = startDate ? new Date(startDate) : new Date(0);
    const end = endDate ? new Date(endDate) : new Date();

    // Set end date to the end of the day
    end.setHours(23, 59, 59, 999);

    const withdrawals = (teacher.WithdrawalsResult || []).filter(w => {
      if (!w.createdAt) return true;
      const date = new Date(w.createdAt);
      return date >= start && date <= end;
    });

    setFilteredWithdrawals(withdrawals);
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setAppliedStartDate('');
    setAppliedEndDate('');
    setFilteredWithdrawals(teacher.WithdrawalsResult || []);
    setIsFiltered(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {t('teacherFinancials')}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {teacher.user?.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {/* Date Filter Form */}
          <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-xl mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <h3 className="font-semibold text-gray-700">
                {t('filterByDate')}
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('fromDate')}
                </label>
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('toDate')}
                </label>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                type="submit" 
                className="btn-primary text-white px-4 py-2 rounded-lg flex-1 font-medium transition-colors"
              >
                {t('applyFilter')}
              </button>
              {isFiltered && (
                <button 
                  type="button" 
                  onClick={handleReset}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  {t('resetFilter')}
                </button>
              )}
            </div>
          </form>

          {/* Data Section (Hidden until filtered) */}
          {isFiltered ? (
            <>
              {/* Statistics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {t('totalWalletBalance')}
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {stats?.data?.user?.wallet?.[0]?.balance ?? walletBalance} {currencySymbol}
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-lg text-green-600">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {t('totalCompletedSessions')}
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {filteredSessions}
                    </p>
                  </div>
                </div>
              </div>

              {/* Withdrawals List */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <History className="w-5 h-5 text-gray-500" />
                  <h3 className="text-lg font-bold text-gray-900">
                    {t('withdrawalsInPeriod')}
                    {isFiltered && <span className="text-sm text-primary mx-2">({filteredWithdrawals.length})</span>}
                  </h3>
                </div>

                {filteredWithdrawals.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-100 text-gray-500">
                    {t('noWithdrawalsInPeriod')}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredWithdrawals.map((withdrawal, idx) => (
                      <div key={withdrawal.id || idx} className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div>
                          <p className="font-bold text-gray-900">
                            {withdrawal.amount} {currencySymbol}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(withdrawal.createdAt || '').toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
                              year: 'numeric', month: 'long', day: 'numeric',
                              hour: '2-digit', minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            withdrawal.status?.toLowerCase() === 'completed' || withdrawal.status?.toLowerCase() === 'approved'
                              ? 'bg-green-100 text-green-700'
                              : withdrawal.status?.toLowerCase() === 'pending'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {withdrawal.status?.toLowerCase() === 'completed' 
                              ? t('completed')
                              : withdrawal.status?.toLowerCase() === 'pending'
                              ? t('pending')
                              : withdrawal.status?.toLowerCase() === 'approved'
                              ? t('approved', 'مقبول')
                              : (withdrawal.status || t('unknownStatus'))}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-lg font-medium">
                {t('pleaseSelectDateRange')}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
}
