import { Box } from "@material-ui/core";
import { useSnackbar, ProviderContext, VariantType } from "notistack";

function ShowSnackbar(variant: VariantType, message: string): void {
  snackbarContext.enqueueSnackbar(message, { variant });
}

export function CloseSnackbar(key: string | number): void {
  snackbarContext.closeSnackbar(key);
}

export function ShowCustomSnackbar(
  createSnackbarElement: (key: string | number) => JSX.Element,
  key?: string | number
): void {
  snackbarContext.enqueueSnackbar("asdf", {
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

export function ShowSuccessSnackbar(message: string): void {
  ShowSnackbar("success", message);
}

export function ShowWarningSnackbar(message: string): void {
  ShowSnackbar("warning", message);
}

export function ShowErrorSnackbar(message: string): void {
  ShowSnackbar("error", message);
}

export function ShowInfoSnackbar(message: string): void {
  ShowSnackbar("info", message);
}

let snackbarContext: ProviderContext;

function GlobalSnackbar(): JSX.Element {
  snackbarContext = useSnackbar();
  return <Box />;
}

export default GlobalSnackbar;
