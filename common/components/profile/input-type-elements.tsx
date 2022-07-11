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
import { IdDocumentType } from "../../types/IdDocument";

/**
 * Creates a component for STRING typed fields.
 * @returns A TextField component which lets the user input the string value of the field.
 */
function GetFieldInputElement(
  field: Field,
  currentFieldValue: string | undefined,
  setFieldValue: Dispatch<SetStateAction<string | undefined>>
): JSX.Element {
  return (
    <TextField
      data-testid="field-string-input"
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

/**
 * Creates a component for DATETIME typed fields.
 * @returns A DatePicker component which lets the user pick the date for the field.
 */
function GetDatePickerElement(
  field: Field,
  currentFieldValue: string | undefined,
  setFieldValue: Dispatch<SetStateAction<string | undefined>>
): JSX.Element {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <DatePicker
        data-testid="field-date-picker"
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

/**
 * Creates a component for ENUM typed fields.
 * @returns A Select component which lets the user choose from the options.
 */
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
        data-testid="field-enum-picker"
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

/**
 * Decides what type of element of component to return based on the type of the field supplied.
 * Currently supported types are: string, dateTime, idDocumentType.
 * Adding a new field should consist only of the defining the component above and adding the option to the switch clause here.
 * @returns The component type for the corresponding field type.
 */
export function FieldInputElementBasedOnType({
  field,
  currentFieldValue,
  setFieldValue,
}: {
  field: Field;
  currentFieldValue: string | undefined;
  setFieldValue: Dispatch<SetStateAction<string | undefined>>;
}): JSX.Element {
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
