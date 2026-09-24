export interface DashboardCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  action: string;
  disabled?: boolean;
}
