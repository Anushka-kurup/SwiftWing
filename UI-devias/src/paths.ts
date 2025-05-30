export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard/status',
    account: '/dashboard/account',
    customers: '/dashboard/customers',
    integrations: '/dashboard/integrations',
    settings: '/dashboard/settings',
    route: '/dashboard/route',
    drivers: '/dashboard/drivers',
    test: '/test',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
