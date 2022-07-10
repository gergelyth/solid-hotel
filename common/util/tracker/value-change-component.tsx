import {
  Grid,
  Typography,
  Box,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
} from "@material-ui/core";
import { ProfileChangeStrings } from "./profile-change-strings";
import { FieldValueChange } from "./util";

export function ValueChangeComponent({
  fieldValueChange,
  optionValue,
  setOptionValue,
  requiresApproval,
  profileChangeStrings,
}: {
  fieldValueChange: FieldValueChange;
  optionValue: boolean;
  setOptionValue: (rdfName: string, newValue: boolean) => void;
  requiresApproval: boolean;
  profileChangeStrings: ProfileChangeStrings;
}): JSX.Element {
  return (
    <Grid
      item
      container
      justifyContent="center"
      alignItems="center"
      spacing={2}
      direction="row"
    >
      <Grid
        item
        xs={7}
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={1}
      >
        <Grid item>
          <Box fontWeight="fontWeightBold" fontStyle="underlined">
            <Typography>{fieldValueChange.name}:</Typography>
          </Box>
        </Grid>
        <Grid item>
          <Typography>
            {fieldValueChange.oldValue} -&gt; {fieldValueChange.newValue}
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={5}>
        <FormControl
          data-testid="value-change-radio"
          disabled={!requiresApproval}
        >
          <RadioGroup
            row
            value={optionValue}
            defaultValue={"true"}
            onChange={(e, newValue) =>
              setOptionValue(fieldValueChange.rdfName, newValue === "true")
            }
          >
            <FormControlLabel
              value="false"
              control={<Radio />}
              label={profileChangeStrings.keepRadioText}
            />
            <FormControlLabel
              value="true"
              control={<Radio />}
              label={profileChangeStrings.approveRadioText}
            />
          </RadioGroup>
        </FormControl>
      </Grid>
    </Grid>
  );
}
