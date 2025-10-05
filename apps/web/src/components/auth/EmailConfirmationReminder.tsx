import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, RefreshCw } from 'lucide-react';

interface EmailConfirmationReminderProps {
  email: string;
  onResend?: () => void;
}

export const EmailConfirmationReminder = ({ email, onResend }: EmailConfirmationReminderProps) => {
  const [isResending, setIsResending] = useState(false);

  const handleResend = async () => {
    if (onResend) {
      setIsResending(true);
      try {
        await onResend();
      } finally {
        setIsResending(false);
      }
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-start">
        <Mail className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
        <div className="flex-1">
          <p className="font-medium text-blue-800">Confirm your email</p>
          <p className="text-sm text-blue-700 mt-1">
            We sent a confirmation email to <span className="font-medium">{email}</span>. 
            Please check your inbox and click the confirmation link.
          </p>
          {onResend && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleResend}
              disabled={isResending}
              className="mt-2 border-blue-200 text-blue-700 hover:bg-blue-100"
            >
              {isResending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Resending...
                </>
              ) : (
                'Resend Email'
              )}
            </Button>
          )}
          <p className="text-xs mt-2 text-blue-600">
            Didn't receive it? Check your spam folder or wait a few minutes.
          </p>
        </div>
      </div>
    </div>
  );
};