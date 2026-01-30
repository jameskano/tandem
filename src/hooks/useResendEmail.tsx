import { useState } from 'react';

const useResendEmail = () => {
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const resendEmail = async (email: string) => {
    if (resendLoading || resendCooldown > 0) return;
    if (!email) {
      setResendMessage('Enter your email above to resend confirmation.');
      return;
    }

    setResendLoading(true);
    setResendMessage(null);
    try {
      const res = await fetch('/api/resend-confirmation');

      setResendMessage(
        'Confirmation email resent. Check your inbox (and spam).'
      );
      setResendCooldown(30);
      const timer = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      setResendMessage('Could not resend confirmation. Try again later.');
    } finally {
      setResendLoading(false);
      return { resendCooldown, resendLoading, resendMessage };
    }
  };

  return { resendEmail, resendLoading, resendMessage, resendCooldown };
};

export default useResendEmail;
