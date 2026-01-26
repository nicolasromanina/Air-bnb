import React from 'react';

interface ModalProps {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 text-black dark:text-white rounded-lg shadow-lg w-11/12 max-w-lg p-6">
        {title && <h3 className="text-lg font-semibold text-pink-600 mb-3">{title}</h3>}
        <div>{children}</div>
        <div className="mt-4 text-right">
          <button className="px-3 py-2 bg-gray-200 rounded mr-2" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
