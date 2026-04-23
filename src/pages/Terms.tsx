import React from 'react';
import LegalDocumentPage from '../components/LegalDocumentPage';
import { termsSections } from '../shared/constants/legal';

const Terms: React.FC = () => {
  return (
    <LegalDocumentPage
      title="Terms of Service"
      intro="These Terms govern your access to and use of Tandem. By creating an account, browsing the app, or using Tandem features, you agree to these Terms."
      sections={termsSections}
      variant="terms"
    />
  );
};

export default Terms;
