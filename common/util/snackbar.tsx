import { VariantType, useSnackbar } from "notistack";

function ShowSnackbar(variant: VariantType, message: string): void {
  const { enqueueSnackbar } = useSnackbar();
  enqueueSnackbar(message, { variant });
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
