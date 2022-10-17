import '../styles/globals.css';
import Script from "next/script";
import type { AppProps } from 'next/app';
import { ThemeProvider } from "next-themes";
import { Navbar, Footer } from '../components';

function MyApp({ Component, pageProps }: AppProps) {
  return <ThemeProvider attribute='class'>
    <div className='dark:bg-nft-dark bg-white min-h-screen'>
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </div>
    <Script src="https://kit.fontawesome.com/36c479c05f.js" crossorigin="anonymous" />
  </ThemeProvider>
 
  
}

export default MyApp
