
import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { JobProvider } from '@/contexts/JobContext';
import { toast } from '@/components/ui/use-toast';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <JobProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </JobProvider>
  );
};

export default Layout;
