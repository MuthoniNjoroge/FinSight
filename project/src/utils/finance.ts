import { Transaction, Budget, SavingsGoal, FinancialSummary } from '../types/finance';

export const currencies = [
  // Major World Currencies
  { code: 'USD', symbol: '$', name: 'US Dollar', country: 'United States' },
  { code: 'EUR', symbol: '€', name: 'Euro', country: 'European Union' },
  { code: 'GBP', symbol: '£', name: 'British Pound', country: 'United Kingdom' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', country: 'Japan' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', country: 'China' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', country: 'Canada' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', country: 'Australia' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', country: 'Switzerland' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', country: 'India' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won', country: 'South Korea' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', country: 'Brazil' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso', country: 'Mexico' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble', country: 'Russia' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', country: 'Singapore' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', country: 'Hong Kong' },
  
  // African Currencies
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', country: 'South Africa' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', country: 'Nigeria' },
  { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound', country: 'Egypt' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', country: 'Kenya' },
  { code: 'GHS', symbol: '₵', name: 'Ghanaian Cedi', country: 'Ghana' },
  { code: 'MAD', symbol: 'DH', name: 'Moroccan Dirham', country: 'Morocco' },
  { code: 'TND', symbol: 'DT', name: 'Tunisian Dinar', country: 'Tunisia' },
  { code: 'UGX', symbol: 'USh', name: 'Ugandan Shilling', country: 'Uganda' },
  { code: 'ETB', symbol: 'Br', name: 'Ethiopian Birr', country: 'Ethiopia' },
  { code: 'XOF', symbol: 'CFA', name: 'West African CFA Franc', country: 'West Africa' },
  
  // Middle Eastern Currencies
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', country: 'United Arab Emirates' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', country: 'Saudi Arabia' },
  { code: 'QAR', symbol: '﷼', name: 'Qatari Riyal', country: 'Qatar' },
  { code: 'KWD', symbol: 'د.ك', name: 'Kuwaiti Dinar', country: 'Kuwait' },
  { code: 'BHD', symbol: '.د.ب', name: 'Bahraini Dinar', country: 'Bahrain' },
  { code: 'OMR', symbol: '﷼', name: 'Omani Rial', country: 'Oman' },
  { code: 'JOD', symbol: 'د.ا', name: 'Jordanian Dinar', country: 'Jordan' },
  { code: 'LBP', symbol: '£', name: 'Lebanese Pound', country: 'Lebanon' },
  { code: 'ILS', symbol: '₪', name: 'Israeli Shekel', country: 'Israel' },
  { code: 'IRR', symbol: '﷼', name: 'Iranian Rial', country: 'Iran' },
  
  // Asian Currencies
  { code: 'THB', symbol: '฿', name: 'Thai Baht', country: 'Thailand' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', country: 'Malaysia' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', country: 'Indonesia' },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso', country: 'Philippines' },
  { code: 'VND', symbol: '₫', name: 'Vietnamese Dong', country: 'Vietnam' },
  { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee', country: 'Pakistan' },
  { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka', country: 'Bangladesh' },
  { code: 'LKR', symbol: '₨', name: 'Sri Lankan Rupee', country: 'Sri Lanka' },
  { code: 'NPR', symbol: '₨', name: 'Nepalese Rupee', country: 'Nepal' },
  { code: 'MMK', symbol: 'K', name: 'Myanmar Kyat', country: 'Myanmar' },
  { code: 'KHR', symbol: '៛', name: 'Cambodian Riel', country: 'Cambodia' },
  { code: 'LAK', symbol: '₭', name: 'Lao Kip', country: 'Laos' },
  
  // European Currencies
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', country: 'Norway' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', country: 'Sweden' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone', country: 'Denmark' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Zloty', country: 'Poland' },
  { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna', country: 'Czech Republic' },
  { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint', country: 'Hungary' },
  { code: 'RON', symbol: 'lei', name: 'Romanian Leu', country: 'Romania' },
  { code: 'BGN', symbol: 'лв', name: 'Bulgarian Lev', country: 'Bulgaria' },
  { code: 'HRK', symbol: 'kn', name: 'Croatian Kuna', country: 'Croatia' },
  { code: 'ISK', symbol: 'kr', name: 'Icelandic Krona', country: 'Iceland' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira', country: 'Turkey' },
  { code: 'UAH', symbol: '₴', name: 'Ukrainian Hryvnia', country: 'Ukraine' },
  
  // Latin American Currencies
  { code: 'ARS', symbol: '$', name: 'Argentine Peso', country: 'Argentina' },
  { code: 'CLP', symbol: '$', name: 'Chilean Peso', country: 'Chile' },
  { code: 'COP', symbol: '$', name: 'Colombian Peso', country: 'Colombia' },
  { code: 'PEN', symbol: 'S/', name: 'Peruvian Sol', country: 'Peru' },
  { code: 'UYU', symbol: '$U', name: 'Uruguayan Peso', country: 'Uruguay' },
  { code: 'VES', symbol: 'Bs.S', name: 'Venezuelan Bolívar', country: 'Venezuela' },
  { code: 'BOB', symbol: 'Bs', name: 'Bolivian Boliviano', country: 'Bolivia' },
  { code: 'PYG', symbol: '₲', name: 'Paraguayan Guarani', country: 'Paraguay' },
  { code: 'GTQ', symbol: 'Q', name: 'Guatemalan Quetzal', country: 'Guatemala' },
  { code: 'CRC', symbol: '₡', name: 'Costa Rican Colón', country: 'Costa Rica' },
  { code: 'DOP', symbol: 'RD$', name: 'Dominican Peso', country: 'Dominican Republic' },
  
  // Other Major Currencies
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', country: 'New Zealand' },
  { code: 'TWD', symbol: 'NT$', name: 'Taiwan Dollar', country: 'Taiwan' },
  { code: 'AFN', symbol: '؋', name: 'Afghan Afghani', country: 'Afghanistan' },
  { code: 'ALL', symbol: 'L', name: 'Albanian Lek', country: 'Albania' },
  { code: 'AMD', symbol: '֏', name: 'Armenian Dram', country: 'Armenia' },
  { code: 'AZN', symbol: '₼', name: 'Azerbaijani Manat', country: 'Azerbaijan' },
  { code: 'GEL', symbol: '₾', name: 'Georgian Lari', country: 'Georgia' },
  { code: 'KZT', symbol: '₸', name: 'Kazakhstani Tenge', country: 'Kazakhstan' },
  { code: 'UZS', symbol: 'soʻm', name: 'Uzbekistani Som', country: 'Uzbekistan' },
  { code: 'MNT', symbol: '₮', name: 'Mongolian Tugrik', country: 'Mongolia' },
  { code: 'FJD', symbol: 'FJ$', name: 'Fijian Dollar', country: 'Fiji' }
];

export const incomeCategories = [
  'Salary',
  'Freelance',
  'Business',
  'Investments',
  'Rental',
  'Other'
];

export const expenseCategories = [
  'Food & Dining',
  'Transportation',
  'Housing',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Education',
  'Other'
];

export const formatCurrency = (amount: number, currencyCode: string = 'USD'): string => {
  // Handle NaN, null, undefined, or invalid numbers
  const safeAmount = Number(amount) || 0;
  
  const currency = currencies.find(c => c.code === currencyCode);
  if (!currency) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(safeAmount);
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode
  }).format(safeAmount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const calculateFinancialSummary = (transactions: Transaction[]): FinancialSummary => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  
  const monthlyIncome = transactions
    .filter(t => {
      const date = new Date(t.date);
      return t.type === 'income' && 
             date.getMonth() === currentMonth && 
             date.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  
  const monthlyExpenses = transactions
    .filter(t => {
      const date = new Date(t.date);
      return t.type === 'expense' && 
             date.getMonth() === currentMonth && 
             date.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  
  return {
    totalIncome,
    totalExpenses,
    totalSavings: totalIncome - totalExpenses,
    monthlyIncome,
    monthlyExpenses
  };
};

export const getBudgetStatus = (budget: Budget): 'good' | 'warning' | 'danger' => {
  const allocated = Number(budget.allocated) || 0;
  const spent = Number(budget.spent) || 0;
  const percentage = allocated > 0 ? spent / allocated : 0;
  if (percentage < 0.7) return 'good';
  if (percentage < 0.9) return 'warning';
  return 'danger';
};