import type {RouteConfig} from '@react-navigation/native';

type MenuItem = {
  position: 'LEFT' | 'RIGHT' | 'CIRCLE' | 'CENTER';
};
type RouteConfigComponent = RouteConfig<any, any, any, any, any, any>;

export type ScreenBottomBarProps = RouteConfigComponent & MenuItem;
