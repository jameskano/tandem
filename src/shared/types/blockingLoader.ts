export type BlockingLoader = {
  id: string;
  message?: string;
  delay: number;
  visible: boolean;
  createdAt: number;
};

export type ShowBlockingLoaderInput = {
  message?: string;
  delay?: number;
};
