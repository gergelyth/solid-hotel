import { Dispatch, SetStateAction, useState } from "react";

export function SetGlobalDialog(innerDialog: JSX.Element | null): void {
  setGlobalDialog(innerDialog);
}

let setGlobalDialog: Dispatch<SetStateAction<JSX.Element | null>>;

function GlobalDialog(): JSX.Element | null {
  const [currentDialog, setDialog] = useState<JSX.Element | null>(null);
  setGlobalDialog = setDialog;

  return currentDialog;
}

export default GlobalDialog;
