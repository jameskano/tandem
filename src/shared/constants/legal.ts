export const LEGAL_LAST_UPDATED = 'April 23, 2026';
export const LEGAL_SUPPORT_EMAIL = 'support@tandem.app';
export const LEGAL_GOVERNING_REGION = 'Spain';
export const APP_PUBLIC_URL = (
  import.meta.env.VITE_APP_PUBLIC_URL || 'https://tandem.app'
).replace(/\/+$/, '');
export const LEGAL_URLS = {
  privacy: `${APP_PUBLIC_URL}/privacy`,
  terms: `${APP_PUBLIC_URL}/terms`,
} as const;

export type LegalSubsection = {
  title: string;
  body: string[];
  bullets?: string[];
};

export type LegalSection = {
  id: string;
  title: string;
  body?: string[];
  bullets?: string[];
  subsections?: LegalSubsection[];
};

export const privacySections: LegalSection[] = [
  {
    id: 'information-we-collect',
    title: '1. Information We Collect',
    subsections: [
      {
        title: 'Account Information',
        body: [
          'When you create an account, we may collect your email address, authentication details, and basic account identifiers.',
        ],
      },
      {
        title: 'Profile and Settings Information',
        body: [
          'We may collect information you provide in the app, such as language, locale, currency, country, city, preferences, and onboarding choices.',
        ],
      },
      {
        title: 'Activity and App Usage Data',
        body: [
          'We may collect information related to how you use Tandem, including saved activities, generated suggestions, subscription status, feature usage, device type, platform, and app diagnostics.',
        ],
      },
      {
        title: 'AI Input Data',
        body: [
          'If you use Tandem suggestion features, we process the prompts and optional filters you provide, such as mood, budget, time available, setting, and similar preferences, in order to generate suggestions for you.',
        ],
      },
      {
        title: 'Purchase and Subscription Data',
        body: [
          'If you purchase a subscription, we may receive subscription and entitlement information from payment and subscription providers, such as purchase status, renewal status, expiration dates, and product identifiers.',
        ],
      },
      {
        title: 'Support Communications',
        body: [
          'If you contact us for support, we may collect your email address and any information you include in your message.',
        ],
      },
    ],
  },
  {
    id: 'how-we-use',
    title: '2. How We Use Your Information',
    body: ['We use your information to:'],
    bullets: [
      'provide, maintain, and operate Tandem;',
      'create and manage your account;',
      'generate personalized activity suggestions;',
      'save your preferences and app settings;',
      'process subscriptions and manage access to paid features;',
      'provide customer support;',
      'improve the app, performance, and user experience;',
      'maintain security, prevent abuse, and enforce our Terms.',
    ],
  },
  {
    id: 'legal-bases',
    title: '3. Legal Bases (EEA / UK users)',
    body: [
      'Where required by applicable law, we process personal data on the basis of one or more of the following: performance of a contract, legitimate interests, consent, and compliance with legal obligations.',
    ],
  },
  {
    id: 'ai-processing',
    title: '4. AI and Third-Party Processing',
    body: [
      'To provide suggestion features, Tandem may send the prompt and related filters you provide to third-party AI service providers. We use those providers to generate activity suggestions and improve the reliability of the feature.',
      'We do not use your prompts to intentionally publish your private content. However, you should avoid entering highly sensitive personal information into prompts.',
    ],
  },
  {
    id: 'sharing',
    title: '5. Sharing of Information',
    body: ['We may share information with service providers that help us operate Tandem, such as:'],
    bullets: [
      'authentication and database providers;',
      'cloud hosting and infrastructure providers;',
      'AI service providers;',
      'subscription and payment platforms;',
      'analytics, error monitoring, and support tools.',
    ],
  },
  {
    id: 'retention',
    title: '6. Data Retention',
    body: [
      'We retain information for as long as necessary to provide the service, comply with legal obligations, resolve disputes, and enforce our agreements.',
      'If you delete your account, we will delete or anonymize your information unless we need to keep certain data for legal, security, or billing reasons.',
    ],
  },
  {
    id: 'rights',
    title: '7. Your Rights',
    body: [
      `Depending on where you live, you may have rights to access, correct, delete, or export your personal data, and to object to or restrict certain processing. To exercise these rights, contact us at ${LEGAL_SUPPORT_EMAIL}.`,
    ],
  },
  {
    id: 'security',
    title: '8. Security',
    body: [
      'We take reasonable technical and organizational measures to protect your information. However, no system is completely secure, and we cannot guarantee absolute security.',
    ],
  },
  {
    id: 'children',
    title: '9. Children’s Privacy',
    body: [
      'Tandem is not intended for children under 13, or under the minimum age required in your jurisdiction. We do not knowingly collect personal information from children.',
    ],
  },
  {
    id: 'international-transfers',
    title: '10. International Transfers',
    body: [
      'Your information may be processed in countries other than your own. Where required, we use appropriate safeguards for international data transfers.',
    ],
  },
  {
    id: 'changes',
    title: '11. Changes to This Policy',
    body: [
      'We may update this Privacy Policy from time to time. If we make material changes, we will update the date above and, where appropriate, notify you in the app or by email.',
    ],
  },
  {
    id: 'contact',
    title: '12. Contact',
    body: [
      `If you have questions about this Privacy Policy, contact us at ${LEGAL_SUPPORT_EMAIL}.`,
    ],
  },
];

