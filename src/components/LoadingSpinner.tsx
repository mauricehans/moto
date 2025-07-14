import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

export const LoadingSpinner = ({ size = 'medium', message }: LoadingSpinnerProps) => {
  const sizes = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <Loader2 className={`${sizes[size]} animate-spin text-red-600`} />
      {message && <p className="text-gray-600 text-sm">{message}</p>}
    </div>
  );
};
