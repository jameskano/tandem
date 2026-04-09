import { useCallback } from 'react';
import {
  discoverLabelText,
  discoverPlaceholderText,
} from '../shared/constants/text-constants';
import { useI18n } from '../shared/i18n/useI18n';

const useUtils = () => {
  const { t } = useI18n();

  const getDiscoverLabelText = useCallback(() => {
    const key =
      discoverLabelText[Math.floor(Math.random() * discoverLabelText.length)];
    return t(key);
  }, [t]);

  const getDiscoverPlaceholderText = useCallback(() => {
    const key =
      discoverPlaceholderText[
        Math.floor(Math.random() * discoverPlaceholderText.length)
      ];
    return t(key);
  }, [t]);

  return { getDiscoverLabelText, getDiscoverPlaceholderText };
};

export default useUtils;
