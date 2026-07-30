import { useState } from "react";
import { Plus, Edit, Trash2, Eye, Package, CheckCircle, Search, Users, User, EyeOff, Star } from "lucide-react";
import { useLanguage } from "../../../contexts/LanguageContext";
import AddPlanModal from "../../../components/modals/AddPlanModal";
import ViewPlanModal from "../../../components/modals/ViewPlanModal";
import { usePlans, useAddPlan, useUpdatePlan, useDeletePlan } from "../hooks/usePlans";
import { useConfirm } from "../../../hooks/useConfirm";
import { Plan } from "../../../types/plan";
import { PlanFormData } from "../../../lib/schemas/PlanSchema";

export default function Plans() {
  const { language } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "individual" | "group" | "popular" | "hidden">("all");
  const { confirm, ConfirmDialog } = useConfirm();

  const { data: rawPlans = [], isLoading, isError, error } = usePlans();
  const { mutateAsync: addPlanMutation } = useAddPlan();
  const { mutateAsync: updatePlanMutation } = useUpdatePlan();
  const { mutateAsync: deletePlanMutation } = useDeletePlan();

  const text = {
    title: { ar: "إدارة خطط الاشتراك", en: "Subscription Plans Management" },
    addPlan: { ar: "إضافة خطة جديدة", en: "Add New Plan" },
    searchPlaceholder: { ar: "البحث في خطط الاشتراك...", en: "Search subscription plans..." },
    tabAll: { ar: "الكل", en: "All" },
    tabIndividual: { ar: "فردية", en: "Individual" },
    tabGroup: { ar: "جماعية", en: "Group" },
    tabPopular: { ar: "الأكثر شعبية", en: "Most Popular" },
    tabHidden: { ar: "المخفية", en: "Hidden" },
    totalPlans: { ar: "إجمالي الخطط", en: "Total Plans" },
    individualPlansCount: { ar: "الخطط الفردية", en: "Individual Plans" },
    groupPlansCount: { ar: "الخطط الجماعية", en: "Group Plans" },
    popularPlansCount: { ar: "الأكثر شعبية", en: "Most Popular" },
    features: { ar: "المميزات", en: "Features" },
    edit: { ar: "تعديل", en: "Edit" },
    delete: { ar: "حذف", en: "Delete" },
    view: { ar: "عرض", en: "View" },
    active: { ar: "نشط", en: "Active" },
    inactive: { ar: "غير نشط", en: "Inactive" },
    popular: { ar: "الأكثر شعبية", en: "Most Popular" },
    hidden: { ar: "مخفي", en: "Hidden" },
    sessions: { ar: "حصة", en: "sessions" },
    days: { ar: "يوم", en: "days" },
    noPlans: { ar: "لا توجد خطط اشتراك مطابقة", en: "No matching subscription plans found" },
    confirmDelete: {
      ar: "هل أنت متأكد من حذف هذه الخطة؟ لا يمكن التراجع بعد الحذف.",
      en: "Are you sure you want to delete this plan? This action cannot be undone.",
    },
    groupLabel: { ar: "جماعية", en: "Group" },
    individualLabel: { ar: "فردية", en: "Individual" },
    studentsCap: { ar: "طلاب", en: "students" }
  };

  // Safely normalize raw API plans
  const plans: Plan[] = rawPlans.map((item: any) => ({
    id: item.id,
    name_ar: item.name_ar,
    name_en: item.name_en,
    description: item.description || "",
    price: item.price,
    currency: item.currency,
    currencyId: item.currencyId,
    duration: Number(item.duration) || 30,
    sessionsCount: item.sessionsCount ?? item.sessions_count ?? item.hours ?? 0,
    sessionTime: item.sessionTime ?? item.session_time ?? 60,
    features: item.features || [],
    bestSeller: item.bestSeller ?? item.best_seller ?? false,
    active: item.active ?? true,
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || new Date().toISOString(),
    isHidden: item.isHidden ?? item.is_hidden ?? false,
    isGroup: item.isGroup ?? item.is_group ?? (item.planType === 'group' || item.plan_type === 'group') ?? false,
    maxStudents: item.maxStudents ?? item.max_students ?? 1,
    planType: item.planType ?? item.plan_type ?? ((item.isGroup || item.is_group) ? 'group' : 'individual'),
  }));

  // Stats calculation
  const totalCount = plans.length;
  const individualCount = plans.filter(p => !p.isGroup && p.planType !== 'group').length;
  const groupCount = plans.filter(p => p.isGroup || p.planType === 'group').length;
  const popularCount = plans.filter(p => p.bestSeller).length;

  // Filter plans based on active tab and search query
  const filteredPlans = plans.filter(plan => {
    const isGroup = plan.isGroup || plan.planType === 'group';
    const matchesTab =
      activeTab === "all" ? true :
      activeTab === "individual" ? !isGroup :
      activeTab === "group" ? isGroup :
      activeTab === "popular" ? plan.bestSeller :
      activeTab === "hidden" ? plan.isHidden : true;

    const term = searchQuery.toLowerCase().trim();
    const matchesSearch = !term ||
      (plan.name_ar && plan.name_ar.toLowerCase().includes(term)) ||
      (plan.name_en && plan.name_en.toLowerCase().includes(term)) ||
      (plan.description && plan.description.toLowerCase().includes(term));

    return matchesTab && matchesSearch;
  });

  const handleOpenAdd = () => {
    setSelectedPlan(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleViewPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowViewModal(true);
  };

  const handleSavePlan = async (planData: PlanFormData & { id?: string }) => {
    const isGroup = planData.planType === 'group';
    const payload: any = {
      name_ar: planData.name,
      name_en: planData.nameEn,
      price: planData.price,
      duration: Number(planData.duration),
      sessionsCount: Number(planData.sessionsCount),
      sessionTime: Number(planData.sessionTime),
      active: planData.status === "active",
      bestSeller: planData.isPopular,
      currencyId: planData.currencyId,
      isHidden: planData.isHidden ?? false,
      isGroup: isGroup,
      planType: planData.planType,
      maxStudents: isGroup ? Number(planData.maxStudents ?? 5) : 1,
      description: planData.description || "",
      features: planData.features || [],
    };

    if (planData.id) {
      await updatePlanMutation({ id: planData.id, data: payload });
    } else {
      await addPlanMutation(payload);
    }

    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  const handleDeletePlan = async (id: string) => {
    const confirmed = await confirm({
      title: language === "ar" ? "حذف خطة" : "Delete Plan",
      message: text.confirmDelete[language],
    });
    if (!confirmed) return;

    await deletePlanMutation(id);
  };

  if (isError) {
    return (
      <div className="p-8 text-center text-red-500" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <h2 className="text-xl font-bold mb-2">
          {language === 'ar' ? 'حدث خطأ أثناء تحميل خطط الاشتراك' : 'Failed to load subscription plans'}
        </h2>
        <p className="text-sm text-gray-500">{error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Page Title & Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{text.title[language]}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {language === 'ar' ? 'إنشاء وتعديل وإدارة خطط اشتراكات الطلاب والجلسات' : 'Create, edit, and manage student subscription and session plans'}
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-6 py-3 btn-primary text-white rounded-xl transition-all shadow-md font-semibold hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>{text.addPlan[language]}</span>
        </button>
      </div>

      {/* Top Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500">{text.totalPlans[language]}</p>
            <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <User className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500">{text.individualPlansCount[language]}</p>
            <p className="text-2xl font-bold text-gray-900">{individualCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500">{text.groupPlansCount[language]}</p>
            <p className="text-2xl font-bold text-gray-900">{groupCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500">{text.popularPlansCount[language]}</p>
            <p className="text-2xl font-bold text-gray-900">{popularCount}</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
          {[
            { id: "all", label: text.tabAll[language] },
            { id: "individual", label: text.tabIndividual[language] },
            { id: "group", label: text.tabGroup[language] },
            { id: "popular", label: text.tabPopular[language] },
            { id: "hidden", label: text.tabHidden[language] },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-sm"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={text.searchPlaceholder[language]}
            className={`w-full ${language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-start bg-gray-50/50`}
          />
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-100 rounded w-full"></div>
              <div className="h-24 bg-gray-100 rounded-xl"></div>
              <div className="h-8 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : filteredPlans.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">{text.noPlans[language]}</p>
        </div>
      ) : (
        /* Plans Grid Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => {
            const isGroup = plan.isGroup || plan.planType === 'group';

            return (
              <div
                key={plan.id}
                className={`bg-white rounded-2xl shadow-sm border-2 transition-all hover:shadow-xl overflow-hidden flex flex-col relative ${
                  plan.bestSeller
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {/* Popular Badge Banner */}
                {plan.bestSeller && (
                  <div className="bg-gradient-to-r from-primary to-primary-dark text-white text-center py-2 rounded-t-xl font-bold text-xs shadow-sm uppercase tracking-wider">
                    ★ {text.popular[language]}
                  </div>
                )}

                <div className="p-6 flex flex-col flex-1">
                  {/* Card Top Row: Badges & Title */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1 text-start">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {/* Group / Individual Badge */}
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          isGroup ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-blue-100 text-blue-700 border border-blue-200'
                        }`}>
                          {isGroup ? <Users className="w-3 h-3" /> : <User className="w-3 h-3" />}
                          {isGroup ? `${text.groupLabel[language]} (${plan.maxStudents} ${text.studentsCap[language]})` : text.individualLabel[language]}
                        </span>

                        {/* Hidden Badge */}
                        {plan.isHidden && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                            <EyeOff className="w-3 h-3" />
                            {text.hidden[language]}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-gray-900">
                        {language === "ar" ? plan.name_ar : plan.name_en}
                      </h3>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border flex-shrink-0 ${
                        plan.active
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-gray-100 text-gray-600 border-gray-200"
                      }`}
                    >
                      {plan.active ? text.active[language] : text.inactive[language]}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-xs mb-4 min-h-[36px] line-clamp-2 text-start">
                    {plan.description || (language === 'ar' ? 'بدون وصف مضاف' : 'No description provided')}
                  </p>

                  {/* Price Banner */}
                  <div className="bg-gradient-to-br from-blue-50/70 to-cyan-50/70 border border-blue-100 rounded-xl p-5 mb-5 text-center">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-4xl font-extrabold text-gray-900">
                        {plan.price}
                      </span>
                      <div className="text-start">
                        <div className="text-sm font-semibold text-gray-700">{plan.currency?.code || ''}</div>
                        <div className="text-xs text-gray-500">
                          /{plan.duration} {text.days[language]}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs font-semibold text-gray-700 bg-white/80 py-1 px-3 rounded-full inline-block border border-blue-200">
                      {plan.sessionsCount} {text.sessions[language]} ({plan.sessionTime} {language === 'ar' ? 'دقيقة' : 'min'})
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2.5 mb-6 flex-1">
                    <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider text-start">
                      {text.features[language]}
                    </h4>
                    {plan.features && plan.features.length > 0 ? (
                      plan.features.slice(0, 4).map((feature, index) => (
                        <div key={index} className="flex items-start gap-2 text-start">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-gray-700 flex-1 line-clamp-1">
                            {feature}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400 text-start">{language === 'ar' ? 'لا توجد مميزات مضافة' : 'No features'}</p>
                    )}
                  </div>

                  {/* Card Footer Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-100 mt-auto">
                    <button
                      onClick={() => handleViewPlan(plan)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 btn-primary text-white rounded-xl transition-all text-xs font-medium"
                      title={text.view[language]}
                    >
                      <Eye className="w-4 h-4" />
                      <span>{text.view[language]}</span>
                    </button>
                    <button
                      onClick={() => handleOpenEdit(plan)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-colors border border-green-200"
                      title={text.edit[language]}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePlan(plan.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-red-200"
                      title={text.delete[language]}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <AddPlanModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedPlan(null);
          }}
          onSave={handleSavePlan}
          initialData={
            selectedPlan
              ? {
                  id: selectedPlan.id,
                  name: selectedPlan.name_ar,
                  nameEn: selectedPlan.name_en,
                  description: selectedPlan.description,
                  price: Number(selectedPlan.price),
                  currencyId: selectedPlan.currencyId,
                  duration: selectedPlan.duration,
                  sessionsCount: selectedPlan.sessionsCount,
                  sessionTime: selectedPlan.sessionTime,
                  features: selectedPlan.features,
                  isPopular: selectedPlan.bestSeller,
                  isHidden: selectedPlan.isHidden,
                  planType: selectedPlan.planType || ((selectedPlan.isGroup) ? 'group' : 'individual'),
                  isGroup: selectedPlan.isGroup ?? (selectedPlan.planType === 'group'),
                  maxStudents: selectedPlan.maxStudents ?? 1,
                  status: selectedPlan.active ? "active" : "inactive",
                }
              : null
          }
        />
      )}

      {/* View Details Modal */}
      {selectedPlan && showViewModal && (
        <ViewPlanModal
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedPlan(null);
          }}
          plan={selectedPlan}
        />
      )}

      {ConfirmDialog}
    </div>
  );
}
