import React from "react";
import { render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PrivacyToken } from "../../types/PrivacyToken";
import { PrivacyDashboard } from "../privacy-dashboard";
import { ReservationState } from "../../types/ReservationState";

const testPrivacyTokens: PrivacyToken[] = [
  {
    urlAtHotel: "TestUrl1",
    fieldList: ["foaf:firstName", "foaf:lastName"],
    reason: "TestReason1",
    forReservationState: ReservationState.CONFIRMED,
    expiry: new Date("2021-11-23"),
  },
  {
    urlAtHotel: "TestUrl2",
    fieldList: ["schema:email"],
    reason: "TestReason2",
    forReservationState: ReservationState.ACTIVE,
    expiry: new Date("2021-11-25"),
  },
  {
    urlAtHotel: "TestUrl3",
    fieldList: ["schema:phone"],
    reason: "TestReason2",
    forReservationState: ReservationState.ACTIVE,
    expiry: new Date("2021-11-29"),
  },
];

const privacyTokenRetrieval = {
  items: testPrivacyTokens,
  isLoading: false,
  isError: false,
};

function Render(
  tokenGrouping: (token: PrivacyToken) => string,
  deleteButton: (token: PrivacyToken) => JSX.Element | null
): RenderResult {
  return render(
    <PrivacyDashboard
      retrieval={privacyTokenRetrieval}
      tokenGrouping={tokenGrouping}
      deleteButton={deleteButton}
    />
  );
}

describe("<PrivacyDashboard />", () => {
  test("Renders correctly", async () => {
    const privacyDashboardComponent = Render(
      () => "Ungrouped",
      () => null
    );
    expect(privacyDashboardComponent).toBeDefined();
  });

  test("Token grouping behaves correctly", async () => {
    const privacyDashboardComponent = render(
      <PrivacyDashboard
        retrieval={privacyTokenRetrieval}
        tokenGrouping={(token) => token.reason}
        deleteButton={() => null}
      />
    );
    expect(privacyDashboardComponent).toBeDefined();

    const counterpartyBoxes =
      privacyDashboardComponent.queryAllByTestId("counterparty-box");

    const reason1 = counterpartyBoxes[0];
    expect(reason1.innerHTML.includes("TestReason1")).toBeTruthy();
    expect(reason1.innerHTML.includes("foaf:firstName")).toBeTruthy();
    expect(reason1.innerHTML.includes("foaf:lastName")).toBeTruthy();

    expect(reason1.innerHTML.includes("schema:email")).toBeFalsy();
    expect(reason1.innerHTML.includes("schema:phone")).toBeFalsy();

    const reason2 = counterpartyBoxes[1];
    expect(reason2.innerHTML.includes("TestReason2")).toBeTruthy();
    expect(reason2.innerHTML.includes("schema:email")).toBeTruthy();
    expect(reason2.innerHTML.includes("schema:phone")).toBeTruthy();

    expect(reason2.innerHTML.includes("foaf:firstName")).toBeFalsy();
    expect(reason2.innerHTML.includes("foaf:lastName")).toBeFalsy();
  });

  test("Delete button renders only for selected tokens", async () => {
    const deleteButtonString = "DeleteButton";

    const createDeleteButton = (token: PrivacyToken): JSX.Element | null => {
      if (token.forReservationState === ReservationState.ACTIVE) {
        return <>{deleteButtonString}</>;
      } else {
        return null;
      }
    };

    const privacyDashboardComponent = render(
      <PrivacyDashboard
        retrieval={privacyTokenRetrieval}
        tokenGrouping={() => "Ungrouped"}
        deleteButton={createDeleteButton}
      />
    );
    expect(privacyDashboardComponent).toBeDefined();

    const deleteButtons =
      privacyDashboardComponent.queryAllByText(deleteButtonString);
    expect(deleteButtons.length).toEqual(2);
  });
});
