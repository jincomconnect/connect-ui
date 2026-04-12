import { RouterProvider } from 'react-router';
import { router } from './routes';
import { SidebarProvider } from './context/SidebarContext';
import * as Tooltip from '@radix-ui/react-tooltip';

export default function App() {
  return (
    <Tooltip.Provider delayDuration={300}>
      <SidebarProvider>
        <RouterProvider router={router} />
      </SidebarProvider>
    </Tooltip.Provider>
  );
}
