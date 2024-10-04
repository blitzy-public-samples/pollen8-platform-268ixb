import React from 'react';
import Link from 'next/link';
import { Button } from '../UI/Button';

/**
 * Footer component for the Pollen8 platform.
 * This component is part of the layout structure and provides a consistent footer across all pages.
 * 
 * Requirements addressed:
 * 1. Consistent Layout
 *    Location: Technical specification/1.1 System Objectives/Visual Network Management
 *    Description: Provide a consistent footer across all pages
 */

const Footer: React.FC = () => {
  // Since we don't have access to the actual useTranslation hook, we'll use a placeholder function
  const t = (key: string) => key; // This should be replaced with the actual translation function

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-auto mb-4 md:mb-0">
            <p className="text-sm">
              &copy; {currentYear} Pollen8. {t('footer.allRightsReserved')}
            </p>
          </div>
          <nav className="w-full md:w-auto">
            <ul className="flex flex-wrap justify-center md:justify-end">
              <li className="mx-2 my-1">
                <Link href="/about" passHref>
                  <Button variant="outline" size="small">
                    {t('footer.about')}
                  </Button>
                </Link>
              </li>
              <li className="mx-2 my-1">
                <Link href="/privacy" passHref>
                  <Button variant="outline" size="small">
                    {t('footer.privacy')}
                  </Button>
                </Link>
              </li>
              <li className="mx-2 my-1">
                <Link href="/terms" passHref>
                  <Button variant="outline" size="small">
                    {t('footer.terms')}
                  </Button>
                </Link>
              </li>
              <li className="mx-2 my-1">
                <Link href="/contact" passHref>
                  <Button variant="outline" size="small">
                    {t('footer.contact')}
                  </Button>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);