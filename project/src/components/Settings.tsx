import React, { useState } from 'react';
import { Settings as SettingsIcon, DollarSign, Globe } from 'lucide-react';
import { AppSettings } from '../types/finance';
import { formatCurrency } from '../utils/finance';
import CurrencySelector from './CurrencySelector';

interface SettingsProps {
  settings: AppSettings;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdateSettings }) => {
  console.log('🔧 Settings component rendering with settings:', settings);
  
  const [formData, setFormData] = useState({
    currency: settings.currency,
    monthlyIncome: settings.monthlyIncome.toString()
  });

  // Debug logging when settings change
  React.useEffect(() => {
    console.log('🔧 Settings component: settings prop changed:', settings);
    console.log('🔧 Settings component: formData state:', formData);
  }, [settings, formData]);

  // Debug logging when form data changes
  React.useEffect(() => {
    console.log('🔧 Settings component: formData state changed:', formData);
  }, [formData]);

  // Update form data when settings change
  React.useEffect(() => {
    console.log('🔧 Settings component: Updating form data to match settings');
    const newFormData = {
      currency: settings.currency,
      monthlyIncome: settings.monthlyIncome.toString()
    };
    console.log('🔧 Settings component: New form data:', newFormData);
    setFormData(newFormData);
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('🔐 handleSubmit function called');
    e.preventDefault();
    console.log('🔐 Settings form submitted:', formData);
    console.log('🔐 Form data being sent:', {
      currency: formData.currency,
      monthlyIncome: parseFloat(formData.monthlyIncome) || 0
    });
    console.log('🔐 onUpdateSettings function:', onUpdateSettings);
    console.log('🔐 onUpdateSettings type:', typeof onUpdateSettings);
    
    try {
      // Call the parent's update function
      console.log('🔐 Calling onUpdateSettings...');
      const result = await onUpdateSettings({
        currency: formData.currency,
        monthlyIncome: parseFloat(formData.monthlyIncome) || 0
      });
      
      console.log('✅ Settings updated successfully, result:', result);
    } catch (error) {
      console.error('❌ Failed to update settings:', error);
    }
  };

  const handleCurrencyChange = (currencyCode: string) => {
    setFormData(prev => ({ ...prev, currency: currencyCode }));
    // Update immediately for currency changes
    onUpdateSettings({ currency: currencyCode });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <SettingsIcon className="w-8 h-8 text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <p className="text-sm text-gray-600">Manage your currency and income preferences</p>
        </div>
      </div>

      {/* Quick Currency Selector */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Globe className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Quick Currency Change</h3>
              <p className="text-sm text-gray-600">Select your preferred currency for all transactions</p>
            </div>
          </div>
        </div>
        <CurrencySelector
          value={formData.currency}
          onChange={handleCurrencyChange}
        />
        <p className="mt-2 text-sm text-blue-700">
          Preview: {formatCurrency(1000, formData.currency)}
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <form 
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div>
            <label className="flex items-center text-lg font-semibold text-gray-900 mb-4">
              <Globe className="w-5 h-5 mr-2 text-blue-600" />
              Currency Settings
            </label>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Currency
                </label>
                <CurrencySelector
                  value={formData.currency}
                  onChange={(currencyCode) => {
                    console.log('🔧 CurrencySelector changed from', formData.currency, 'to', currencyCode);
                    console.log('🔧 Previous form data:', formData);
                    const updatedFormData = { ...formData, currency: currencyCode };
                    console.log('🔧 Updated form data:', updatedFormData);
                    setFormData(updatedFormData);
                  }}
                />
                <p className="mt-2 text-sm text-gray-600">
                  Preview: {formatCurrency(1000, formData.currency)}
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="flex items-center text-lg font-semibold text-gray-900 mb-4">
              <DollarSign className="w-5 h-5 mr-2 text-green-600" />
              Income Settings
            </label>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Income Target
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.monthlyIncome}
                  name="monthlyIncome"
                  onChange={(e) => {
                    const newValue = e.target.value;
                    console.log('🔧 Input changed: monthlyIncome from', formData.monthlyIncome, 'to', newValue);
                    console.log('🔧 Previous form data:', formData);
                    const updatedFormData = { ...formData, monthlyIncome: newValue };
                    console.log('🔧 Updated form data:', updatedFormData);
                    setFormData(updatedFormData);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
                <p className="mt-2 text-sm text-gray-600">
                  Set your target monthly income to track your financial goals
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="w-full py-3 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              💾 Save Settings
            </button>
          </div>
        </form>
      </div>

      <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Current Settings</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-blue-700">Currency:</span>
            <span className="font-medium text-blue-900">{settings.currency}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Monthly Income Target:</span>
            <span className="font-medium text-blue-900">
              {formatCurrency(settings.monthlyIncome, settings.currency)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;