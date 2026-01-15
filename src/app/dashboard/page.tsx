import { DashboardProvider } from '@/components/dashboard/DashboardProvider';
import { DashboardView } from '@/components/dashboard/DashboardView';

export default function DashboardPage() {
  return (
    <DashboardProvider>
      <DashboardView />
    </DashboardProvider>
  );
}
