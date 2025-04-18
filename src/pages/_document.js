import { Html, Head, Main, NextScript } from 'next/document'
require('dotenv').config();

export default function Document() {
  return (
    <Html lang="en">
      <Head/>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
