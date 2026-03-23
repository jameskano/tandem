'./App.css';
import { RouterProvider } from 'react-router-dom';
import QueryProvider from './shared/providers/QueryProvider';
import ThemeProvider from './shared/providers/ThemeProvider';
import { router } from './app/routes';
import { AuthProvider } from './store/context/AuthProvider';
import { Settings } from 'lucide-react';
import { SettingsProvider } from './store/context/SettingsProvider';

const App = () => {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <SettingsProvider>
            <RouterProvider router={router} />
          </SettingsProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
};

export default App;
