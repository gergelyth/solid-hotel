import { Box } from "@material-ui/core";
import { useSnackbar, ProviderContext, VariantType } from "notistack";

function ShowSnackbar(
  variant: VariantType,
  message: string,
  persist = false,
  preventDuplicate = false,
  key?: string
): void {
  snackbarContext.enqueueSnackbar(message, {
    variant,
    persist: persist,
    preventDuplicate: preventDuplicate,
    key: key,
  });
}

export function CloseSnackbar(key: string | number): void {
  snackbarContext.closeSnackbar(key);
}

export function ShowCustomSnackbar(
  createSnackbarElement: (key: string | number) => JSX.Element,
  key?: string | number
): void {
  snackbarContext.enqueueSnackbar("NoMessage", {
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "right",
    },
    content: (key) => {
      return createSnackbarElement(key);
    },
    persist: true,
    key: key,
  });
}

export function ShowSuccessSnackbar(
  message: string,
  closeInfoSnackbar?: () => void
): void {
  if (closeInfoSnackbar) {
    closeInfoSnackbar();
  }
  ShowSnackbar("success", message);
}

export function ShowWarningSnackbar(message: string): void {
  ShowSnackbar("warning", message);
}

export function ShowErrorSnackbar(
  message: string,
  persist = false,
  preventDuplicate = false,
  key?: string
): void {
  ShowSnackbar("error", message, persist, preventDuplicate, key);
}

export function ShowInfoSnackbar(message: string, persist = false): () => void {
  ShowSnackbar("info", message, persist, false, message);
  return () => CloseSnackbar(message);
}

let snackbarContext: ProviderContext;

function GlobalSnackbar(): JSX.Element {
  snackbarContext = useSnackbar();
  return <Box />;
}

export default GlobalSnackbar;