export const termsSections: LegalSection[] = [
  {
    id: 'eligibility',
    title: '1. Eligibility',
    body: [
      'You must be at least 13 years old, or the minimum legal age in your jurisdiction, to use Tandem. By using the service, you represent that you meet this requirement.',
    ],
  },
  {
    id: 'account',
    title: '2. Your Account',
    body: [
      'You are responsible for maintaining the confidentiality of your account and for all activity that occurs under it. You agree to provide accurate information and keep it up to date.',
    ],
  },
  {
    id: 'service',
    title: '3. Description of the Service',
    body: [
      'Tandem provides tools to help users discover, save, and plan activities. Some features may be free, and some may require a paid subscription. Features may change over time.',
    ],
  },
  {
    id: 'ai-suggestions',
    title: '4. AI-Generated Suggestions',
    body: [
      'Tandem may provide suggestions generated by artificial intelligence. These suggestions are for informational and entertainment purposes only.',
      'We do not guarantee that any suggestion will be suitable, safe, available, accurate, lawful, or appropriate for your specific circumstances. You are responsible for using your own judgment before acting on any suggestion.',
    ],
  },
  {
    id: 'acceptable-use',
    title: '5. Acceptable Use',
    body: ['You agree not to:'],
    bullets: [
      'use Tandem for unlawful, abusive, fraudulent, or harmful purposes;',
      'interfere with or disrupt the service;',
      'attempt to access accounts, data, or systems without authorization;',
      'upload or submit content that violates the rights of others;',
      'reverse engineer, scrape, or misuse the service beyond normal use.',
    ],
  },
  {
    id: 'user-content',
    title: '6. User Content',
    body: [
      'You may provide prompts, preferences, saved items, and other content through the service. You retain rights in your content, but you grant us a limited license to use it as necessary to operate, improve, and provide Tandem.',
    ],
  },
  {
    id: 'subscriptions',
    title: '7. Paid Features and Subscriptions',
    body: [
      'Some features may require payment. Pricing, billing intervals, and available plans will be presented to you at the time of purchase. If you purchase through Apple App Store or Google Play, billing and cancellations are handled by those platforms under their rules.',
      'Unless otherwise stated, subscriptions renew automatically until canceled. You are responsible for managing your subscription through the platform used to purchase it.',
    ],
  },
  {
    id: 'refunds',
    title: '8. Refunds',
    body: [
      'Refunds are handled according to the rules of the payment platform or store through which you purchased the subscription, except where applicable law requires otherwise.',
    ],
  },
  {
    id: 'ip',
    title: '9. Intellectual Property',
    body: [
      'Tandem and its branding, software, design, and content, excluding your own content, are owned by us or our licensors and are protected by applicable intellectual property laws.',
    ],
  },
  {
    id: 'termination',
    title: '10. Termination',
    body: [
      'We may suspend or terminate your access if you violate these Terms, misuse the service, or if required for legal or security reasons. You may stop using Tandem at any time.',
    ],
  },
  {
    id: 'disclaimers',
    title: '11. Disclaimers',
    body: [
      'Tandem is provided "as is" and "as available." To the maximum extent permitted by law, we disclaim warranties of any kind, whether express or implied, including fitness for a particular purpose, non-infringement, and availability.',
    ],
  },
  {
    id: 'liability',
    title: '12. Limitation of Liability',
    body: [
      'To the maximum extent permitted by law, we will not be liable for any indirect, incidental, special, consequential, or punitive damages, or for any loss of data, revenue, profits, or opportunities arising from your use of Tandem.',
    ],
  },
  {
    id: 'changes',
    title: '13. Changes to the Service or Terms',
    body: [
      'We may modify the service or these Terms from time to time. Continued use of Tandem after updated Terms take effect means you accept the revised Terms.',
    ],
  },
  {
    id: 'governing-law',
    title: '14. Governing Law',
    body: [
      `These Terms are governed by the laws of ${LEGAL_GOVERNING_REGION}, without regard to conflict-of-law principles, unless applicable consumer protection laws require otherwise.`,
    ],
  },
  {
    id: 'contact',
    title: '15. Contact',
    body: [`For questions about these Terms, contact ${LEGAL_SUPPORT_EMAIL}.`],
  },
];
