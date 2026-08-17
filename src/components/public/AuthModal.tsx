import React, { useState } from 'react';
import { Modal } from '../ui/modal';
import { FormField, Input, PasswordInput, Select } from '../ui/input';
import { Button } from '../ui/button';
import { useToast } from '../ui/toast';
import { useStudent } from '../../services/student-context';
import { Sparkles, LogIn, UserPlus, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [role, setRole] = useState<'student' | 'parent' | 'educator'>('student');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [grade, setGrade] = useState('class_5');
  const [loading, setLoading] = useState(false);

  const { addToast } = useToast();
  const { loginStudent, signupStudent } = useStudent();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      if (mode === 'login') {
        const success = loginStudent(email || 'aarav.sharma@example.com');
        addToast(
          'success',
          'Welcome to Beyond Classroom!',
          `Signed in as ${email || 'Aarav Sharma'}. Directing to your Dashboard.`
        );
      } else {
        signupStudent({
          name: fullName || 'New Student',
          email: email || 'student@example.com',
          classId: grade,
          board: 'CBSE',
        });
        addToast(
          'success',
          'Account Created Successfully!',
          `Profile created for ${grade.replace('class_', 'Class ')} Student.`
        );
      }

      onClose();
      if (onSuccess) onSuccess();
    }, 600);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          {mode === 'login' ? <LogIn className="w-5 h-5 text-indigo-600" /> : <UserPlus className="w-5 h-5 text-indigo-600" />}
          <span>{mode === 'login' ? 'Sign In to Beyond Classroom' : 'Create Student / Parent Account'}</span>
        </div>
      }
      description="Access Class 1 to Class 8 Mathematics Worksheets, Quizzes, and Practice Tools."
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        {/* Role Selector Tabs */}
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
            Select Account Role
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                role === 'student'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              🎓 Student
            </button>
            <button
              type="button"
              onClick={() => setRole('parent')}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                role === 'parent'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              👨‍👩‍👧 Parent
            </button>
            <button
              type="button"
              onClick={() => setRole('educator')}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                role === 'educator'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              👩‍🏫 Educator
            </button>
          </div>
        </div>

        {mode === 'signup' && (
          <FormField label="Full Name" required>
            <Input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Aarav Sharma"
            />
          </FormField>
        )}

        <FormField label="Email Address" required>
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. parent@example.com"
          />
        </FormField>

        <FormField label="Password" required>
          <PasswordInput
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter secure password"
          />
        </FormField>

        {mode === 'signup' && (
          <FormField label="Enrolled Grade Level">
            <Select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              options={[
                { value: 'class_1', label: 'Class 1 Mathematics' },
                { value: 'class_2', label: 'Class 2 Mathematics' },
                { value: 'class_3', label: 'Class 3 Mathematics' },
                { value: 'class_4', label: 'Class 4 Mathematics' },
                { value: 'class_5', label: 'Class 5 Mathematics' },
                { value: 'class_6', label: 'Class 6 Mathematics' },
                { value: 'class_7', label: 'Class 7 Mathematics' },
                { value: 'class_8', label: 'Class 8 Mathematics' },
              ]}
            />
          </FormField>
        )}

        <div className="pt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
          >
            {mode === 'login' ? 'Need an account? Register here' : 'Already registered? Sign in'}
          </button>
          <Button type="submit" variant="primary-gradient" isLoading={loading}>
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
