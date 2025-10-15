export interface NavItem {
  label: string;
  href: string;
  icon?: string; // lucide icon name reference (optional)
}

export interface NavCategory {
  key: string;
  label: string;
  items: NavItem[];
}

// Central source of truth used by both header & sidebar
export const NAV_CATEGORIES: NavCategory[] = [
  {
    key: 'finance',
    label: 'Finance Calculators',
    items: [
      { label: 'SIP Mutual Fund', href: '/sip-calculator', icon: 'DollarSign' },
      { label: 'EMI Loan', href: '/emi-calculator', icon: 'Calculator' },
      { label: 'CAGR', href: '/cagr-calculator', icon: 'Percent' },
    ]
  },
  {
    key: 'fitness',
    label: 'Fitness Calculators',
    items: [
      { label: 'BMI', href: '/bmi-calculator', icon: 'Heart' },
      { label: 'BMR', href: '/bmr-calculator', icon: 'Activity' },
    ]
  },
  {
    key: 'math',
    label: 'Math Calculators',
    items: [
      { label: 'Age', href: '/age-calculator', icon: 'Calendar' },
      { label: 'Unit Converter', href: '/unit-converter', icon: 'Ruler' },
    ]
  },
  {
    key: 'other',
    label: 'Other Calculators',
    items: [
      { label: 'Currency Converter', href: '/currency-converter', icon: 'Globe' },
    ]
  }
];
