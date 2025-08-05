import { Html, Head, Main, NextScript } from 'next/document'
import Document, { DocumentContext } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang="vi">
        <Head>
          <meta charSet="utf-8" />
          {/* Removed viewport meta tag as it should only be in _app.tsx */}
          <meta name="theme-color" content="#f97316" />

          {/* Preconnect to improve font loading */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

          {/* App icons */}
  <link rel="icon" href="/favicon.ico" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />


          {/* PWA manifest */}
          <link rel="manifest" href="/manifest.json" />
        </Head>
        <body className="bg-gray-50">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument