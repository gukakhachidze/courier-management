import type {
  AdminUser,
  RegularUser,
  CourierUser,
  CourierBooking,
  LoginCredentials,
  DayOfWeek,
} from '@/types';

export const mockAdmins: AdminUser[] = [
  {
    id: 'admin_1',
    firstName: 'ადმინი',
    lastName: 'სისტემის',
    pid: '01234567890',
    phoneNumber: '555000001',
    email: 'admin@courier.ge',
    role: 'admin',
    profileImage: '',
  },
];

export const mockUsers: RegularUser[] = [
  {
    id: 'user_1',
    firstName: 'გიორგი',
    lastName: 'მამულაშვილი',
    pid: '12345678901',
    phoneNumber: '555100001',
    email: 'giorgi@example.ge',
    role: 'user',
    address: { lng: 44.7933, lat: 41.6938 },
  },
  {
    id: 'user_2',
    firstName: 'ნინო',
    lastName: 'ბერიძე',
    pid: '23456789012',
    phoneNumber: '555100002',
    email: 'nino@example.ge',
    role: 'user',
    address: { lng: 44.7980, lat: 41.7005 },
  },
  {
    id: 'user_3',
    firstName: 'დავით',
    lastName: 'კვარაცხელია',
    pid: '34567890123',
    phoneNumber: '555100003',
    email: 'davit@example.ge',
    role: 'user',
    address: { lng: 44.8010, lat: 41.6890 },
  },
];

export const mockCouriers: CourierUser[] = [
  {
    id: 'courier_1',
    firstName: 'ლევანი',
    lastName: 'გელაშვილი',
    pid: '45678901234',
    phoneNumber: '555200001',
    email: 'courier@courier.ge',
    role: 'courier',
    vehicle: 'motorcycle',
    workingDays: {
      monday: { startHours: '09:00', endHours: '18:00' },
      tuesday: { startHours: '09:00', endHours: '18:00' },
      wednesday: { startHours: '10:00', endHours: '19:00' },
      thursday: { startHours: '09:00', endHours: '17:00' },
      friday: { startHours: '09:00', endHours: '16:00' },
    },
    totalBookings: 3,
  },
  {
    id: 'courier_2',
    firstName: 'მარიამი',
    lastName: 'ჯავახიშვილი',
    pid: '56789012345',
    phoneNumber: '555200002',
    email: 'mariam@courier.ge',
    role: 'courier',
    vehicle: 'bicycle',
    workingDays: {
      monday: { startHours: '08:00', endHours: '16:00' },
      wednesday: { startHours: '08:00', endHours: '16:00' },
      friday: { startHours: '08:00', endHours: '14:00' },
      saturday: { startHours: '10:00', endHours: '18:00' },
      sunday: { startHours: '11:00', endHours: '17:00' },
    },
    totalBookings: 1,
  },
];

export const mockBookings: CourierBooking[] = [
  {
    id: 'b_1',
    courierId: 'courier_1',
    userId: 'user_1',
    userName: 'გიორგი მამულაშვილი',
    day: 'monday',
    startHours: '09:00',
    endHours: '18:00',
  },
  {
    id: 'b_2',
    courierId: 'courier_1',
    userId: 'user_2',
    userName: 'ნინო ბერიძე',
    day: 'tuesday',
    startHours: '09:00',
    endHours: '18:00',
  },
  {
    id: 'b_3',
    courierId: 'courier_2',
    userId: 'user_1',
    userName: 'გიორგი მამულაშვილი',
    day: 'monday',
    startHours: '08:00',
    endHours: '16:00',
  },
];

export const mockLogin = async (credentials: LoginCredentials) => {
  await new Promise((r) => setTimeout(r, 800));

  if (credentials.role === 'admin' && credentials.email === 'admin@courier.ge') {
    return { user: mockAdmins[0], token: 'mock-admin-token' };
  }
  if (credentials.role === 'user') {
    const user = mockUsers.find((u) => u.email === credentials.email);
    if (user) return { user, token: 'mock-user-token' };
  }
  if (credentials.role === 'courier') {
    const courier = mockCouriers.find((c) => c.email === credentials.email);
    if (courier) return { user: courier, token: 'mock-courier-token' };
  }
  throw new Error('Invalid credentials');
};

export const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  for (let h = 0; h < 24; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
    slots.push(`${String(h).padStart(2, '0')}:30`);
  }
  return slots;
};

export const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: 'ორშაბათი',
  tuesday: 'სამშაბათი',
  wednesday: 'ოთხშაბათი',
  thursday: 'ხუთშაბათი',
  friday: 'პარასკევი',
  saturday: 'შაბათი',
  sunday: 'კვირა',
};

export const ALL_DAYS: DayOfWeek[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'YOUR_UPLOAD_PRESET'); // Replace with your preset
  formData.append('cloud_name', 'YOUR_CLOUD_NAME'); // Replace with your cloud name

  const res = await fetch('https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload', {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  return data.secure_url;
};
