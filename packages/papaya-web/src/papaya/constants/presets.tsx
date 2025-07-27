import { CreateCategory } from "@/schema/documents/Category";
import { Avatar } from "@/schema/models/Avatar";
import { Apartment, CarRental, Home, Pets } from "@mui/icons-material";
import { ReactNode } from "react";

const SHARED_AVATARS: Record<string, Avatar> = {
  'CAR': {
    kind: 'papaya:avatar',
    content: 'directions_car',
    variant: 'PICTORIAL',
    primaryColor: '#e53e3e',
  },
  'FOOD': {
    kind: 'papaya:avatar',
    content: 'restaurant',
    variant: 'PICTORIAL',
    primaryColor: '#fd9644',
  },
  'GROCERIES': {
    kind: 'papaya:avatar',
    content: 'local_grocery_store',
    variant: 'PICTORIAL',
    primaryColor: '#a5d6a7',
  },
  'TRANSPORTATION': {
    kind: 'papaya:avatar',
    content: 'directions_bus',
    variant: 'PICTORIAL',
    primaryColor: '#4299e1',
  },
  'HOUSING': {
    kind: 'papaya:avatar',
    content: 'home',
    variant: 'PICTORIAL',
    primaryColor: '#a5d6a7',
  },
  'BILLS': {
    kind: 'papaya:avatar',
    content: 'receipt',
    variant: 'PICTORIAL',
    primaryColor: '#f6ad55',
  },
  'ENTERTAINMENT': {
    kind: 'papaya:avatar',
    content: 'movie',
    variant: 'PICTORIAL',
    primaryColor: '#9f7aea',
  },
  'HEALTHCARE': {
    kind: 'papaya:avatar',
    content: 'local_hospital',
    variant: 'PICTORIAL',
    primaryColor: '#fc8181',
  },
  'SHOPPING': {
    kind: 'papaya:avatar',
    content: 'shopping_cart',
    variant: 'PICTORIAL',
    primaryColor: '#667eea',
  },
  'PERSONAL_CARE': {
    kind: 'papaya:avatar',
    content: 'face',
    variant: 'PICTORIAL',
    primaryColor: '#f093fb',
  },
  'PETS': {
    kind: 'papaya:avatar',
    content: 'pets',
    variant: 'PICTORIAL',
    primaryColor: '#d69e2e',
  },
  'RENT': {
    kind: 'papaya:avatar',
    content: 'apartment',
    variant: 'PICTORIAL',
    primaryColor: '#805ad5',
  },
  'MORTGAGE': {
    kind: 'papaya:avatar',
    content: 'home',
    variant: 'PICTORIAL',
    primaryColor: '#805ad5',
  },
  'HOME_INSURANCE': {
    kind: 'papaya:avatar',
    content: 'security',
    variant: 'PICTORIAL',
    primaryColor: '#3182ce',
  },
  'TAKEOUT': {
    kind: 'papaya:avatar',
    content: 'takeout_dining',
    variant: 'PICTORIAL',
    primaryColor: '#ff8a50',
  },
  'INTERNET': {
    kind: 'papaya:avatar',
    content: 'wifi',
    variant: 'PICTORIAL',
    primaryColor: '#63b3ed',
  },
  'UTILITIES': {
    kind: 'papaya:avatar',
    content: 'electrical_services',
    variant: 'PICTORIAL',
    primaryColor: '#fbd38d',
  },
  'TUITION': {
    kind: 'papaya:avatar',
    content: 'school',
    variant: 'PICTORIAL',
    primaryColor: '#4fd1c7',
  },
  'TEXTBOOKS': {
    kind: 'papaya:avatar',
    content: 'menu_book',
    variant: 'PICTORIAL',
    primaryColor: '#81e6d9',
  },
  'CHILDCARE': {
    kind: 'papaya:avatar',
    content: 'child_care',
    variant: 'PICTORIAL',
    primaryColor: '#feb2b2',
  },
  'SCHOOL_SUPPLIES': {
    kind: 'papaya:avatar',
    content: 'backpack',
    variant: 'PICTORIAL',
    primaryColor: '#90cdf4',
  }
} as const

/**
 * Groups which users can opt into when presetting categories. These are used to
 * opt in or out of certain categories. For example, not all users have pets or
 * a mortgage.
 */
export enum CategoryPresetGroup {
  PET = 'PET',
  RENT = 'RENT',
  HOME_OWNER = 'HOME_OWNER',
  CAR = 'CAR',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT',
}

