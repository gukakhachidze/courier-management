export type UserRole = 'admin' | 'user' | 'courier';

export interface Address {
  lng: number;
  lat: number;
}

export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export interface WorkingHours {
  startHours: string;
  endHours: string;
}

export type WorkingDays = Partial<Record<DayOfWeek, WorkingHours>>;

export interface BaseUser {
  id: string;
  firstName: string;
  lastName?: string;
  pid: string;
  phoneNumber: string;
  email: string;
  profileImage?: string;
  role: UserRole;
}

export interface AdminUser extends BaseUser {
  role: 'admin';
}

export interface RegularUser extends BaseUser {
  role: 'user';
  address: Address;
}

export interface CourierUser extends BaseUser {
  role: 'courier';
  vehicle: string;
  workingDays: WorkingDays;
  totalBookings?: number;
}

export type AppUser = AdminUser | RegularUser | CourierUser;

export interface CourierBooking {
  id: string;
  courierId: string;
  userId: string;
  userName: string;
  day: DayOfWeek;
  startHours: string;
  endHours: string;
}

// Form field types
export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'tel'
  | 'file'
  | 'select'
  | 'address'
  | 'workingDays';

export interface SelectOption {
  value: string;
  label: string;
}

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: SelectOption[];
  placeholder?: string;
}

// Auth
export interface LoginCredentials {
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthState {
  user: AppUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

// Admin panel
export interface AdminState {
  users: RegularUser[];
  couriers: CourierUser[];
  bookings: CourierBooking[];
  isLoading: boolean;
  error: string | null;
}
