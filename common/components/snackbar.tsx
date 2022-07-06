import { Box } from "@material-ui/core";
import { useSnackbar, ProviderContext, VariantType } from "notistack";

/**
 * Displays a snackbar with the passed properties.
 */
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

/**
 * Closes a snackbar currently displayed.
 */
export function CloseSnackbar(key: string | number): void {
  snackbarContext.closeSnackbar(key);
}

/**
 * Creates a snackbar (with custom properties) in the bottom right corner (usually to indicate that an important operation is going on in the background).
 */
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

/**
 * Shows a success snackbar to the user (green color) to indicate that something finished successfully.
 * Optionally closes the corresponding info snackbar.
 */
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

/**
 * Shows an error snackbar to the user (red color) to signal that something went wrong.
 */
export function ShowErrorSnackbar(
  message: string,
  persist = false,
  preventDuplicate = false,
  key?: string
): void {
  ShowSnackbar("error", message, persist, preventDuplicate, key);
}

/**
 * Shows an info snackbar to the user (blue color).
 */
export function ShowInfoSnackbar(message: string, persist = false): () => void {
  ShowSnackbar("info", message, persist, false, message);
  return () => CloseSnackbar(message);
}

let snackbarContext: ProviderContext;

/**
 * A placeholder element providing the option to add snackbars to the page.
 * @returns An empty Box element.
 */
export function GlobalSnackbar(): JSX.Element {
  snackbarContext = useSnackbar();
  return <Box />;
}
