import {
  Grid,
  Typography,
  Box,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
} from "@material-ui/core";
import { FieldValueChange } from "./util";

export function ValueChangeComponent({
  fieldValueChange,
  optionValue,
  setOptionValue,
}: {
  fieldValueChange: FieldValueChange;
  optionValue: boolean;
  setOptionValue: (rdfName: string, newValue: boolean) => void;
}): JSX.Element {
  return (
    <Grid
      item
      container
      justify="center"
      alignItems="center"
      spacing={2}
      direction="row"
    >
      <Grid
        item
        xs={7}
        container
        direction="column"
        justify="center"
        alignItems="center"
        spacing={1}
      >
        <Grid item>
          <Typography>
            <Box fontWeight="fontWeightBold" fontStyle="underlined">
              {fieldValueChange.name}:
            </Box>
          </Typography>
        </Grid>
        <Grid item>
          <Typography>
            {fieldValueChange.oldValue} -&gt; {fieldValueChange.newValue}
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={5}>
        <FormControl>
          <RadioGroup
            row
            value={optionValue}
            defaultValue={"true"}
            onChange={(e, newValue) =>
              setOptionValue(fieldValueChange.rdfName, newValue === "true")
            }
          >
            <FormControlLabel value="false" control={<Radio />} label="Hide" />
            <FormControlLabel value="true" control={<Radio />} label="Send" />
          </RadioGroup>
        </FormControl>
      </Grid>
    </Grid>
  );
}
