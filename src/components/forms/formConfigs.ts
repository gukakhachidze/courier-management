import type { FormField, UserRole } from '@/types';

export const adminFields: FormField[] = [
  { name: 'firstName', label: 'სახელი', type: 'text', required: true },
  { name: 'lastName', label: 'გვარი', type: 'text', required: false },
  { name: 'pid', label: 'პირადი ნომერი', type: 'text', required: true, placeholder: '01234567890' },
  { name: 'phoneNumber', label: 'ტელეფონი', type: 'tel', required: true, placeholder: '5XXXXXXXX' },
  { name: 'email', label: 'ელ-ფოსტა', type: 'email', required: true },
  { name: 'password', label: 'პაროლი', type: 'password', required: true },
  { name: 'profileImage', label: 'პროფილის სურათი', type: 'file', required: false },
  {
    name: 'role',
    label: 'როლი',
    type: 'select',
    required: true,
    options: [{ value: 'admin', label: 'ადმინი' }],
  },
];

export const userFields: FormField[] = [
  { name: 'firstName', label: 'სახელი', type: 'text', required: true },
  { name: 'lastName', label: 'გვარი', type: 'text', required: false },
  { name: 'pid', label: 'პირადი ნომერი', type: 'text', required: true, placeholder: '01234567890' },
  { name: 'phoneNumber', label: 'ტელეფონი', type: 'tel', required: true },
  { name: 'email', label: 'ელ-ფოსტა', type: 'email', required: true },
  { name: 'password', label: 'პაროლი', type: 'password', required: true },
  { name: 'profileImage', label: 'პროფილის სურათი', type: 'file', required: false },
  {
    name: 'role',
    label: 'როლი',
    type: 'select',
    required: true,
    options: [{ value: 'user', label: 'მომხმარებელი' }],
  },
  { name: 'address', label: 'მისამართი (კოორდინატები)', type: 'address', required: true },
];

export const courierFields: FormField[] = [
  {
    name: 'role',
    label: 'როლი',
    type: 'select',
    required: true,
    options: [{ value: 'courier', label: 'კურიერი' }],
  },
  { name: 'firstName', label: 'სახელი', type: 'text', required: true },
  { name: 'lastName', label: 'გვარი', type: 'text', required: false },
  { name: 'pid', label: 'პირადი ნომერი', type: 'text', required: true, placeholder: '01234567890' },
  { name: 'phoneNumber', label: 'ტელეფონი', type: 'tel', required: true },
  { name: 'email', label: 'ელ-ფოსტა', type: 'email', required: true },
  { name: 'password', label: 'პაროლი', type: 'password', required: true },
  { name: 'profileImage', label: 'პროფილის სურათი', type: 'file', required: false },
  {
    name: 'vehicle',
    label: 'სატრანსპორტო საშუალება',
    type: 'select',
    required: true,
    options: [
      { value: 'motorcycle', label: '🏍️ მოტოციკლი' },
      { value: 'bicycle', label: '🚲 ველოსიპედი' },
      { value: 'car', label: '🚗 მანქანა' },
      { value: 'scooter', label: '🛵 სკუტერი' },
      { value: 'foot', label: '🚶 ფეხით' },
    ],
  },
];

export const getFieldsByRole = (role: UserRole): FormField[] => {
  switch (role) {
    case 'admin':
      return adminFields;
    case 'user':
      return userFields;
    case 'courier':
      return courierFields;
  }
};
