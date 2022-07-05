import { ProfileMain } from "../../../common/components/profile/profile-main";
import { Grid } from "@material-ui/core";
import { ConfirmRequiredFieldsButton } from "../../../common/components/profile/required-fields-button";
import { Dispatch, SetStateAction } from "react";
import { OfflineCheckinPage } from "../../pages/checkin";

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
  //TODO maybe instead of this, we can experiment with re-rendering this whole thing with calling RevalidateGuest in ProfileMain

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
      justify="center"
      alignItems="center"
      direction="column"
    >
      <Grid item xs={6} container justify="center">
        <ProfileMain
          rdfFields={data}
          webId={hotelProfileWebId}
          deletable={false}
          forceRender={forceRender}
        />
      </Grid>
      <Grid item container justify="center">
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
