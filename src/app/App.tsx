import { RouterProvider } from 'react-router';
import { router } from './routes';
import { SidebarProvider } from './context/SidebarContext';
import { AuthProvider } from './context/AuthContext';
import * as Tooltip from '@radix-ui/react-tooltip';

export default function App() {
  return (
    <Tooltip.Provider delayDuration={300}>
      <AuthProvider>
        <SidebarProvider>
          <RouterProvider router={router} />
        </SidebarProvider>
      </AuthProvider>
    </Tooltip.Provider>
  );
}
