import StyledComponentsRegistry from './registry';
import GlobalStyles from '@/components/GlobalStyles';
import { CartContextProvider } from '@/components/CartContext';  
import { Playfair_Display, Inter } from "next/font/google";

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
          <CartContextProvider>  
            <GlobalStyles />
            {children}
          </CartContextProvider>  
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}