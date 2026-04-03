import React, { useState } from 'react';
import { Box, Alert } from '@mui/material';
import BaseForm from './BaseForm';
import WorkingDaysPicker from './WorkingDaysPicker';
import { getFieldsByRole } from './formConfigs';
import type { UserRole, WorkingDays } from '@/types';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { registerUser } from '@/store/slices/authSlice';

interface RegistrationFormProps {
  role: UserRole;
  onSuccess?: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ role, onSuccess }) => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((s) => s.auth);
  const [workingDays, setWorkingDays] = useState<WorkingDays>({});
  const [wdError, setWdError] = useState('');
  const [success, setSuccess] = useState(false);

  const fields = getFieldsByRole(role);

  const handleSubmit = async (values: Record<string, unknown>) => {
    // Validate courier working days
    if (role === 'courier') {
      const filled = Object.keys(workingDays).length;
      if (filled < 5) {
        setWdError('გთხოვთ, შეავსოთ მინიმუმ 5 სამუშაო დღე');
        return;
      }
      setWdError('');
    }

    const payload = {
      ...values,
      role,
      ...(role === 'courier' ? { workingDays } : {}),
    };

    const result = await dispatch(registerUser({ formData: payload as FormData, role }));
    if (!result.type.includes('rejected')) {
      setSuccess(true);
      onSuccess?.();
    }
  };

  if (success) {
    return (
      <Alert severity="success" sx={{ mt: 2 }}>
        რეგისტრაცია წარმატებულია! შეგიძლიათ შეხვიდეთ სისტემაში.
      </Alert>
    );
  }

  return (
    <Box>
      <BaseForm
        fields={fields}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
        submitLabel="დარეგისტრირება"
        extraContent={
          role === 'courier' ? (
            <WorkingDaysPicker
              value={workingDays}
              onChange={setWorkingDays}
              error={wdError}
            />
          ) : undefined
        }
      />
    </Box>
  );
};

export default RegistrationForm;
