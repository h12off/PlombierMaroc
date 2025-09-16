
import React, { useState, useRef } from 'react';
import { Plumber } from '../types';
import { MOROCCAN_CITIES } from '../constants';
import { UserIcon, LocationMarkerIcon, CameraIcon, CrosshairIcon, MoroccoFlagIcon, HomeIcon, XIcon } from './IconComponents';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';

// FIX: Corrected PlumberFormData type to omit properties not handled by the form.
type PlumberFormData = Omit<Plumber, 'id' | 'ratings' | 'imageUrl' | 'likes' | 'dislikes' | 'comment_count' | 'created_at'> & { imageUrl?: string };

interface PlumberFormProps {
  onSubmit: (plumberData: PlumberFormData, imageFile?: File | null) => Promise<void>;
  initialData?: Readonly<Partial<Plumber>>;
  submitButtonText: string;
  clearOnSubmit?: boolean;
}

const EMPTY_INITIAL_DATA: Readonly<Partial<Plumber>> = {};

const PlumberForm: React.FC<PlumberFormProps> = ({ onSubmit, initialData = EMPTY_INITIAL_DATA, submitButtonText, clearOnSubmit = false }) => {
  const { t } = useLanguage();
  const { addToast } = useToast();
  
  const getInitialPhone = (phoneNum?: string) => {
    const p = phoneNum || '';
    if (p.startsWith('0') && p.length === 10) {
        return p.substring(1);
    }
    return p;
  };

  const getInitialLocation = (lat?: number, lng?: number) => {
    if (lat && lng) {
      return { lat, lng };
    }
    return null;
  };

  const [name, setName] = useState(initialData.name || '');
  const [phone, setPhone] = useState(getInitialPhone(initialData.phone));
  const [city, setCity] = useState(initialData.city || '');
  const [bio, setBio] = useState(initialData.bio || '');
  const [address, setAddress] = useState(initialData.address || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData.imageUrl || null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(getInitialLocation(initialData.latitude, initialData.longitude));
  const [locationStatus, setLocationStatus] = useState<'idle' | 'fetching' | 'success' | 'error'>(getInitialLocation(initialData.latitude, initialData.longitude) ? 'success' : 'idle');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        addToast(t('form.validation.imageType'), 'error');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      if (file.size > maxSizeInBytes) {
        addToast(t('form.validation.imageSize'), 'error');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      return;
    }
    setLocationStatus('fetching');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationStatus('success');
      },
      () => {
        setLocationStatus('error');
      }
    );
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, '');
    if (input.length <= 9) {
        setPhone(input);
    }
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = t('form.validation.nameRequired');
    
    if (!phone.trim()) {
        newErrors.phone = t('form.validation.phoneRequired');
    } else if (!/^[67]\d{8}$/.test(phone.trim())) {
        newErrors.phone = t('form.validation.phoneInvalid');
    }

    if (!city) newErrors.city = t('form.validation.cityRequired');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
        const fullPhoneNumber = `0${phone}`;
        const plumberData: PlumberFormData = {
          name, 
          phone: fullPhoneNumber, 
          city, 
          bio, 
          address,
          latitude: location?.lat,
          longitude: location?.lng,
          is_verified: initialData.is_verified || false,
        };
        if (initialData.id && !imageFile) {
            plumberData.imageUrl = initialData.imageUrl;
        }

        await onSubmit(plumberData, imageFile);

        if (clearOnSubmit) {
          addToast(t('form.successMessage'), 'success');
          setName('');
          setPhone('');
          setCity('');
          setBio('');
          setAddress('');
          handleRemoveImage();
          setLocation(null);
          setLocationStatus('idle');
          setErrors({});
        }
    } catch (err) {
        addToast(t('form.submitError'), 'error');
    } finally {
        setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="relative">
            <UserIcon className="absolute top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 ltr:left-3 rtl:right-3" />
            <input
              type="text"
              placeholder={t('form.namePlaceholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-600 transition ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
          </div>
          {errors.name && <p className="text-red-600 text-sm mt-1 px-1">{errors.name}</p>}
        </div>

        <div>
          <div className={`flex items-center border rounded-lg bg-white focus-within:ring-2 focus-within:ring-red-600 transition ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}>
            <div className="flex-shrink-0 flex items-center pl-3 pr-2 border-r border-gray-300 bg-gray-50 self-stretch rounded-l-lg">
                <MoroccoFlagIcon className="w-6 h-auto" />
                <span className="text-gray-600 font-medium text-sm ml-2 rtl:ml-0 rtl:mr-2">+212</span>
            </div>
            <input
                type="tel"
                placeholder={t('form.phonePlaceholder')}
                value={phone}
                onChange={handlePhoneChange}
                className="w-full pl-3 pr-4 py-3 border-none rounded-r-lg focus:ring-0 bg-transparent text-gray-800"
            />
          </div>
          {errors.phone && <p className="text-red-600 text-sm mt-1 px-1">{errors.phone}</p>}
        </div>

        <div>
          <div className="relative">
            <LocationMarkerIcon className="absolute top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 ltr:left-3 rtl:right-3" />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={`w-full ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-600 transition appearance-none bg-white ${errors.city ? 'border-red-500' : 'border-gray-300'} ${city ? 'text-gray-800' : 'text-gray-500'}`}
            >
              <option value="" disabled>{t('form.selectCityPlaceholder')}</option>
              {MOROCCAN_CITIES.map(c => <option key={c} value={c} className="text-gray-800">{c}</option>)}
            </select>
          </div>
          {errors.city && <p className="text-red-600 text-sm mt-1 px-1">{errors.city}</p>}
        </div>
        
        <div>
          <div className="relative">
            <HomeIcon className="absolute top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 ltr:left-3 rtl:right-3" />
            <input
              type="text"
              placeholder={t('form.addressPlaceholder')}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-600 transition border-gray-300"
            />
          </div>
        </div>

        <div>
          <textarea
            placeholder={t('form.bioPlaceholder')}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 transition"
            rows={3}
          ></textarea>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button type="button" onClick={handleGetLocation} className="w-full flex items-center justify-center gap-2 text-sm font-semibold border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 py-3 px-4 rounded-lg transition shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-60 disabled:cursor-not-allowed" disabled={locationStatus === 'fetching'}>
                <CrosshairIcon className="w-5 h-5" />
                <span>{t('form.getLocationButton')}</span>
            </button>
            <label
                htmlFor="file-upload"
                className="w-full flex items-center justify-center gap-2 text-sm font-semibold border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 py-3 px-4 rounded-lg transition cursor-pointer shadow-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-red-500"
            >
                <CameraIcon className="w-5 h-5" />
                <span>{t('form.photoCta')}</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/jpeg,image/png,image/gif" onChange={handleImageChange} ref={fileInputRef} />
            </label>
        </div>
        
        <div className="flex items-center space-x-4 min-h-[4rem]">
            {imagePreview && (
                <div className="relative">
                    <span className="inline-block h-16 w-16 rounded-full overflow-hidden bg-gray-100 ring-2 ring-offset-2 ring-red-200">
                        <img className="h-full w-full object-cover" src={imagePreview} alt={t('form.imagePreviewAlt')} />
                    </span>
                    <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-0 ltr:right-0 rtl:left-0 transform ltr:translate-x-1/2 rtl:-translate-x-1/2 -translate-y-1/4 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 transition"
                        aria-label={t('form.removeImageLabel')}
                    >
                        <XIcon className="w-3 h-3" />
                    </button>
                </div>
            )}
            {locationStatus === 'success' && <p className="text-sm text-green-600">{t('form.locationSuccess')}</p>}
        </div>
         {locationStatus === 'fetching' && <p className="text-xs text-center text-gray-500">{t('form.locationFetching')}</p>}
         {locationStatus === 'error' && <p className="text-xs text-center text-red-600">{t('form.locationError')}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-red-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 transition-transform transform hover:scale-105 disabled:bg-red-400 disabled:cursor-not-allowed mt-4"
        >
          {isSubmitting ? t('form.submitting') : submitButtonText}
        </button>
      </form>
    </div>
  );
};

export default PlumberForm;