import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  title: string;
  message: string;
  details?: string;
  onRetry?: () => void;
  retryText?: string;
  children?: React.ReactNode;
}

export const SimpleErrorMessage = ({ title, message }: { title: string; message: string }) => (
  <div className="p-4 bg-red-50 border border-red-200 rounded">
    <h3 className="text-red-600 font-bold">{title}</h3>
    <p className="text-red-500 text-sm">{message}</p>
  </div>
);

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title,
  message,
  details,
  onRetry,
  retryText = 'Réessayer',
  children
}) => {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-full mb-6">
        <AlertTriangle size={32} />
      </div>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {title}
      </h1>
      
      <p className="text-gray-600 mb-4 max-w-md mx-auto">
        {message}
      </p>
      
      {details && (
        <details className="mb-6 text-left max-w-lg mx-auto">
          <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
            Détails techniques
          </summary>
          <pre className="mt-2 p-3 bg-gray-100 rounded text-xs text-gray-700 overflow-auto">
            {details}
          </pre>
        </details>
      )}
      
      <div className="space-y-4">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors duration-300"
          >
            <RefreshCw size={20} className="mr-2" />
            {retryText}
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default ErrorMessage;
