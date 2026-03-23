import useResendEmail from '../hooks/useResendEmail';
import { COLORS } from '../shared/colors';

type ResendEmailProps = {
  email: string;
};

const ResendEmail = ({ email }: ResendEmailProps) => {
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
          ? 'Resending...'
          : resendCooldown > 0
            ? `Resend available in ${resendCooldown}s`
            : 'Resend confirmation email'}
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
