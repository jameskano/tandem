import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import logo1 from '../assets/main-logo/logo1.png';
import { COLORS } from '../shared/colors';
import { useI18n } from '../shared/i18n/useI18n';
import Button from '../shared/ui/Button';
import Card from '../shared/ui/Card';
import ResendEmail from '../components/ResendEmail';

interface ConfirmEmailProps {
  email?: string;
}

const ConfirmEmail: React.FC<ConfirmEmailProps> = ({ email }) => {
  const { t } = useI18n();
  const displayEmail = email && email.trim() ? email : t('confirmEmail.fallbackEmail');
  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: COLORS.bg }}
    >
      <div className="flex flex-1 items-center justify-center px-4 pb-20 pt-10">
        <div className="w-full max-w-md">
          <div className="mb-6 flex justify-center">
            <img src={logo1} alt="Tandem Logo" className="mx-auto w-14" />
          </div>

          <Card className="px-6 py-8">
            {/* Title */}
            <h1
              className="mb-2 text-center text-2xl font-bold"
              style={{ color: COLORS.text }}
            >
              {t('confirmEmail.title')}
            </h1>

            {/* Subtitle */}
            <p
              className="text-m mb-6 text-center font-medium"
              style={{ color: COLORS.secondary }}
            >
              {t('confirmEmail.subtitle')}
            </p>

            {/* Email Confirmation Section */}
            <div
              className="mb-6 rounded-lg border p-4"
              style={{
                backgroundColor: COLORS.primary + '08',
                borderColor: COLORS.primary + '30',
              }}
            >
              <div className="mb-3 flex items-center gap-2">
                <Mail size={18} style={{ color: COLORS.primary }} />
                <p className="font-semibold" style={{ color: COLORS.text }}>
                  {t('confirmEmail.blockTitle')}
                </p>
              </div>
              <p
                className="text-sm leading-relaxed"
                style={{ color: COLORS.muted }}
              >
                {t('confirmEmail.sentTo', { email: displayEmail })}
              </p>
            </div>

            {/* Instructions */}
            <div className="mb-6 space-y-2">
              <p className="text-sm font-medium" style={{ color: COLORS.text }}>
                {t('confirmEmail.nextSteps')}
              </p>
              <ul className="space-y-2 text-sm" style={{ color: COLORS.text }}>
                <li className="flex items-start gap-2">
                  <span style={{ color: COLORS.primary }} className="font-bold">
                    1.
                  </span>
                  <span>{t('confirmEmail.stepOne')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: COLORS.primary }} className="font-bold">
                    2.
                  </span>
                  <span>
                    {t('confirmEmail.stepTwo')}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: COLORS.primary }} className="font-bold">
                    3.
                  </span>
                  <span>{t('confirmEmail.stepThree')}</span>
                </li>
              </ul>
            </div>

            {/* Spam Notice */}
            <div
              className="mb-6 rounded-lg p-3 text-xs"
              style={{
                backgroundColor: COLORS.highlight + '15',
                color: COLORS.text,
              }}
            >
              ðŸ’¡ {t('confirmEmail.spamNotice')}
            </div>

            {/* Action Button */}
            <Link to="/" className="block">
              <Button className="w-full">{t('confirmEmail.goToMain')}</Button>
            </Link>

            <ResendEmail email={displayEmail} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmail;
