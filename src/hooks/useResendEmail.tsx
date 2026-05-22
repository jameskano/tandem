import { useState } from 'react';
import { useI18n } from '../shared/i18n/useI18n';
import {
  getAuthErrorMessage,
  resendSignupConfirmation,
} from '../shared/utils/auth';

const useResendEmail = () => {
  const { t } = useI18n();
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const resendEmail = async (email: string) => {
    if (resendLoading || resendCooldown > 0) return;
    if (!email) {
      setResendMessage(t('resendEmail.missingEmail'));
      return;
    }

    setResendLoading(true);
    setResendMessage(null);
    try {
      await resendSignupConfirmation(email);
      setResendMessage(t('resendEmail.success'));
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
      setResendMessage(getAuthErrorMessage(error, t, 'resendEmail.error'));
    } finally {
      setResendLoading(false);
      return { resendCooldown, resendLoading, resendMessage };
    }
  };

  return { resendEmail, resendLoading, resendMessage, resendCooldown };
};

export default useResendEmail;
