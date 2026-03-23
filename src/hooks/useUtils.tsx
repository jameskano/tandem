import { useCallback } from 'react';
import {
  discoverLabelText,
  discoverPlaceholderText,
} from '../shared/constants/text-constants';

const useUtils = () => {
  const getDiscoverLabelText = useCallback(() => {
    return discoverLabelText[
      Math.floor(Math.random() * discoverLabelText.length)
    ];
  }, []);

  const getDiscoverPlaceholderText = useCallback(() => {
    return discoverPlaceholderText[
      Math.floor(Math.random() * discoverPlaceholderText.length)
    ];
  }, []);

  return { getDiscoverLabelText, getDiscoverPlaceholderText };
};
export default useUtils;
