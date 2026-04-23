import React from 'react';
import { FileText, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../shared/ui/Card';
import type { LegalSection } from '../shared/constants/legal';
import { LEGAL_LAST_UPDATED, LEGAL_SUPPORT_EMAIL } from '../shared/constants/legal';

type LegalDocumentPageProps = {
  title: string;
  intro: string;
  sections: LegalSection[];
  variant: 'privacy' | 'terms';
};

const variantConfig = {
  privacy: {
    icon: ShieldCheck,
    badge: 'Privacy & data use',
    accent:
      'from-primary/20 via-accent/20 to-highlight/30 border-primary/20',
  },
  terms: {
    icon: FileText,
    badge: 'Use of service',
    accent:
      'from-secondary/20 via-primary/10 to-highlight/30 border-secondary/20',
  },
} as const;

const renderParagraph = (paragraph: string) => {
  const parts = paragraph.split(LEGAL_SUPPORT_EMAIL);

  if (parts.length === 1) {
    return paragraph;
  }

  return parts.flatMap((part, index) => {
    const content: React.ReactNode[] = [part];

    if (index < parts.length - 1) {
      content.push(
        <a
          key={`${paragraph}-${index}`}
          href={`mailto:${LEGAL_SUPPORT_EMAIL}`}
          className="text-primary underline decoration-primary/40 underline-offset-4 transition hover:text-primary/80"
        >
          {LEGAL_SUPPORT_EMAIL}
        </a>
      );
    }

    return content;
  });
};

const LegalDocumentPage: React.FC<LegalDocumentPageProps> = ({
  title,
  intro,
  sections,
  variant,
}) => {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div className="min-h-full w-full bg-bg">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6 md:py-8">
        <Card
          className={`overflow-hidden border bg-gradient-to-br ${config.accent} p-0 shadow-lg`}
        >
          <div className="relative px-6 py-8 md:px-8">
            <div className="absolute inset-y-0 right-0 hidden w-40 bg-white/20 blur-3xl md:block" />
            <div className="relative flex flex-col gap-5">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/50 bg-white/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-text">
                <Icon className="h-4 w-4" />
                {config.badge}
              </div>

              <div className="max-w-3xl space-y-3">
                <h1 className="text-3xl font-bold tracking-tight text-text md:text-4xl">
                  {title}
                </h1>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-textMuted">
                  Last updated {LEGAL_LAST_UPDATED}
                </p>
                <p className="max-w-2xl text-base leading-7 text-text md:text-lg">
                  {intro}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/privacy"
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    variant === 'privacy'
                      ? 'bg-text text-white'
                      : 'bg-white/70 text-text hover:bg-white'
                  }`}
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms"
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    variant === 'terms'
                      ? 'bg-text text-white'
                      : 'bg-white/70 text-text hover:bg-white'
                  }`}
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <Card className="h-fit p-5 lg:sticky lg:top-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-textMuted">
              On this page
            </p>
            <nav className="mt-4 space-y-2">
              {sections.map(section => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block rounded-xl px-3 py-2 text-sm text-text transition hover:bg-bg hover:text-primary"
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </Card>

          <div className="space-y-4">
            {sections.map(section => (
              <Card key={section.id} className="p-6 md:p-7">
                <section id={section.id} className="scroll-mt-6 space-y-4">
                  <h2 className="text-xl font-semibold text-text md:text-2xl">
                    {section.title}
                  </h2>

                  {section.body?.map(paragraph => (
                    <p key={paragraph} className="leading-7 text-textMuted">
                      {renderParagraph(paragraph)}
                    </p>
                  ))}

                  {section.bullets ? (
                    <ul className="space-y-2 pl-5 text-textMuted marker:text-primary">
                      {section.bullets.map(item => (
                        <li key={item} className="leading-7">
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {section.subsections?.map(subsection => (
                    <div
                      key={subsection.title}
                      className="rounded-2xl border border-appBorder bg-bg/70 p-4"
                    >
                      <h3 className="text-base font-semibold text-text md:text-lg">
                        {subsection.title}
                      </h3>
                      <div className="mt-2 space-y-3">
                        {subsection.body.map(paragraph => (
                          <p
                            key={paragraph}
                            className="leading-7 text-textMuted"
                          >
                            {renderParagraph(paragraph)}
                          </p>
                        ))}

                        {subsection.bullets ? (
                          <ul className="space-y-2 pl-5 text-textMuted marker:text-primary">
                            {subsection.bullets.map(item => (
                              <li key={item} className="leading-7">
                                {item}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </section>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalDocumentPage;
