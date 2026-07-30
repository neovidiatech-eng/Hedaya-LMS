import { X, Save, Plus, Trash2, Users, User, EyeOff } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { PlanFormData, getPlanSchema } from '../../lib/schemas/PlanSchema';
import { Resolver, useForm, Controller } from 'react-hook-form';
import CustomSelect from '../ui/CustomSelect';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { getCurrencies } from '../../features/admin/services/CurrencyServices';
import { Currency } from '../../types/currency';

interface AddPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: PlanFormData & { id?: string }) => Promise<void>;
  initialData?: (PlanFormData & { id: string }) | null;
}

export default function AddPlanModal({ isOpen, onClose, onSave, initialData }: AddPlanModalProps) {
  const { language, t } = useLanguage();
  const [availableCurrencies, setAvailableCurrencies] = useState<Currency[]>([]);

  const { register, handleSubmit, reset, setValue, watch, control, formState: { errors, isSubmitting } } = useForm<PlanFormData>({
    resolver: zodResolver(getPlanSchema(t)) as Resolver<PlanFormData>,
    defaultValues: {
      name: '',
      nameEn: '',
      description: '',
      price: 0,
      currencyId: '',
      duration: 30, // Default 30 days
      sessionsCount: 8,
      sessionTime: 60,
      features: [''],
      isPopular: false,
      isHidden: false,
      planType: 'individual',
      isGroup: false,
      maxStudents: 1,
      status: 'active',
    },
  });

  const features = watch('features') || [];
  const selectedPlanType = watch('planType');
  const watchedDuration = watch('duration') || 0;

  useEffect(() => {
    if (selectedPlanType === 'group') {
      setValue('isGroup', true);
      const currentMax = watch('maxStudents');
      if (currentMax === undefined || currentMax === null || currentMax === 1) {
        setValue('maxStudents', 5);
      }
    } else {
      setValue('isGroup', false);
      setValue('maxStudents', 1);
    }
  }, [selectedPlanType, setValue, watch]);

  const addFeature = () => {
    setValue('features', [...features, '']);
  };

  const removeFeature = (index: number) => {
    const updated = features.filter((_: string, i: number) => i !== index);
    setValue('features', updated.length > 0 ? updated : ['']);
  };

  const updateFeature = (index: number, value: string) => {
    const updated = [...features];
    updated[index] = value;
    setValue('features', updated);
  };

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const data = await getCurrencies();
        const currs = data.currencies || [];
        setAvailableCurrencies(currs);
      } catch (error) {
        console.error('Failed to fetch currencies:', error);
      }
    };
    fetchCurrencies();
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          ...initialData,
          features: initialData.features && initialData.features.length > 0 ? initialData.features : [''],
          planType: initialData.planType || (initialData.isGroup ? 'group' : 'individual'),
          isGroup: initialData.isGroup ?? (initialData.planType === 'group'),
          maxStudents: initialData.maxStudents ?? 1,
          duration: initialData.duration || 30,
        });
      } else {
        const defaultCurr = availableCurrencies.find(c => c.default)?.id || availableCurrencies[0]?.id || '';
        reset({
          name: '',
          nameEn: '',
          description: '',
          price: 0,
          currencyId: defaultCurr,
          duration: 30,
          sessionsCount: 8,
          sessionTime: 60,
          features: [''],
          isPopular: false,
          isHidden: false,
          planType: 'individual',
          isGroup: false,
          maxStudents: 1,
          status: 'active',
        });
      }
    }
  }, [initialData, reset, isOpen, availableCurrencies]);

  const text = {
    title: { ar: initialData ? 'تعديل خطة اشتراك' : 'إضافة خطة جديدة', en: initialData ? 'Edit Subscription Plan' : 'Add New Subscription Plan' },
    nameAr: { ar: 'اسم الخطة (عربي)', en: 'Plan Name (Arabic)' },
    nameEn: { ar: 'اسم الخطة (إنجليزي)', en: 'Plan Name (English)' },
    description: { ar: 'الوصف', en: 'Description' },
    price: { ar: 'السعر', en: 'Price' },
    currency: { ar: 'العملة', en: 'Currency' },
    duration: { ar: 'المدة (بالأيام)', en: 'Duration (in Days)' },
    durationHint: { 
      ar: watchedDuration ? `(~ ${Math.round(watchedDuration / 30)} شهر)` : '',
      en: watchedDuration ? `(~ ${Math.round(watchedDuration / 30)} month(s))` : ''
    },
    sessionsCount: { ar: 'عدد الحصص', en: 'Sessions Count' },
    sessionTime: { ar: 'مدة الحصة (دقيقة)', en: 'Session Duration (Minutes)' },
    planType: { ar: 'نوع الخطة', en: 'Plan Type' },
    individual: { ar: 'فردية (طالب واحد)', en: 'Individual (Single Student)' },
    group: { ar: 'جماعية (مجموعة طلاب)', en: 'Group (Multiple Students)' },
    maxStudents: { ar: 'الحد الأقصى لعدد الطلاب', en: 'Max Student Capacity' },
    features: { ar: 'المميزات', en: 'Features' },
    addFeature: { ar: 'إضافة ميزة', en: 'Add Feature' },
    isPopular: { ar: 'علامة الأكثر شعبية (Best Seller)', en: 'Most Popular Badge (Best Seller)' },
    isHidden: { ar: 'إخفاء الخطة من الواجهة الرئيسية', en: 'Hide plan from public landing page' },
    status: { ar: 'الحالة', en: 'Status' },
    active: { ar: 'نشط', en: 'Active' },
    inactive: { ar: 'غير نشط', en: 'Inactive' },
    save: { ar: 'حفظ التغييرات', en: 'Save Changes' },
    cancel: { ar: 'إلغاء', en: 'Cancel' },
    featurePlaceholder: { ar: 'اكتب تفاصيل الميزة...', en: 'Enter feature description...' }
  };

  const onSubmit = async (data: PlanFormData) => {
    const filteredFeatures = data.features?.filter(f => typeof f === 'string' && f.trim() !== '') || [];
    
    const payload: any = {
      ...data,
      id: initialData?.id,
      isGroup: data.planType === 'group',
      maxStudents: Number(data.maxStudents),
      features: filteredFeatures,
    };

    await onSave(payload);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 !mt-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto no-scrollbar" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {/* Header */}
        <div className="sticky top-0 bg-primary border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-2xl font-bold text-white">{text.title[language]}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">

          {/* Plan Type Selector */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-3 text-start">
              {text.planType[language]}
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setValue('planType', 'individual')}
                className={`flex items-center justify-center gap-3 p-3.5 rounded-xl border-2 font-semibold text-sm transition-all ${
                  selectedPlanType === 'individual'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <User className="w-5 h-5" />
                <span>{text.individual[language]}</span>
              </button>

              <button
                type="button"
                onClick={() => setValue('planType', 'group')}
                className={`flex items-center justify-center gap-3 p-3.5 rounded-xl border-2 font-semibold text-sm transition-all ${
                  selectedPlanType === 'group'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <Users className="w-5 h-5" />
                <span>{text.group[language]}</span>
              </button>
            </div>
          </div>

          {/* Names */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                {text.nameAr[language]} *
              </label>
              <input {...register('name')} className="w-full px-4 py-2.5 border rounded-lg text-start focus:ring-2 focus:ring-primary focus:outline-none" />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1 text-start">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                {text.nameEn[language]} *
              </label>
              <input {...register('nameEn')} className="w-full px-4 py-2.5 border rounded-lg text-start focus:ring-2 focus:ring-primary focus:outline-none" />
              {errors.nameEn && (
                <p className="text-red-500 text-sm mt-1 text-start">{errors.nameEn.message}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
              {text.description[language]}
            </label>
            <textarea {...register('description')} rows={2} className="w-full px-4 py-2.5 border rounded-lg text-start resize-none focus:ring-2 focus:ring-primary focus:outline-none" />
          </div>

          {/* Price & Currency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                {text.price[language]} *
              </label>
              <input
                type="number"
                step="any"
                {...register('price', { valueAsNumber: true })}
                className="w-full px-4 py-2.5 border rounded-lg text-start focus:ring-2 focus:ring-primary focus:outline-none"
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1 text-start">{errors.price.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                {text.currency[language]} *
              </label>
              <Controller
                name="currencyId"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    {...field}
                    options={availableCurrencies.map((curr) => ({
                      value: curr.id,
                      label: `${curr.code} - ${language === 'ar' ? curr.name_ar : curr.name_en}`
                    }))}
                  />
                )}
              />
              {errors.currencyId && (
                <p className="text-red-500 text-sm mt-1 text-start">{errors.currencyId.message}</p>
              )}
            </div>
          </div>

          {/* Duration, Sessions Count, Session Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                {text.duration[language]} * <span className="text-xs text-gray-500">{text.durationHint[language]}</span>
              </label>
              <input
                type="number"
                {...register('duration', { valueAsNumber: true })}
                className="w-full px-4 py-2.5 border rounded-lg text-start focus:ring-2 focus:ring-primary focus:outline-none"
              />
              {errors.duration && (
                <p className="text-red-500 text-sm mt-1 text-start">{errors.duration.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                {text.sessionsCount[language]} *
              </label>
              <input
                type="number"
                {...register('sessionsCount', { valueAsNumber: true })}
                className="w-full px-4 py-2.5 border rounded-lg text-start focus:ring-2 focus:ring-primary focus:outline-none"
              />
              {errors.sessionsCount && (
                <p className="text-red-500 text-sm mt-1 text-start">{errors.sessionsCount.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                {text.sessionTime[language]} *
              </label>
              <Controller
                name="sessionTime"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    options={[
                      { label: `30 ${language === 'ar' ? 'دقيقة' : 'mins'}`, value: 30 },
                      { label: `45 ${language === 'ar' ? 'دقيقة' : 'mins'}`, value: 45 },
                      { label: `60 ${language === 'ar' ? 'دقيقة' : 'mins'}`, value: 60 },
                      { label: `90 ${language === 'ar' ? 'دقيقة' : 'mins'}`, value: 90 },
                      { label: `120 ${language === 'ar' ? 'دقيقة' : 'mins'}`, value: 120 },
                    ]}
                    className='text-start'
                    {...field}
                  />
                )}
              />
              {errors.sessionTime && (
                <p className="text-red-500 text-sm mt-1 text-start">{errors.sessionTime.message}</p>
              )}
            </div>
          </div>

          {/* Group Capacity (if Group plan) */}
          {selectedPlanType === 'group' && (
            <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4">
              <label className="block text-sm font-medium text-blue-900 mb-2 text-start">
                {text.maxStudents[language]} *
              </label>
              <input
                type="number"
                {...register('maxStudents', { valueAsNumber: true })}
                className="w-full max-w-xs px-4 py-2.5 border border-blue-300 rounded-lg text-start focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              />
              {errors.maxStudents && (
                <p className="text-red-500 text-sm mt-1 text-start">{errors.maxStudents.message}</p>
              )}
            </div>
          )}

          {/* Features Section */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-semibold text-gray-700">{text.features[language]}</label>
              <button
                type="button"
                onClick={addFeature}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                {text.addFeature[language]}
              </button>
            </div>

            <div className="space-y-3">
              {features.map((feature: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    disabled={features.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <input
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    placeholder={text.featurePlaceholder[language]}
                    className="flex-1 px-4 py-2.5 border rounded-lg border-gray-300 text-start focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Status & Options Toggles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
            <div className="space-y-3">
              <label className="flex items-center gap-3 text-sm font-medium text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('isPopular')}
                  className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span>{text.isPopular[language]}</span>
              </label>

              <label className="flex items-center gap-3 text-sm font-medium text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('isHidden')}
                  className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                />
                <span className="flex items-center gap-1.5">
                  <EyeOff className="w-4 h-4 text-gray-500" />
                  {text.isHidden[language]}
                </span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 text-start mb-2">
                {text.status[language]}
              </label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    {...field}
                    options={[
                      { value: 'active', label: text.active[language] },
                      { value: 'inactive', label: text.inactive[language] }
                    ]}
                  />
                )}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              {text.cancel[language]}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              <Save className="w-5 h-5" />
              {text.save[language]}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
