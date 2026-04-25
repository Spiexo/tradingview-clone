import React from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from './Button';

interface ErrorMessageProps {
  message: string;
  title?: string;
  showIcon?: boolean;
  onRetry?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  title = 'Something went wrong',
  showIcon = true,
  onRetry,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-6 text-center space-y-4 ${className}`}>
      {showIcon && (
        <div className="w-12 h-12 bg-red-400/10 rounded-full flex items-center justify-center text-red-400">
          <AlertCircle size={24} />
        </div>
      )}
      <div className="space-y-1">
        {title && <h3 className="text-white font-medium">{title}</h3>}
        <p className="text-gray-400 text-sm max-w-[250px] mx-auto">
          {message}
        </p>
      </div>
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRetry}
          className="gap-2"
        >
          <RefreshCcw size={14} />
          Retry
        </Button>
      )}
    </div>
  );
};