interface CategoryPresetGroupDetails {
  label: string
  description: string
  icon: ReactNode
}

export const CATEGORY_PRESET_GROUPS: Record<CategoryPresetGroup, CategoryPresetGroupDetails> = {
  [CategoryPresetGroup.PET]: {
    label: 'Pet Expenses',
    description: 'Categories for pet-related costs',
    icon: <Pets />,
  },
  [CategoryPresetGroup.RENT]: {
    label: 'Rental Housing',
    description: 'Categories for renters',
    icon: <Apartment />,
  },
  [CategoryPresetGroup.HOME_OWNER]: {
    label: 'Home Ownership',
    description: 'Categories for homeowners',
    icon: <Home />,
  },
  [CategoryPresetGroup.CAR]: {
    label: 'Automotive',
    description: 'Categories for car-related expenses',
    icon: <CarRental />,
  },
  [CategoryPresetGroup.STUDENT]: {
    label: 'Education',
    description: 'Categories for students and education',
    icon: <Home />,
  },
  [CategoryPresetGroup.PARENT]: {
    label: 'Parenting',
    description: 'Categories for parents and children',
    icon: <Home />,
  }
}

/**
 * Minimal set of categories, which covers the most common expenses into buckets.
 */
export const PRESET_CATEGORIES_SIMPLE: Array<{ group: CategoryPresetGroup | null, categories: CreateCategory[] }> = [
  {
    group: CategoryPresetGroup.PET,
    categories: [
      {
        label: 'Pets',
        description: 'Expenses for your pets',
        avatar: SHARED_AVATARS['PETS'],
      }
    ]
  },
  {
    group: CategoryPresetGroup.RENT,
    categories: [
      {
        label: 'Rent',
        description: 'Expenses for your rent',
        avatar: SHARED_AVATARS['RENT'],
      }
    ]
  },
  {
    group: CategoryPresetGroup.HOME_OWNER,
    categories: [
      {
        label: 'Mortgage',
        description: 'Expenses for your mortgage',
        avatar: SHARED_AVATARS['MORTGAGE'],
      }
    ]
  },
  {
    group: CategoryPresetGroup.STUDENT,
    categories: [
      {
        label: 'Education',
        description: 'School and education expenses',
        avatar: SHARED_AVATARS['TUITION'],
      }
    ]
  },
  {
    group: CategoryPresetGroup.PARENT,
    categories: [
      {
        label: 'Parenting',
        description: 'Expenses for your children',
        avatar: SHARED_AVATARS['CHILDCARE'],
      }
    ]
  },
  {
    // Catch-all group. These can't be opted in/out as a group.
    group: null,
    categories: [
      {
        label: 'Food',
        description: 'Food and other grocery expenses',
        avatar: SHARED_AVATARS['FOOD'],
      },
      {
        label: 'Transportation',
        description: 'Automotive or public transportation',
        avatar: SHARED_AVATARS['TRANSPORTATION'],
      },
      {
        label: 'Housing',
        description: 'Housing-related expenses',
        avatar: SHARED_AVATARS['HOUSING'],
      },
      {
        label: 'Bills',
        description: 'Utilities and recurring bills',
        avatar: SHARED_AVATARS['BILLS'],
      },
      {
        label: 'Entertainment',
        description: 'Movies, games, and leisure activities',
        avatar: SHARED_AVATARS['ENTERTAINMENT'],
      },
      {
        label: 'Healthcare',
        description: 'Medical and health-related expenses',
        avatar: SHARED_AVATARS['HEALTHCARE'],
      },
      {
        label: 'Shopping',
        description: 'General shopping and purchases',
        avatar: SHARED_AVATARS['SHOPPING'],
      },
      {
        label: 'Personal Care',
        description: 'Beauty, grooming, and personal items',
        avatar: SHARED_AVATARS['PERSONAL_CARE'],
      },
    ]
  },
]

/**
 * Typical set of categories, which breaks down common expenses into more specific categories.
 */
