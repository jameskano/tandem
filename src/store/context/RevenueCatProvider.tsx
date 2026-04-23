import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Purchases,
  type CustomerInfo,
  type PurchasesOffering,
} from '@revenuecat/purchases-capacitor';
import {
  configureRevenueCat,
  getCurrentRevenueCatOffering,
  getRevenueCatCustomerInfo,
  getRevenueCatErrorMessage,
  hasTandemProEntitlement,
  isRevenueCatAvailable,
  logOutRevenueCat,
  presentRevenueCatCustomerCenter,
  presentTandemProPaywall,
  presentTandemProPaywallIfNeeded,
  purchaseRevenueCatPackage,
  restoreRevenueCatPurchases,
  type RevenueCatProductKey,
} from '../../services/revenueCat';
import { useAuthContext } from './AuthProvider';

type RevenueCatContextType = {
  isAvailable: boolean;
  isConfigured: boolean;
  isLoading: boolean;
  error: string | null;
  customerInfo: CustomerInfo | null;
  currentOffering: PurchasesOffering | null;
  hasTandemPro: boolean;
  refreshCustomerInfo: () => Promise<CustomerInfo | null>;
  refreshOffering: () => Promise<PurchasesOffering | null>;
  presentPaywall: () => Promise<boolean>;
  presentPaywallIfNeeded: () => Promise<boolean>;
  purchaseProduct: (productKey: RevenueCatProductKey) => Promise<CustomerInfo>;
  restorePurchases: () => Promise<CustomerInfo>;
  presentCustomerCenter: () => Promise<void>;
};

const RevenueCatContext = createContext({} as RevenueCatContextType);

