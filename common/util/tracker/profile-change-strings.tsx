/** A helper type which encompasses the display values of various components in the profile change approval snackbar. */
export type ProfileChangeStrings = {
  headline: string;
  instruction: string;
  keepRadioText: string;
  approveRadioText: string;
  approveButtonText: string;
};

/**
 * Defines the display values for the case when the user modified a local version of their profile.
 * @returns The display values to show in the profile change snackbar.
 */
export function OutgoingProfileChangeStrings(
  requiresApproval: boolean
): ProfileChangeStrings {
  return {
    headline: "Changes in a local profile detected",
    instruction: requiresApproval
      ? "Would you like to update the following field(s) in your Pod as well?"
      : "The following updates are sent to the guest automatically",
    keepRadioText: "Hide",
    approveRadioText: "Send",
    approveButtonText: "Send selected",
  };
}

/**
 * Defines the display values for the case when the counterparty modified a field in their own version of the profile.
 * @returns The display values to show in the profile change snackbar.
 */
export function IncomingProfileChangeStrings(): ProfileChangeStrings {
  return {
    headline: "Changes in a remote profile detected",
    instruction:
      "Would you like to update the following field(s) in your Pod as well?",
    keepRadioText: "Keep",
    approveRadioText: "Update",
    approveButtonText: "Update selected",
  };
}
