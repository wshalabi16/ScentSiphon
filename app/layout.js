import { Playfair_Display, Inter } from "next/font/google";
import StyledComponentsRegistry from './registry';
import GlobalStyles from '@/components/GlobalStyles';

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
  title: "Scent Siphon - Premium Perfume Decants",
  description: "Discover luxury fragrances in convenient decant sizes. Niche, designer, and Middle Eastern perfumes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable}`}>
        <StyledComponentsRegistry>
          <GlobalStyles />
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}