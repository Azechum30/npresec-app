/**
 * Email batch processing configuration
 */
export const EMAIL_BATCH_CONFIG = {
  BATCH_SIZE: 10,
  BATCH_DELAY: 1000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 2000,
} as const;

/**
 * Get batch configuration from environment or use defaults
 */
export const getEmailBatchConfig = () => {
  return {
    batchSize: parseInt(
      process.env.EMAIL_BATCH_SIZE || EMAIL_BATCH_CONFIG.BATCH_SIZE.toString(),
    ),
    batchDelay: parseInt(
      process.env.EMAIL_BATCH_DELAY ||
        EMAIL_BATCH_CONFIG.BATCH_DELAY.toString(),
    ),
    maxRetries: parseInt(
      process.env.EMAIL_MAX_RETRIES ||
        EMAIL_BATCH_CONFIG.MAX_RETRIES.toString(),
    ),
    retryDelay: parseInt(
      process.env.EMAIL_RETRY_DELAY ||
        EMAIL_BATCH_CONFIG.RETRY_DELAY.toString(),
    ),
  };
};