export const RevenueCatProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useAuthContext();
  const isAvailable = isRevenueCatAvailable();
  const [isConfigured, setIsConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(isAvailable);
  const [error, setError] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [currentOffering, setCurrentOffering] =
    useState<PurchasesOffering | null>(null);

  const handleCustomerInfo = useCallback((nextCustomerInfo: CustomerInfo) => {
    setCustomerInfo(nextCustomerInfo);
    setError(null);
  }, []);

  const refreshCustomerInfo = useCallback(async () => {
    if (!isAvailable || !isConfigured) {
      return null;
    }

    try {
      const nextCustomerInfo = await getRevenueCatCustomerInfo();
      handleCustomerInfo(nextCustomerInfo);
      return nextCustomerInfo;
    } catch (refreshError) {
      const message = getRevenueCatErrorMessage(refreshError);
      setError(message);
      throw refreshError;
    }
  }, [handleCustomerInfo, isAvailable, isConfigured]);

  const refreshOffering = useCallback(async () => {
    if (!isAvailable || !isConfigured) {
      return null;
    }

    try {
      const offering = await getCurrentRevenueCatOffering();
      setCurrentOffering(offering);
      return offering;
    } catch (offeringError) {
      const message = getRevenueCatErrorMessage(offeringError);
      setError(message);
      throw offeringError;
    }
  }, [isAvailable, isConfigured]);

  useEffect(() => {
    if (!isAvailable) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    let listenerId: string | null = null;

    const configure = async () => {
      setIsLoading(true);
      setError(null);

      try {
        await configureRevenueCat(user?.id ?? null);

        if (!isMounted) {
          return;
        }

        setIsConfigured(true);
        const [{ customerInfo: nextCustomerInfo }, offering] =
          await Promise.all([
            Purchases.getCustomerInfo(),
            getCurrentRevenueCatOffering(),
          ]);

        if (!isMounted) {
          return;
        }

        setCustomerInfo(nextCustomerInfo);
        setCurrentOffering(offering);
        listenerId = await Purchases.addCustomerInfoUpdateListener(
          handleCustomerInfo
        );
      } catch (configureError) {
        if (isMounted) {
          setError(getRevenueCatErrorMessage(configureError));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void configure();

    return () => {
      isMounted = false;
      if (listenerId) {
        void Purchases.removeCustomerInfoUpdateListener({
          listenerToRemove: listenerId,
        });
      }
    };
  }, [handleCustomerInfo, isAvailable, user?.id]);

  useEffect(() => {
    if (!isAvailable || user) {
      return;
    }

    setCustomerInfo(null);
    setCurrentOffering(null);
    void logOutRevenueCat().catch(logOutError => {
      console.error('Unable to log out RevenueCat user.', logOutError);
    });
  }, [isAvailable, user]);

  const presentPaywall = useCallback(async () => {
    const result = await presentTandemProPaywall({
      onPurchaseCompleted: ({ customerInfo: nextCustomerInfo }) =>
        handleCustomerInfo(nextCustomerInfo),
      onRestoreCompleted: ({ customerInfo: nextCustomerInfo }) =>
        handleCustomerInfo(nextCustomerInfo),
      onPurchaseError: ({ error: purchaseError }) =>
        setError(getRevenueCatErrorMessage(purchaseError)),
      onRestoreError: ({ error: restoreError }) =>
        setError(getRevenueCatErrorMessage(restoreError)),
    });

    await refreshCustomerInfo();

    return result === 'PURCHASED' || result === 'RESTORED';
  }, [handleCustomerInfo, refreshCustomerInfo]);

  const presentPaywallIfNeeded = useCallback(async () => {
    const result = await presentTandemProPaywallIfNeeded({
      onPurchaseCompleted: ({ customerInfo: nextCustomerInfo }) =>
        handleCustomerInfo(nextCustomerInfo),
      onRestoreCompleted: ({ customerInfo: nextCustomerInfo }) =>
        handleCustomerInfo(nextCustomerInfo),
      onPurchaseError: ({ error: purchaseError }) =>
        setError(getRevenueCatErrorMessage(purchaseError)),
      onRestoreError: ({ error: restoreError }) =>
        setError(getRevenueCatErrorMessage(restoreError)),
    });

    await refreshCustomerInfo();

    return (
      result === 'NOT_PRESENTED' ||
      result === 'PURCHASED' ||
      result === 'RESTORED'
    );
  }, [handleCustomerInfo, refreshCustomerInfo]);

  const purchaseProduct = useCallback(
    async (productKey: RevenueCatProductKey) => {
      const nextCustomerInfo = await purchaseRevenueCatPackage(productKey);
      handleCustomerInfo(nextCustomerInfo);
      return nextCustomerInfo;
    },
    [handleCustomerInfo]
  );

  const restorePurchases = useCallback(async () => {
    const nextCustomerInfo = await restoreRevenueCatPurchases();
    handleCustomerInfo(nextCustomerInfo);
    return nextCustomerInfo;
  }, [handleCustomerInfo]);

  const presentCustomerCenter = useCallback(async () => {
    await presentRevenueCatCustomerCenter();
    await refreshCustomerInfo();
  }, [refreshCustomerInfo]);

  const value = useMemo(
    () => ({
      isAvailable,
      isConfigured,
      isLoading,
      error,
      customerInfo,
      currentOffering,
      hasTandemPro: hasTandemProEntitlement(customerInfo),
      refreshCustomerInfo,
      refreshOffering,
      presentPaywall,
      presentPaywallIfNeeded,
      purchaseProduct,
      restorePurchases,
      presentCustomerCenter,
    }),
    [
      isAvailable,
      isConfigured,
      isLoading,
      error,
      customerInfo,
      currentOffering,
      refreshCustomerInfo,
      refreshOffering,
      presentPaywall,
      presentPaywallIfNeeded,
      purchaseProduct,
      restorePurchases,
      presentCustomerCenter,
    ]
  );

  return (
    <RevenueCatContext.Provider value={value}>
      {children}
    </RevenueCatContext.Provider>
  );
};

export const useRevenueCatContext = () => {
  const context = useContext(RevenueCatContext);
  if (!context) {
    throw new Error(
      'useRevenueCatContext must be used within RevenueCatProvider'
    );
  }
  return context;
};
