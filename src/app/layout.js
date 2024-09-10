import './globals.css';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';

export const metadata = {
  title: 'My Chatbot App',
  description: 'A simple chatbot application',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <Layout>{children}</Layout>
        </ThemeProvider>
      </body>
    </html>
  );
}