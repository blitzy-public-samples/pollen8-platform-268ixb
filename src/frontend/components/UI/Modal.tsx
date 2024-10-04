import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import Button from './Button';
import theme from '../../shared/styles/theme';

/**
 * This file contains a reusable Modal component for the Pollen8 platform's user interface.
 * It provides a customizable overlay for displaying content on top of the main page.
 *
 * Requirements addressed:
 * 1. Minimalist Design
 *    Location: Technical specification/1.2 Scope/Product Overview
 *    Description: Implements a black and white aesthetic for UI components
 * 
 * 2. Responsive Layout
 *    Location: Implied from modern web development standards
 *    Description: Ensures the modal is responsive and works well on various screen sizes
 */

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${theme.zIndex.modal};
`;

const ModalContent = styled.div`
  background-color: ${theme.palette.common.white};
  padding: ${theme.spacing(4)};
  border-radius: ${theme.shape.borderRadius};
  max-width: 90%;
  max-height: 90%;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing(3)};
`;

const ModalTitle = styled.h2`
  font-size: ${theme.typography.h2.fontSize};
  font-weight: ${theme.typography.h2.fontWeight};
  color: ${theme.palette.text.primary};
  margin: 0;
`;

const CloseButton = styled(Button)`
  position: absolute;
  top: ${theme.spacing(2)};
  right: ${theme.spacing(2)};
`;

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <ModalOverlay onClick={handleClickOutside}>
      <ModalContent
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        <ModalHeader>
          {title && <ModalTitle id="modal-title">{title}</ModalTitle>}
          <CloseButton
            variant="secondary"
            size="small"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </CloseButton>
        </ModalHeader>
        {children}
      </ModalContent>
    </ModalOverlay>,
    document.body
  );
};

export default React.memo(Modal);