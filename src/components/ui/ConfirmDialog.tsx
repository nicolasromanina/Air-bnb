import React from 'react';
import Modal from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title = 'Confirmer',
  description,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal isOpen={isOpen} title={title} onClose={onCancel}>
      {description && <p className="text-sm text-gray-700 dark:text-gray-300">{description}</p>}
      <div className="mt-4 flex justify-end gap-2">
        <button onClick={onCancel} className="px-3 py-2 bg-gray-200 rounded">{cancelLabel}</button>
        <button onClick={onConfirm} className="px-3 py-2 bg-pink-600 text-white rounded">{confirmLabel}</button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
