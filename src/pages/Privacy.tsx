import React from 'react';
import LegalDocumentPage from '../components/LegalDocumentPage';
import { privacySections } from '../shared/constants/legal';

const Privacy: React.FC = () => {
  return (
    <LegalDocumentPage
      title="Privacy Policy"
      intro="Tandem provides a mobile and web app that helps couples discover, save, and plan activities together. This Privacy Policy explains what information we collect, how we use it, and the choices available to you."
      sections={privacySections}
      variant="privacy"
    />
  );
};

export default Privacy;
