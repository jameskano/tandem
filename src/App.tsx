 './App.css'
import { RouterProvider } from 'react-router-dom'
import QueryProvider from './shared/providers/QueryProvider'
import ThemeProvider from './shared/providers/ThemeProvider'
import { router } from './app/routes'

function App() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryProvider>
  )
}

export default App
