import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { ChartPie as ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { Footprints } from '@phosphor-icons/react/dist/ssr/Footprints';
import { GearSix as GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { PlugsConnected as PlugsConnectedIcon } from '@phosphor-icons/react/dist/ssr/PlugsConnected';
import { Table as TableIcon } from '@phosphor-icons/react/dist/ssr/Table';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { Van as VanIcon } from '@phosphor-icons/react/dist/ssr/Van';
import { XSquare } from '@phosphor-icons/react/dist/ssr/XSquare';

export const navIcons = {
  'chart-pie': ChartPieIcon,
  'gear-six': GearSixIcon,
  'plugs-connected': PlugsConnectedIcon,
  'x-square': XSquare,
  'table-icon': TableIcon,
  'van-icon': VanIcon,
  route: Footprints,
  user: UserIcon,
  users: UsersIcon,
} as Record<string, Icon>;
