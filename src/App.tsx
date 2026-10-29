// Mapa de navegación (sección 01). HashRouter: funciona igual en navegador y dentro de Capacitor.
import { createHashRouter, Navigate, RouterProvider } from 'react-router';
import { Home } from './screens/Home';
import { Players } from './screens/Players';
import { Settings } from './screens/Settings';
import { ImpostorGame } from './screens/ImpostorGame';
import { ImpostorVote } from './screens/ImpostorVote';
import { ImpostorResults } from './screens/ImpostorResults';
import { TruthOrDare } from './screens/TruthOrDare';
import { NeverHaveI } from './screens/NeverHaveI';

export const router = createHashRouter([
  { path: '/', element: <Home /> },
  { path: '/jugadores', element: <Players /> },
  { path: '/ajustes', element: <Settings /> },
  { path: '/impostor', element: <ImpostorGame /> },
  { path: '/impostor/votacion', element: <ImpostorVote /> },
  { path: '/impostor/resultados', element: <ImpostorResults /> },
  { path: '/verdad-o-reto', element: <TruthOrDare /> },
  { path: '/yo-nunca', element: <NeverHaveI /> },
  { path: '*', element: <Navigate to="/" replace /> },
]);

export function App() {
  return <RouterProvider router={router} />;
}
