// App.jsx
import { useVisitorLogger } from './hooks/useVisitorLogger.tsx';

export default function App() {
  
  useVisitorLogger(); // вызываешь один раз на входе
  return <div>...</div>;
}