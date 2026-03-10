import { toast as muiToast } from 'sonner'

export const toast = {
  success: (message) => muiToast.success(message),
  error: (message) => muiToast.error(message),
  info: (message) => muiToast.info(message),
  warning: (message) => muiToast.warning(message),
}
