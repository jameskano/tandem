'./App.css';
import { RouterProvider } from 'react-router-dom';
import QueryProvider from './shared/providers/QueryProvider';
import ThemeProvider from './shared/providers/ThemeProvider';
import { router } from './app/routes';
import { AuthProvider } from './store/context/AuthProvider';

const App = () => {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
};

export default App;
