import { ThemeProvider } from './src/theme/ThemeProvider';
import Home from './src/pages/Home';

export default function App() {
  return (
    <ThemeProvider>
      <Home />
    </ThemeProvider>
  );
}
