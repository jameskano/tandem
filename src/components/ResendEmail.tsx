import useResendEmail from '../hooks/useResendEmail';
import { COLORS } from '../shared/colors';
import { useI18n } from '../shared/i18n/useI18n';

type ResendEmailProps = {
  email: string;
};

const ResendEmail = ({ email }: ResendEmailProps) => {
  const { t } = useI18n();
  const { resendEmail, resendLoading, resendMessage, resendCooldown } =
    useResendEmail();
  return (
    <div className="text-center">
      <button
        type="button"
        onClick={() => resendEmail(email)}
        disabled={resendLoading || resendCooldown > 0}
        className="mt-3 text-sm font-semibold"
        style={{ color: COLORS.primary }}
      >
        {resendLoading
          ? t('resendEmail.resending')
          : resendCooldown > 0
            ? t('resendEmail.availableIn', { seconds: resendCooldown })
            : t('resendEmail.resend')}
      </button>
      {resendMessage && (
        <p className="mt-2 text-xs" style={{ color: COLORS.muted }}>
          {resendMessage}
        </p>
      )}
    </div>
  );
};

export default ResendEmail;
