import { Dispatch, SetStateAction } from "react";
import {
  NativeSelect,
  TextField,
  Typography,
  FormControl,
} from "@material-ui/core";
import { Field } from "../../types/Field";
import { xmlSchemaTypes } from "../../consts/supportedTypes";
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { IdDocumentType } from "../../types/Guest";

function GetFieldInputElement(
  field: Field,
  currentFieldValue: string | undefined,
  setFieldValue: Dispatch<SetStateAction<string | undefined>>
): JSX.Element {
  return (
    <TextField
      required
      id="editInput"
      label={field.fieldPrettyName}
      variant="outlined"
      value={currentFieldValue}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setFieldValue(e.target.value)
      }
    />
  );
}

function GetDatePickerElement(
  field: Field,
  currentFieldValue: string | undefined,
  setFieldValue: Dispatch<SetStateAction<string | undefined>>
): JSX.Element {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <DatePicker
        disablePast
        required
        format="dd/MM/yyyy"
        label={field.fieldPrettyName}
        views={["year", "month", "date"]}
        value={new Date(currentFieldValue ?? "")}
        onChange={(date: Date | null) =>
          setFieldValue(date?.toISOString() ?? undefined)
        }
      />
    </MuiPickersUtilsProvider>
  );
}

function GetEnumPickerElement(
  field: Field,
  options: string[],
  currentFieldValue: string | undefined,
  setFieldValue: Dispatch<SetStateAction<string | undefined>>
): JSX.Element {
  if (currentFieldValue && !options.includes(currentFieldValue)) {
    currentFieldValue = undefined;
    setFieldValue(undefined);
  }

  return (
    <FormControl>
      <NativeSelect
        required
        value={currentFieldValue}
        onChange={(event: React.ChangeEvent<{ value: unknown }>) =>
          setFieldValue(event.target.value as string)
        }
      >
        <option value={undefined} disabled>
          Please select...
        </option>
        {options.map((option) => {
          return (
            <option key={option} value={option}>
              {option}
            </option>
          );
        })}
      </NativeSelect>
    </FormControl>
  );
}

export function GetFieldInputElementBasedOnType(
  field: Field,
  currentFieldValue: string | undefined,
  setFieldValue: Dispatch<SetStateAction<string | undefined>>
): JSX.Element {
  switch (field.datatype) {
    case xmlSchemaTypes.string:
      return GetFieldInputElement(field, currentFieldValue, setFieldValue);
    case xmlSchemaTypes.dateTime:
      return GetDatePickerElement(field, currentFieldValue, setFieldValue);
    case xmlSchemaTypes.idDocumentType: {
      const options = Object.keys(IdDocumentType).filter((key) => isNaN(+key));
      return GetEnumPickerElement(
        field,
        options,
        currentFieldValue,
        setFieldValue
      );
    }
    default:
      return (
        <Typography variant="overline">Field type not supported!</Typography>
      );
  }
}
