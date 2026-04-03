import React, { useState, useRef } from 'react';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  Avatar,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import type { FormField } from '@/types';
import { uploadToCloudinary } from '@/utils/mockData';

interface BaseFormProps {
  fields: FormField[];
  onSubmit: (values: Record<string, unknown>) => void;
  isLoading?: boolean;
  error?: string | null;
  submitLabel?: string;
  extraContent?: React.ReactNode;
}

const BaseForm: React.FC<BaseFormProps> = ({
  fields,
  onSubmit,
  isLoading,
  error,
  submitLabel = 'დარეგისტრირება',
  extraContent,
}) => {
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    fields.forEach((field) => {
      if (field.required) {
        const val = values[field.name];
        if (!val || (typeof val === 'string' && val.trim() === '')) {
          newErrors[field.name] = `${field.label} სავალდებულოა`;
        }
      }
      if (field.name === 'email' && values.email) {
        const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailReg.test(values.email as string)) {
          newErrors.email = 'გთხოვთ, შეიყვანოთ სწორი ელ-ფოსტა';
        }
      }
      if (field.name === 'pid' && values.pid) {
        if ((values.pid as string).length !== 11) {
          newErrors.pid = 'პირადი ნომერი უნდა შედგებოდეს 11 ციფრისგან';
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (name: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    setUploadingImage(true);
    try {
      // In production, this calls Cloudinary
      // const url = await uploadToCloudinary(file);
      // For demo, use local preview
      const mockUrl = URL.createObjectURL(file);
      handleChange('profileImage', mockUrl);
    } catch {
      console.error('Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(values);
    }
  };

  const renderField = (field: FormField) => {
    if (field.type === 'file') {
      return (
        <Box key={field.name} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
          <Avatar
            src={imagePreview}
            sx={{ width: 80, height: 80, cursor: 'pointer', border: '2px dashed #ccc' }}
            onClick={() => fileRef.current?.click()}
          >
            {uploadingImage ? <CircularProgress size={24} /> : <AddPhotoAlternateIcon />}
          </Avatar>
          <Typography variant="caption" color="text.secondary">
            {field.label} {!field.required && '(არასავალდებულო)'}
          </Typography>
        </Box>
      );
    }

    if (field.type === 'select') {
      return (
        <TextField
          key={field.name}
          select
          fullWidth
          label={field.label}
          required={field.required}
          value={(values[field.name] as string) || ''}
          onChange={(e) => handleChange(field.name, e.target.value)}
          error={!!errors[field.name]}
          helperText={errors[field.name]}
          size="small"
        >
          {field.options?.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>
      );
    }

    if (field.type === 'address') {
      return (
        <Box key={field.name} sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            label="გრძედი (Longitude)"
            required={field.required}
            type="number"
            placeholder="44.7933"
            value={(values['address.lng'] as string) || ''}
            onChange={(e) => {
              handleChange('address.lng', e.target.value);
              handleChange(field.name, {
                lng: parseFloat(e.target.value),
                lat: parseFloat((values['address.lat'] as string) || '0'),
              });
            }}
            error={!!errors[field.name]}
            size="small"
          />
          <TextField
            fullWidth
            label="განედი (Latitude)"
            required={field.required}
            type="number"
            placeholder="41.6938"
            value={(values['address.lat'] as string) || ''}
            onChange={(e) => {
              handleChange('address.lat', e.target.value);
              handleChange(field.name, {
                lng: parseFloat((values['address.lng'] as string) || '0'),
                lat: parseFloat(e.target.value),
              });
            }}
            size="small"
          />
        </Box>
      );
    }

    return (
      <TextField
        key={field.name}
        fullWidth
        label={field.label}
        type={field.type}
        required={field.required}
        placeholder={field.placeholder}
        value={(values[field.name] as string) || ''}
        onChange={(e) => handleChange(field.name, e.target.value)}
        error={!!errors[field.name]}
        helperText={errors[field.name] || (!field.required ? 'არასავალდებულო' : '')}
        size="small"
        inputProps={field.name === 'pid' ? { maxLength: 11 } : {}}
      />
    );
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {error && <Alert severity="error">{error}</Alert>}
      {fields.map(renderField)}
      {extraContent}
      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={isLoading}
        sx={{
          mt: 1,
          py: 1.2,
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          '&:hover': { background: 'linear-gradient(135deg, #16213e 0%, #0f3460 100%)' },
        }}
      >
        {isLoading ? <CircularProgress size={22} color="inherit" /> : submitLabel}
      </Button>
    </Box>
  );
};

export default BaseForm;
