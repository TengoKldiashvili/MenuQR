export const LIMITS = {
  // existing limits
  FREE_MENU_LIMIT: 10,
  FREE_CATEGORY_LIMIT: 10,
  FREE_ITEM_LIMIT: 50,

  // resend
  RESEND_CODE_COOLDOWN_SECONDS: 60,

  // verify email
  VERIFY_EMAIL_CODE_TTL_MINUTES: 10,
  VERIFY_EMAIL_MAX_ATTEMPTS: 5,
  VERIFY_EMAIL_MAX_SENDS: 3,

  // reset password
  PASSWORD_RESET_CODE_TTL_MINUTES: 10,
  PASSWORD_RESET_MAX_ATTEMPTS: 5,
  FORGOT_PASSWORD_MAX_SENDS: 3,

  //blocked user for wrong email or password not ip lock
  BLOCKED_USER: 5,
  TIME_BLOCKED_USER:5
} as const;
