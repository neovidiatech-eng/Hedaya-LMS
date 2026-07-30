import { X, CheckCircle, Package, Users, User, Loader2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { usePlans } from '../../features/admin/hooks/usePlans';

interface SubscribePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubscribePlanModal({ isOpen, onClose }: SubscribePlanModalProps) {
  const { language } = useLanguage();
  const { data: plansData, isLoading, isError } = usePlans();

  const text = {
    title: { ar: 'خطط الاشتراك', en: 'Subscription Plans' },
    subtitle: {
      ar: 'اختر الخطة المناسبة لك وابدأ رحلتك التعليمية معنا',
      en: 'Choose the right plan for you and start your educational journey with us'
    },
    subscribe: { ar: 'اشترك الآن', en: 'Subscribe Now' },
    popular: { ar: 'الأكثر شعبية', en: 'Most Popular' },
    sessions: { ar: 'حصة', en: 'sessions' },
    days: { ar: 'يوم', en: 'days' },
    noPlans: { ar: 'لا توجد خطط مجهزة حالياً', en: 'No active plans found' },
    features: { ar: 'المميزات', en: 'Features' },
    groupPlan: { ar: 'خطة جماعية', en: 'Group Plan' },
    individualPlan: { ar: 'خطة فردية', en: 'Individual Plan' },
    maxStudents: { ar: 'طلاب في المجموعة', en: 'students per group' }
  };

  if (!isOpen) return null;

  // Filter only active & non-hidden plans for subscribers/students
  const activePlans = (plansData || []).filter(p => p.active && !p.isHidden);

  return (
    <div className="fixed inset-0 !mt-0 z-[9999] bg-white overflow-y-auto no-scrollbar">
      <div className="min-h-screen p-6 sm:p-12 relative flex flex-col" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <button
          onClick={onClose}
          className="absolute top-6 left-6 p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-12 mt-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{text.title[language]}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {text.subtitle[language]}
          </p>
        </div>

        <div className="max-w-7xl mx-auto w-full flex-1 mb-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-gray-500 font-medium">
                {language === 'ar' ? 'جاري تحميل خطط الاشتراك...' : 'Loading subscription plans...'}
              </p>
            </div>
          ) : isError || activePlans.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-12 text-center h-full flex flex-col items-center justify-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">{text.noPlans[language]}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch h-full">
              {activePlans.map((plan) => {
                const isGroupPlan = plan.isGroup || plan.is_group || plan.planType === 'group' || plan.plan_type === 'group';
                const isBestSeller = plan.bestSeller || plan.best_seller;
                const sessionsCount = plan.sessionsCount ?? plan.sessions_count ?? 0;
                const maxStudents = plan.maxStudents ?? plan.max_students ?? 1;

                return (
                  <div
                    key={plan.id}
                    className={`bg-white rounded-3xl shadow-lg transition-all hover:-translate-y-2 hover:shadow-xl relative flex flex-col h-full bg-clip-padding border-2 ${
                      isBestSeller
                        ? 'border-primary ring-2 ring-primary/20 scale-105 z-10'
                        : 'border-gray-100'
                    }`}
                  >
                    {isBestSeller && (
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-max px-4 py-1.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-full font-bold text-sm shadow-sm z-20">
                        ★ {text.popular[language]}
                      </div>
                    )}

                    <div className="p-8 flex-1 flex flex-col">
                      <div className="text-center mb-6">
                        <div className="flex justify-center mb-2">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                            isGroupPlan ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {isGroupPlan ? <Users className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                            {isGroupPlan ? `${text.groupPlan[language]} (${maxStudents} ${text.maxStudents[language]})` : text.individualPlan[language]}
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {language === 'ar' ? plan.name_ar : plan.name_en}
                        </h3>
                        <p className="text-gray-500 text-sm">{plan.description || ''}</p>
                      </div>

                      <div className="text-center mb-8">
                        <div className="flex justify-center items-baseline gap-2">
                          <span className="text-5xl font-extrabold text-gray-900">{plan.price}</span>
                          <div className="text-start flex flex-col items-start leading-none gap-1">
                            <span className="text-gray-500 font-medium">{plan.currency?.code || ''}</span>
                            <span className="text-xs text-gray-400">/{plan.duration} {text.days[language]}</span>
                          </div>
                        </div>
                        <div className="mt-3 inline-block px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold">
                          {sessionsCount} {text.sessions[language]} ({plan.sessionTime || 60} {language === 'ar' ? 'دقيقة' : 'min'})
                        </div>
                      </div>

                      <div className="space-y-4 mb-8 flex-1">
                        {(plan.features || []).map((feature, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 text-start w-full text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                          isBestSeller
                            ? 'bg-primary text-white hover:bg-primary/90 shadow-md hover:shadow-lg'
                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        }`}
                      >
                        {text.subscribe[language]}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
