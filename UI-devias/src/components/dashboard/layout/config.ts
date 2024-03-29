import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';


export const getNavItems = (userRole: string): NavItemConfig[] => {
  let navItems: NavItemConfig[] = [];

  if (userRole === 'admin') {
    navItems = [
      { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
      { key: 'route', title: 'Route', href: paths.dashboard.route, icon: 'route' },
    ];
  } else if (userRole === 'client') {
    navItems = [
      { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
    ];
  }else if (userRole === 'driver') {
    navItems = [
      { key: 'drivers', title: 'Drivers', href: paths.dashboard.drivers, icon: 'user' },
    ];
  }

  return navItems;
};
