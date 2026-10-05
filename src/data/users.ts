// Public demo credentials for saucedemo.com. Overridable via env for other environments.
const PASSWORD = process.env.APP_PASSWORD ?? 'secret_sauce';

export const users = {
  standard: { username: 'standard_user', password: PASSWORD },
  lockedOut: { username: 'locked_out_user', password: PASSWORD },
  problem: { username: 'problem_user', password: PASSWORD },
  performanceGlitch: { username: 'performance_glitch_user', password: PASSWORD },
  invalid: { username: 'not_a_user', password: 'wrong_password' },
} as const;

export type User = { username: string; password: string };
