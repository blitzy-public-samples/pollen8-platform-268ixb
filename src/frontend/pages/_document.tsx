import Document, { Html, Head, Main, NextScript, DocumentContext, DocumentInitialProps } from 'next/document';
import React from 'react';

/**
 * CustomDocument class to augment the application's <html> and <body> tags
 * Requirement addressed: Custom Document
 * Location: Technical specification/2. SYSTEM ARCHITECTURE/2.3 COMPONENT DIAGRAMS/2.3.1 Frontend Components
 */
class CustomDocument extends Document {
  /**
   * Asynchronous function to fetch initial props for the document
   * @param ctx - DocumentContext provided by Next.js
   * @returns Promise<DocumentInitialProps> - Initial props for the document
   */
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    // Call the original Document.getInitialProps
    const initialProps = await Document.getInitialProps(ctx);

    // Custom logic for initial props can be added here if needed in the future

    return initialProps;
  }

  /**
   * Renders the custom Document structure
   * @returns JSX.Element - The rendered Document structure
   */
  render(): JSX.Element {
    return (
      <Html lang="en">
        <Head>
          {/* Meta tags for SEO optimization */}
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" content="Pollen8 - Professional Networking Platform" />

          {/* Link to Proxima Nova font */}
          <link
            href="https://use.typekit.net/your-project-id.css"
            rel="stylesheet"
          />

          {/* Include global styles for black and white theme */}
          <style>{`
            body {
              background-color: #000000;
              color: #FFFFFF;
              font-family: 'Proxima Nova', sans-serif;
            }
          `}</style>

          {/* Favicon */}
          <link rel="icon" href="/favicon.ico" />

          {/* You can add initialization for analytics tools here */}
          {/* Example: <script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_GA_ID"></script> */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default CustomDocument;