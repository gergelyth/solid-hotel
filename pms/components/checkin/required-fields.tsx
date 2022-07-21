import { ProfileMain } from "../../../common/components/profile/profile-main";
import { Grid } from "@material-ui/core";
import { ConfirmRequiredFieldsButton } from "../../../common/components/profile/required-fields-button";
import { Dispatch, SetStateAction } from "react";
import { OfflineCheckinPage } from "../../pages/checkin";

/**
 * Has the responsibility to collect the values for all RDF fields required for check-in.
 * The required fields array is passed as an argument.
 * The proceed button is disabled until every required field has a value.
 * When the button is enabled and clicked, we execute the check-in operation.
 * @returns A component containing the profile fields and the ability to edit their values and a proceed button which triggers the check-in.
 */
export function RequiredFields({
  data,
  hotelProfileWebId,
  currentPage,
  setCurrentPage,
  executeCheckin,
}: {
  data: string[];
  hotelProfileWebId: string;
  currentPage: OfflineCheckinPage;
  setCurrentPage: Dispatch<SetStateAction<OfflineCheckinPage>>;
  executeCheckin: (hotelProfileWebId: string) => void;
}): JSX.Element {
  //this is a workaround to re-render the child component without re-rendering this one
  let value: boolean;
  let setValue: Dispatch<SetStateAction<boolean>>;

  const onChildMount = (
    dataFromChild: [boolean, Dispatch<SetStateAction<boolean>>]
  ): void => {
    value = dataFromChild[0];
    setValue = dataFromChild[1];
  };

  const forceRender = (): void => {
    setValue(!value);
  };

  return (
    <Grid
      item
      container
      justifyContent="center"
      alignItems="center"
      direction="column"
    >
      <Grid item xs={6} container justifyContent="center">
        <ProfileMain
          rdfFields={data}
          webId={hotelProfileWebId}
          deletable={false}
          forceRender={forceRender}
        />
      </Grid>
      <Grid item container justifyContent="center">
        <ConfirmRequiredFieldsButton
          onClickFunction={() => {
            executeCheckin(hotelProfileWebId);
            setCurrentPage(currentPage + 1);
          }}
          rdfFields={data}
          webId={hotelProfileWebId}
          onMount={onChildMount}
        />
      </Grid>
    </Grid>
  );
}
