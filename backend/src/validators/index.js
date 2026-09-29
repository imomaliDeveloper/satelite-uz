import { z } from 'zod';

export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

// Auth Validators
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').max(100),
  email: z.string().email('Please enter a valid email address').toLowerCase().trim(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required')
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
  confirmNewPassword: z.string()
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: 'New passwords do not match',
  path: ['confirmNewPassword']
});

// Subject & Topic Validators
export const subjectSchema = z.object({
  name: z.string().min(2, 'Subject name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug must be alphanumeric with hyphens'),
  description: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  isActive: z.boolean().optional().default(true)
});

export const topicSchema = z.object({
  subjectId: z.string().min(1, 'Subject ID is required'),
  name: z.string().min(2, 'Topic name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug must be alphanumeric with hyphens'),
  description: z.string().optional().nullable()
});

// Question Validators
export const questionOptionSchema = z.object({
  id: z.string().optional(),
  optionLabel: z.string().min(1).max(5), // A, B, C, D
  optionText: z.string().min(1, 'Option text cannot be empty'),
  isCorrect: z.boolean().default(false)
});

export const questionSchema = z.object({
  subjectId: z.string().min(1, 'Subject is required'),
  topicId: z.string().min(1, 'Topic is required'),
  questionText: z.string().min(5, 'Question text must be at least 5 characters'),
  questionType: z.enum(['MULTIPLE_CHOICE', 'MULTI_SELECT', 'TRUE_FALSE']).default('MULTIPLE_CHOICE'),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).default('MEDIUM'),
  explanation: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  isPublished: z.boolean().optional().default(true),
  options: z.array(questionOptionSchema).min(2, 'Question must have at least 2 answer choices')
}).refine(data => {
  // Ensure at least one option is marked correct
  return data.options.some(opt => opt.isCorrect === true);
}, {
  message: 'At least one answer option must be marked as correct',
  path: ['options']
});

// Exam Validators
export const examSchema = z.object({
  title: z.string().min(3, 'Exam title must be at least 3 characters'),
  description: z.string().optional().nullable(),
  durationMinutes: z.number().int().min(1).max(360).default(60),
  isPublished: z.boolean().optional().default(true),
  questionIds: z.array(z.string()).min(1, 'Exam must contain at least 1 question')
});
