import { X, Save, Plus, Trash2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { PlanFormData, getPlanSchema } from '../../lib/schemas/PlanSchema';
import { Resolver, useForm, Controller } from 'react-hook-form';
import CustomSelect from '../ui/CustomSelect';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { getCurrencies } from '../../features/admin/services/CurrencyServices';
import { Currency } from '../../types/currency';


interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

function ToggleSwitch({ checked, onChange, label }: ToggleSwitchProps) {
  const { language } = useLanguage();
  return (
    <div 
      className="flex items-center justify-between p-3.5 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer select-none"
      onClick={() => onChange(!checked)}
    >
      <span className="text-sm font-semibold text-gray-700">{label}</span>
      <div
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
          checked ? 'bg-primary' : 'bg-gray-300'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked 
              ? (language === 'ar' ? '-translate-x-5' : 'translate-x-5') 
              : 'translate-x-0'
          }`}
        />
      </div>
    </div>
  );
}

interface StatusPickerProps {
  value: 'active' | 'inactive';
  onChange: (value: 'active' | 'inactive') => void;
  label: string;
  activeLabel: string;
  inactiveLabel: string;
}

function StatusPicker({ value, onChange, label, activeLabel, inactiveLabel }: StatusPickerProps) {
  return (
    <div className="flex flex-col gap-1.5 justify-center h-full">
      <label className="block text-sm font-medium text-gray-700 text-start">
        {label}
      </label>
      <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-xl border border-gray-200">
        <button
          type="button"
          onClick={() => onChange('active')}
          className={`py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
            value === 'active'
              ? 'bg-white text-green-700 shadow-sm font-bold'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {activeLabel}
        </button>
        <button
          type="button"
          onClick={() => onChange('inactive')}
          className={`py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
            value === 'inactive'
              ? 'bg-white text-red-600 shadow-sm font-bold'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {inactiveLabel}
        </button>
      </div>
    </div>
  );
}

interface AddPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: PlanFormData & { id?: string }) => void;
  initialData?: (PlanFormData & { id: string }) | null;
}

export default function AddPlanModal({ isOpen, onClose, onSave, initialData }: AddPlanModalProps) {
  const { language, t } = useLanguage();

  const { register, handleSubmit, reset, setValue, watch, control, formState: { errors } } = useForm<PlanFormData>({
    resolver: zodResolver(getPlanSchema(t)) as Resolver<PlanFormData>,
    defaultValues: {
      name: '',
      nameEn: '',
      description: '',
      price: 0,
      currencyId: '',
      duration: 1,
      sessionsCount: 0,
      sessionTime: 60,
      features: [''],
      isPopular: false,
      status: 'active',
      isHidden: false,
    },

  });

  const handleClose = () => {
    if (Object.keys(errors).length === 0) {
      onClose();
    }
  };
  const features = watch('features');
  const addFeature = () => {
    setValue('features', [...features, '']);
  };

  const removeFeature = (index: number) => {
    const updated = features.filter((_, i) => i !== index);
    setValue('features', updated);
  };

  const [availableCurrencies, setAvailableCurrencies] = useState<Currency[]>([]);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const data = await getCurrencies();
        setAvailableCurrencies(data.currencies);
      } catch (error) {
        console.error('Failed to fetch currencies:', error);
      }
    };
    fetchCurrencies();
  }, []);

  const updateFeature = (index: number, value: string) => {
    const updated = [...features];
    updated[index] = value;
    setValue('features', updated);
  };


  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset(initialData);
      } else {
        reset({
          name: '',
          nameEn: '',
          description: '',
          price: 0,
          currencyId: availableCurrencies.find(c => c.default)?.id || '',
          duration: 1,
          sessionsCount: 0,
          sessionTime: 60,
          features: [''],
          isPopular: false,
          status: 'active',
          isHidden: false,
        });

      }
    }
  }, [initialData, reset, isOpen, availableCurrencies]);



  const text = {
    title: { ar: initialData ? 'تعديل خطة' : 'إضافة خطة جديدة', en: initialData ? 'Edit Plan' : 'Add New Plan' },
    nameAr: { ar: 'اسم الخطة (عربي)', en: 'Plan Name (Arabic)' },
    nameEn: { ar: 'اسم الخطة (إنجليزي)', en: 'Plan Name (English)' },
    description: { ar: 'الوصف', en: 'Description' },
    price: { ar: 'السعر', en: 'Price' },
    currency: { ar: 'العملة', en: 'Currency' },
    duration: { ar: 'المدة (شهر)', en: 'Duration (Months)' },
    sessionsCount: { ar: 'عدد الحصص', en: 'Sessions Count' },
    sessionTime: { ar: 'مدة الحصة (دقيقة)', en: 'Session Time (Minutes)' },
    features: { ar: 'المميزات', en: 'Features' },
    isHidden: { ar: 'إخفاء الخطة', en: 'Hide Plan' },
    addFeature: { ar: 'إضافة ميزة', en: 'Add Feature' },
    isPopular: { ar: 'الأكثر شعبية', en: 'Most Popular' },
    status: { ar: 'الحالة', en: 'Status' },
    active: { ar: 'نشط', en: 'Active' },
    inactive: { ar: 'غير نشط', en: 'Inactive' },
    save: { ar: 'حفظ التغييرات', en: 'Save Changes' },
    cancel: { ar: 'إلغاء', en: 'Cancel' },
    featurePlaceholder: { ar: 'اكتب الميزة...', en: 'Enter feature...' }
  };

  const onSubmit = async (data: PlanFormData) => {
    try {
      await onSave({
        ...data,
        id: initialData?.id
      });
      onClose();
      if (!initialData) {
        reset();
      }
    } catch (e) {
      console.error(e);
      // keep modal open
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  !mt-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh]  overflow-y-auto no-scrollbar" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="sticky top-0 bg-primary border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white">{text.title[language]}</h2>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">

          {/* Names */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                {text.nameAr[language]}
              </label>
              <input {...register('name')} className="w-full px-4 py-2.5 border rounded-lg text-start" />
              {errors.name && (<p className="text-red-500 text-sm mt-1 text-start"> {errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                {text.nameEn[language]}
              </label>
              <input {...register('nameEn')} className="w-full px-4 py-2.5 border rounded-lg" />

              {errors.nameEn && (
                <p className="text-red-500 text-sm mt-1 text-start">
                  {errors.nameEn.message}
                </p>
              )}
            </div>
          </div>
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
              {text.description[language]}
            </label>
            <textarea {...register('description')} rows={3} className="w-full px-4 py-2.5 border rounded-lg text-start resize-none" />
            {errors.description && (<p className="text-red-500 text-sm mt-1 text-start"> {errors.description.message}</p>
            )}
          </div>

          {/* Price + Currency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                {text.price[language]}
              </label>
              <input
                type="number"
                {...register('price', { valueAsNumber: true })}
                className="w-full px-4 py-2.5 border rounded-lg text-start"
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1 text-start">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                {text.currency[language]}
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
                <p className="text-red-500 text-sm mt-1 text-start">
                  {errors.currencyId.message}
                </p>
              )}
            </div>


          </div>
          {/* Duration + Sessions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                {text.duration[language]}
              </label>
              <input
                type="number"
                {...register('duration', { valueAsNumber: true })}
                className="w-full px-4 py-2.5 border rounded-lg text-start"
              />
              {errors.duration && (
                <p className="text-red-500 text-sm mt-1 text-start">
                  {errors.duration.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                {text.sessionsCount[language]}
              </label>
              <input
                type="number"
                {...register('sessionsCount', { valueAsNumber: true })}
                className="w-full px-4 py-2.5 border rounded-lg text-start"
              />
              {errors.sessionsCount && (
                <p className="text-red-500 text-sm mt-1 text-start">
                  {errors.sessionsCount.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                {text.sessionTime[language]}
              </label>
<Controller
  name="sessionTime"
  control={control}
  render={({ field }) => (
    <CustomSelect
      options={[
        { label: t('30minutes'), value: 30 },
        { label: t('45minutes'), value: 45 },
        { label: t('60minutes'), value: 60 },
        { label: t('90minutes'), value: 90 },
        { label: t('120minutes'), value: 120 },
      ]}  
      className='text-start'
      {...field}
    />
  )}
/>
              {errors.sessionTime && (
                <p className="text-red-500 text-sm mt-1 text-start">
                  {errors.sessionTime.message}
                </p>
              )}
              
            </div>
            <div>
           

            <Controller
              name="status"
              control={control}
              render={({ field: { value, onChange } }) => (
                <StatusPicker
                  value={value}
                  onChange={onChange}
                  label={text.status[language]}
                  activeLabel={text.active[language]}
                  inactiveLabel={text.inactive[language]}
                />
              )}
            />
             
              
            </div>

          </div>

          {/* Features */}
          <div>

            <div className="flex justify-between mb-3">
              <button type="button" onClick={addFeature}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                {text.addFeature[language]}
              </button>
              <label className="text-sm font-medium">{text.features[language]}</label>
            </div>

            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">

                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    disabled={features.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex-1 flex flex-col gap-1">
                    <input
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder={text.featurePlaceholder[language]}
                      className={`px-4 py-2.5 border rounded-lg ${errors.features?.[index] ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.features?.[index] && <span className="text-red-500 text-xs text-start">هذا الحقل مطلوب</span>}
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Boolean + Status */}
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-2 gap-3">
              <Controller
                name="isPopular"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <ToggleSwitch
                    checked={value}
                    onChange={onChange}
                    label={text.isPopular[language]}
                  />
                )}
              />

              <Controller
                name="isHidden"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <ToggleSwitch
                    checked={value}
                    onChange={onChange}
                    label={text.isHidden[language]}
                  />
                )}
              />
            </div>

          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <button type="button" onClick={handleClose} className="px-6 py-2.5 bg-gray-200 rounded-lg">
              {text.cancel[language]}
            </button>

            <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg">
              <Save className="w-5 h-5" />
              {text.save[language]}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
