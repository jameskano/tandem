import { Capacitor } from '@capacitor/core';
import {
  LOG_LEVEL,
  PACKAGE_TYPE,
  Purchases,
  type CustomerInfo,
  type PurchasesOffering,
  type PurchasesPackage,
} from '@revenuecat/purchases-capacitor';
import {
  PAYWALL_RESULT,
  RevenueCatUI,
  PaywallPresentationConfiguration,
  type PaywallListener,
} from '@revenuecat/purchases-capacitor-ui';

export const REVENUECAT_API_KEY = 'test_JJdGJlhkfbKcnqyXUwwFLRrZNmU';
export const TANDEM_PRO_ENTITLEMENT_ID = 'Tandem Pro';

export const REVENUECAT_PRODUCTS = {
  yearly: 'yearly',
  monthly: 'monthly',
} as const;

export type RevenueCatProductKey = keyof typeof REVENUECAT_PRODUCTS;

let configurePromise: Promise<void> | null = null;

export const isRevenueCatAvailable = () => Capacitor.isNativePlatform();

export const hasTandemProEntitlement = (customerInfo: CustomerInfo | null) =>
  Boolean(customerInfo?.entitlements.active[TANDEM_PRO_ENTITLEMENT_ID]);

export const getTandemProEntitlement = (customerInfo: CustomerInfo | null) =>
  customerInfo?.entitlements.active[TANDEM_PRO_ENTITLEMENT_ID] ?? null;

export const getRevenueCatErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null) {
    const maybeError = error as { message?: unknown; code?: unknown };
    if (typeof maybeError.message === 'string') {
      return maybeError.message;
    }
    if (typeof maybeError.code === 'string') {
      return maybeError.code;
    }
  }

  return 'RevenueCat request failed.';
};

const identifyRevenueCatUser = async (appUserID: string) => {
  const { appUserID: currentAppUserID } = await Purchases.getAppUserID();

  if (currentAppUserID !== appUserID) {
    await Purchases.logIn({ appUserID });
  }
};

export const configureRevenueCat = async (appUserID?: string | null) => {
  if (!isRevenueCatAvailable()) {
    return;
  }

  if (!configurePromise) {
    configurePromise = (async () => {
      const { isConfigured } = await Purchases.isConfigured();

      if (!isConfigured) {
        await Purchases.setLogLevel({
          level: import.meta.env.DEV ? LOG_LEVEL.DEBUG : LOG_LEVEL.INFO,
        });
        await Purchases.configure({
          apiKey: REVENUECAT_API_KEY,
          appUserID: appUserID ?? null,
          shouldShowInAppMessagesAutomatically: true,
        });
      }
    })();
  }

  await configurePromise;

  if (appUserID) {
    await identifyRevenueCatUser(appUserID);
  }
};

export const logOutRevenueCat = async () => {
  if (!isRevenueCatAvailable()) {
    return null;
  }

  await configureRevenueCat();

  const { isAnonymous } = await Purchases.isAnonymous();
  if (isAnonymous) {
    return null;
  }

  const { customerInfo } = await Purchases.logOut();
  return customerInfo;
};

export const getRevenueCatCustomerInfo = async () => {
  await configureRevenueCat();
  const { customerInfo } = await Purchases.getCustomerInfo();
  return customerInfo;
};

export const getRevenueCatOfferings = async () => {
  await configureRevenueCat();
  return Purchases.getOfferings();
};

export const getCurrentRevenueCatOffering = async () => {
  const offerings = await getRevenueCatOfferings();
  return offerings.current;
};

const findPackageByProduct = (
  offering: PurchasesOffering,
  productKey: RevenueCatProductKey
) => {
  const productIdentifier = REVENUECAT_PRODUCTS[productKey];
  const expectedPackageType =
    productKey === 'yearly' ? PACKAGE_TYPE.ANNUAL : PACKAGE_TYPE.MONTHLY;

  return (
    offering.availablePackages.find(
      item =>
        item.identifier === productIdentifier ||
        item.product.identifier === productIdentifier
    ) ??
    offering.availablePackages.find(item => item.packageType === expectedPackageType) ??
    null
  );
};

export const getRevenueCatPackage = async (
  productKey: RevenueCatProductKey
): Promise<PurchasesPackage | null> => {
  const offering = await getCurrentRevenueCatOffering();

  if (!offering) {
    return null;
  }

  if (productKey === 'yearly') {
    return offering.annual ?? findPackageByProduct(offering, productKey);
  }

  return offering.monthly ?? findPackageByProduct(offering, productKey);
};

export const purchaseRevenueCatPackage = async (
  productKey: RevenueCatProductKey
) => {
  const revenueCatPackage = await getRevenueCatPackage(productKey);

  if (!revenueCatPackage) {
    throw new Error(`RevenueCat package not found: ${productKey}`);
  }

  const result = await Purchases.purchasePackage({
    aPackage: revenueCatPackage,
  });

  return result.customerInfo;
};

export const restoreRevenueCatPurchases = async () => {
  await configureRevenueCat();
  const { customerInfo } = await Purchases.restorePurchases();
  return customerInfo;
};

export const presentTandemProPaywall = async (
  listener?: PaywallListener
) => {
  await configureRevenueCat();

  const { result } = await RevenueCatUI.presentPaywall({
    displayCloseButton: true,
    presentationConfiguration: PaywallPresentationConfiguration.DEFAULT,
    listener,
  });

  return result;
};

export const presentTandemProPaywallIfNeeded = async (
  listener?: PaywallListener
) => {
  await configureRevenueCat();

  const { result } = await RevenueCatUI.presentPaywallIfNeeded({
    requiredEntitlementIdentifier: TANDEM_PRO_ENTITLEMENT_ID,
    displayCloseButton: true,
    presentationConfiguration: PaywallPresentationConfiguration.DEFAULT,
    listener,
  });

  return result;
};

export const didPaywallUnlockEntitlement = (result: PAYWALL_RESULT) =>
  result === PAYWALL_RESULT.PURCHASED ||
  result === PAYWALL_RESULT.RESTORED ||
  result === PAYWALL_RESULT.NOT_PRESENTED;

export const presentRevenueCatCustomerCenter = async () => {
  await configureRevenueCat();
  await RevenueCatUI.presentCustomerCenter();
};
