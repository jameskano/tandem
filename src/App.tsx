'./App.css';
import { RouterProvider } from 'react-router-dom';
import ToastViewport from './components/ToastViewport';
import QueryProvider from './shared/providers/QueryProvider';
import ThemeProvider from './shared/providers/ThemeProvider';
import { router } from './app/routes';
import { AuthProvider } from './store/context/AuthProvider';
import { SettingsProvider } from './store/context/SettingsProvider';

const App = () => {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <SettingsProvider>
            <RouterProvider router={router} />
            <ToastViewport />
          </SettingsProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
};

export default App;
