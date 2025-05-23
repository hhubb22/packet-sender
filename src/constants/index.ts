import { AppView, NavItem, NetworkInterface } from '../types';

export const NAV_ITEMS: NavItem[] = [
  { name: 'Server', view: AppView.SERVER_SELECTION },
  { 
    name: 'Interface', 
    view: AppView.INTERFACE_SELECTION, 
    disabled: (serverConnected, _) => !serverConnected 
  },
  { 
    name: 'Editor', 
    view: AppView.PACKET_EDITOR,
    disabled: (_, interfaceSelected) => !interfaceSelected
  },
  { name: 'Logs', view: AppView.LOGS },
];

export const MOCK_INTERFACES: NetworkInterface[] = [
  { id: 'eth0', name: 'eth0', description: 'Ethernet interface (e.g., 1Gbps)' },
  { id: 'wlan0', name: 'wlan0', description: 'Wireless LAN interface (e.g., Wi-Fi 6)' },
  { id: 'lo', name: 'lo', description: 'Loopback interface (127.0.0.1)' },
  { id: 'ppp0', name: 'ppp0', description: 'Point-to-Point Protocol (e.g., VPN)' },
];

export const MOCK_PACKETS_PER_PAGE = 10;