export const PRESET_CATEGORIES_TYPICAL: Array<{ group: CategoryPresetGroup | null, categories: CreateCategory[] }> = [
  {
    group: CategoryPresetGroup.PET,
    categories: [
      {
        label: 'Pets',
        description: 'Expenses for your pets',
        avatar: SHARED_AVATARS['PETS'],
      }
    ]
  },
  {
    group: CategoryPresetGroup.RENT,
    categories: [
      {
        label: 'Rent',
        description: 'Expenses for your rent',
        avatar: SHARED_AVATARS['RENT'],
      }
    ]
  },
  {
    group: CategoryPresetGroup.HOME_OWNER,
    categories: [
      {
        label: 'Mortgage',
        description: 'Expenses for your mortgage',
        avatar: SHARED_AVATARS['MORTGAGE'],
      }
    ]
  },
  {
    group: CategoryPresetGroup.CAR,
    categories: [
      {
        label: 'Automotive',
        description: 'Expenses for your car',
        avatar: SHARED_AVATARS['CAR'],
      }
    ]
  },
  {
    group: CategoryPresetGroup.STUDENT,
    categories: [
      {
        label: 'Tuition & Fees',
        description: 'School tuition and fees',
        avatar: SHARED_AVATARS['TUITION'],
      },
      {
        label: 'Textbooks & Supplies',
        description: 'Educational materials and supplies',
        avatar: SHARED_AVATARS['TEXTBOOKS'],
      }
    ]
  },
  {
    group: CategoryPresetGroup.PARENT,
    categories: [
      {
        label: 'Childcare',
        description: 'Daycare and babysitting expenses',
        avatar: SHARED_AVATARS['CHILDCARE'],
      },
      {
        label: 'Schooling Expenses',
        description: 'School supplies and activities for children',
        avatar: SHARED_AVATARS['SCHOOL_SUPPLIES'],
      }
    ]
  },
  {
    group: null,
    categories: [
      {
        label: 'Groceries',
        description: 'Food and other grocery expenses',
        avatar: SHARED_AVATARS['GROCERIES'],
      },
      {
        label: 'Takeout & Dining',
        description: 'Restaurant meals and food delivery',
        avatar: SHARED_AVATARS['TAKEOUT'],
      },
      {
        label: 'Public Transportation',
        description: 'Bus, train, and other public transit',
        avatar: SHARED_AVATARS['TRANSPORTATION'],
      },
      {
        label: 'Internet',
        description: 'Internet and mobile phone bills',
        avatar: SHARED_AVATARS['INTERNET'],
      },
      {
        label: 'Utilities',
        description: 'Electricity, gas, water, and other utilities',
        avatar: SHARED_AVATARS['UTILITIES'],
      },
      {
        label: 'Entertainment',
        description: 'Movies, games, streaming, and leisure activities',
        avatar: SHARED_AVATARS['ENTERTAINMENT'],
      },
      {
        label: 'Healthcare',
        description: 'Medical and health-related expenses',
        avatar: SHARED_AVATARS['HEALTHCARE'],
      },
      {
        label: 'Shopping',
        description: 'General shopping and purchases',
        avatar: SHARED_AVATARS['SHOPPING'],
      },
      {
        label: 'Personal Care',
        description: 'Beauty, grooming, and personal items',
        avatar: SHARED_AVATARS['PERSONAL_CARE'],
      },
    ]
  },
]

/**
 * Specific set of categories, which breaks down common expenses into even more specific categories.
 */
