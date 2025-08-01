// Pages - App configuration với NextJS
import { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import '../src/styles/globals.css';
import '../src/styles/variables.css'; // Import custom CSS variables


function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default appWithTranslation(MyApp);
