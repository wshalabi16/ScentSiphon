// Environment variable validation
const requiredEnvVars = [
  'MONGODB_URI',
  'STRIPE_SK',
  'STRIPE_WEBHOOK_SECRET',
  // 'NEXT_PUBLIC_STRIPE_PK',  // TODO: Uncomment when ready for production
  'PUBLIC_URL',  // Needed for Stripe redirects
  'NEXT_PUBLIC_RECAPTCHA_SITE_KEY',
  'RECAPTCHA_SECRET_KEY',
];

export function validateEnv() {
  const missing = [];

  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.map(v => `  - ${v}`).join('\n')}\n\nPlease check your .env file.`
    );
  }

  console.log('✅ All required environment variables are present');
}