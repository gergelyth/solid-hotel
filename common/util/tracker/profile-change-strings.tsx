export type ProfileChangeStrings = {
  headline: string;
  instruction: string;
  keepRadioText: string;
  approveRadioText: string;
  approveButtonText: string;
};

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
