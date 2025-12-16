// composables/useToast.js
import { getCurrentInstance } from 'vue';

export function useToast() {
  const instance = getCurrentInstance();

  if (!instance) {
    console.error('useToast must be called within setup()');
    return null;
  }

  // Tìm Toast component trong app
  const findToastComponent = () => {
    let parent = instance.parent;
    while (parent) {
      if (parent.refs?.toastNotification) {
        return parent.refs.toastNotification;
      }
      parent = parent.parent;
    }

    // Tìm trong root
    const root = instance.appContext.app._instance;
    if (root && root.refs?.toastNotification) {
      return root.refs.toastNotification;
    }

    return null;
  };

  const toast = findToastComponent();

  if (!toast) {
    console.error('ToastNotification component not found');
    return {
      success: (msg) => console.log('[Toast Success]', msg),
      error: (msg) => console.error('[Toast Error]', msg),
      warning: (msg) => console.warn('[Toast Warning]', msg),
      info: (msg) => console.info('[Toast Info]', msg),
    };
  }

  return {
    success: (message, duration = 3000) => toast.success(message, duration),
    error: (message, duration = 3000) => toast.error(message, duration),
    warning: (message, duration = 3000) => toast.warning(message, duration),
    info: (message, duration = 3000) => toast.info(message, duration),
  };
}
