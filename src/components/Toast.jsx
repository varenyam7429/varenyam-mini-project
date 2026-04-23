import React from 'react';
import { useApp } from '../context/AppContext';

const Toast = () => {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div className="toast">
      {toast}
    </div>
  );
};

export default Toast;
