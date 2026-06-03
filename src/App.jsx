import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/lib/AuthContext';
import { I18nProvider } from '@/lib/i18n';
import { GameProvider } from '@/lib/gameContext';
import GameRouter from '@/pages/GameRouter';

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <I18nProvider>
          <GameProvider>
            <Router>
              <Routes>
                <Route path="*" element={<GameRouter />} />
              </Routes>
            </Router>
            <Toaster />
          </GameProvider>
        </I18nProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App