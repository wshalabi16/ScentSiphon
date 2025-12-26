import StyledComponentsRegistry from './registry';
import GlobalStyles from '@/components/GlobalStyles';
import { CartContextProvider } from '@/components/CartContext';
import RootErrorBoundary from '@/components/RootErrorBoundary';
import { Playfair_Display, Inter } from "next/font/google";
import { validateEnv } from '@/lib/env';

// Validate environment variables at startup
if (typeof window === 'undefined') {
  validateEnv();
}

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Scent Siphon",
  description: "Premium Perfume Decants",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable}`}>
        <StyledComponentsRegistry>
          <RootErrorBoundary>
            <CartContextProvider>
              <GlobalStyles />
              {children}
            </CartContextProvider>
          </RootErrorBoundary>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}