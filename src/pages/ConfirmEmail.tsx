import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import logo1 from '../assets/main-logo/logo1.png';
import { COLORS } from '../shared/colors';
import Button from '../shared/ui/Button';
import Card from '../shared/ui/Card';
import ResendEmail from '../components/ResendEmail/ResendEmail';

interface ConfirmEmailProps {
  email?: string;
}

const ConfirmEmail: React.FC<ConfirmEmailProps> = ({ email }) => {
  const displayEmail = email && email.trim() ? email : 'your mail';
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
              Registered!
            </h1>

            {/* Subtitle */}
            <p
              className="text-m mb-6 text-center font-medium"
              style={{ color: COLORS.secondary }}
            >
              Thanks for joining Tandem
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
                  Confirm your email
                </p>
              </div>
              <p
                className="text-sm leading-relaxed"
                style={{ color: COLORS.muted }}
              >
                We've sent a confirmation link to{' '}
                <span className="font-semibold" style={{ color: COLORS.text }}>
                  {displayEmail}
                </span>
              </p>
            </div>

            {/* Instructions */}
            <div className="mb-6 space-y-2">
              <p className="text-sm font-medium" style={{ color: COLORS.text }}>
                Next steps:
              </p>
              <ul className="space-y-2 text-sm" style={{ color: COLORS.text }}>
                <li className="flex items-start gap-2">
                  <span style={{ color: COLORS.primary }} className="font-bold">
                    1.
                  </span>
                  <span>Open your email inbox</span>
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: COLORS.primary }} className="font-bold">
                    2.
                  </span>
                  <span>
                    Look for the email from Tandem (check your spam folder)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: COLORS.primary }} className="font-bold">
                    3.
                  </span>
                  <span>Click the link to confirm</span>
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
              💡 If you don't see the email, check your <strong>spam</strong> or
              promotions folder.
            </div>

            {/* Action Button */}
            <Link to="/" className="block">
              <Button className="w-full">Go to Main</Button>
            </Link>

            <ResendEmail email={displayEmail} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmail;