export const PRESET_CATEGORIES_SPECIFIC: Array<{ group: CategoryPresetGroup | null, categories: CreateCategory[] }> = [
  {
    group: CategoryPresetGroup.PET,
    categories: [
      {
        label: 'Pet Food',
        description: 'Food for your pets',
        avatar: SHARED_AVATARS['PETS'],
      },
      {
        label: 'Pet Care',
        description: 'Auxiliary expenses for your pet',
        avatar: {
          kind: 'papaya:avatar',
          content: 'pets_outlined',
          variant: 'PICTORIAL',
          primaryColor: '#fbb6ce',
        },
      }
    ]
  },
  {
    group: CategoryPresetGroup.RENT,
    categories: [
      {
        label: 'Rent',
        description: 'Expenses for your rent',
        avatar: SHARED_AVATARS['RENT'],
      }
    ]
  },
  {
    group: CategoryPresetGroup.HOME_OWNER,
    categories: [
      {
        label: 'Mortgage',
        description: 'Expenses for your mortgage',
        avatar: SHARED_AVATARS['MORTGAGE'],
      },
      {
        label: 'Home Insurance',
        description: 'Home and property insurance',
        avatar: SHARED_AVATARS['HOME_INSURANCE'],
      }
    ]
  },
  {
    group: CategoryPresetGroup.CAR,
    categories: [
      {
        label: 'Car Fuel',
        description: 'Gasoline, car charging, or other fuel expenses',
        avatar: SHARED_AVATARS['CAR'],
      },
      {
        label: 'Car Maintenance',
        description: 'Maintenance and repairs for your car',
        avatar: {
          kind: 'papaya:avatar',
          content: 'build',
          variant: 'PICTORIAL',
          primaryColor: '#718096',
        },
      }
    ]
  },
  {
    group: CategoryPresetGroup.STUDENT,
    categories: [
      {
        label: 'Tuition & Fees',
        description: 'School tuition and fees',
        avatar: SHARED_AVATARS['TUITION'],
      },
      {
        label: 'Textbooks',
        description: 'Required textbooks and course materials',
        avatar: SHARED_AVATARS['TEXTBOOKS'],
      },
      {
        label: 'Student Loans',
        description: 'Student loan payments',
        avatar: {
          kind: 'papaya:avatar',
          content: 'account_balance',
          variant: 'PICTORIAL',
          primaryColor: '#38b2ac',
        },
      },
      {
        label: 'Campus Life',
        description: 'Dining plans, activities, and campus expenses',
        avatar: {
          kind: 'papaya:avatar',
          content: 'school',
          variant: 'PICTORIAL',
          primaryColor: '#68d391',
        },
      }
    ]
  },
  {
    group: CategoryPresetGroup.PARENT,
    categories: [
      {
        label: 'Childcare',
        description: 'Daycare and babysitting expenses',
        avatar: SHARED_AVATARS['CHILDCARE'],
      },
      {
        label: 'School Supplies',
        description: 'School supplies and materials for children',
        avatar: SHARED_AVATARS['SCHOOL_SUPPLIES'],
      },
      {
        label: 'Kids Activities',
        description: 'Sports, lessons, and extracurricular activities',
        avatar: {
          kind: 'papaya:avatar',
          content: 'sports_soccer',
          variant: 'PICTORIAL',
          primaryColor: '#48bb78',
        },
      },
      {
        label: 'Baby Supplies',
        description: 'Diapers, formula, and baby essentials',
        avatar: {
          kind: 'papaya:avatar',
          content: 'baby_changing_station',
          variant: 'PICTORIAL',
          primaryColor: '#fbb6ce',
        },
      }
    ]
  },
  {
    group: null,
    categories: [
      {
        label: 'Food Essentials',
        description: 'Essential groceries for daily life',
        avatar: SHARED_AVATARS['GROCERIES'],
      },
      {
        label: 'Takeout & Dining',
        description: 'Restaurant meals and food delivery',
        avatar: SHARED_AVATARS['TAKEOUT'],
      },
      {
        label: 'Public Transportation',
        description: 'Bus, train, and other public transit',
        avatar: SHARED_AVATARS['TRANSPORTATION'],
      },
      {
        label: 'Internet',
        description: 'Internet and mobile phone bills',
        avatar: SHARED_AVATARS['INTERNET'],
      },
      {
        label: 'Electricity',
        description: 'Electrical utility bills',
        avatar: {
          kind: 'papaya:avatar',
          content: 'electrical_services',
          variant: 'PICTORIAL',
          primaryColor: '#f6e05e',
        },
      },
      {
        label: 'Gas & Heating',
        description: 'Gas, heating, and cooling bills',
        avatar: {
          kind: 'papaya:avatar',
          content: 'local_fire_department',
          variant: 'PICTORIAL',
          primaryColor: '#ff6b6b',
        },
      },
      {
        label: 'Water',
        description: 'Water and sewer bills',
        avatar: {
          kind: 'papaya:avatar',
          content: 'water_drop',
          variant: 'PICTORIAL',
          primaryColor: '#4dabf7',
        },
      },
      {
        label: 'Streaming & Entertainment',
        description: 'Movies, games, streaming services',
        avatar: SHARED_AVATARS['ENTERTAINMENT'],
      },
      {
        label: 'Healthcare',
        description: 'Medical appointments and prescriptions',
        avatar: SHARED_AVATARS['HEALTHCARE'],
      },
      {
        label: 'Clothing',
        description: 'Clothing and accessories',
        avatar: {
          kind: 'papaya:avatar',
          content: 'checkroom',
          variant: 'PICTORIAL',
          primaryColor: '#a78bfa',
        },
      },
      {
        label: 'Personal Care',
        description: 'Beauty, grooming, and personal items',
        avatar: SHARED_AVATARS['PERSONAL_CARE'],
      },
    ]
  },
]


