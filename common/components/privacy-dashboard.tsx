import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Typography,
  Paper,
} from "@material-ui/core";
import _ from "lodash";
import { PrivacyToken } from "../types/PrivacyToken";
import { NotEmptyItem } from "../util/helpers";
import { ErrorComponent } from "./error-component";

/**
 * @returns The expiry date of the token with the latest expiry date in the batch.
 */
function FindLatestExpiryDate(tokens: PrivacyToken[]): Date {
  return tokens.reduce((x, y) => (x.expiry > y.expiry ? x : y)).expiry;
}

//TODO we probably can do this with date-fns?
/**
 * @returns A flag which says if the two dates are on the same day.
 */
function AreDatesOnTheSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
}

/**
 * @returns Normal text if the entry is highlighted, or faded and smaller text if it's not.
 */
function GetHighlightedOrNotEntry(
  text: string,
  highlightValue: boolean
): JSX.Element {
  if (highlightValue) {
    return <Typography>{text}</Typography>;
  } else {
    return (
      <Box color="text.disabled" fontSize="75%">
        <Typography>{text}</Typography>
      </Box>
    );
  }
}

/**
 * Displays one privacy token and highlights if the token is the latest of the tokens referencing the same RDF field to expire.
 * @returns A component with the RDF field, the token's reason, expiry and a delete button if required.
 */
function PrivacyField({
  field,
  token,
  deleteButtonFunction,
  showLabel,
  highlightValue,
}: {
  field: string;
  token: PrivacyToken;
  deleteButtonFunction: (token: PrivacyToken) => JSX.Element | null;
  showLabel: boolean;
  highlightValue: boolean;
}): JSX.Element {
  const deleteButton = deleteButtonFunction(token) ? (
    <Grid item xs={2}>
      {deleteButtonFunction(token)}
    </Grid>
  ) : null;

  return (
    <Grid
      item
      container
      xs={12}
      spacing={2}
      alignItems="center"
      justifyContent="center"
      direction="row"
    >
      <Grid item xs={3}>
        <Typography noWrap>{showLabel ? field : ""}</Typography>
      </Grid>
      <Grid item xs={5}>
        {GetHighlightedOrNotEntry(token.reason, highlightValue)}
      </Grid>
      <Grid item xs={2}>
        {GetHighlightedOrNotEntry(token.expiry.toDateString(), highlightValue)}
      </Grid>
      {deleteButton}
    </Grid>
  );
}

/**
 * Displays the privacy tokens for one specific counterparty.
 * Further groups the tokens by the personal information fields, so tokens referencing the same fields are next to each other.
 * @returns A component with a list of privacy tokens for a given counterparty grouped by RDF fields.
 */
function HotelPrivacy({
  counterparty,
  privacyTokens,
  deleteButton,
}: {
  counterparty: string;
  privacyTokens: PrivacyToken[];
  deleteButton: (token: PrivacyToken) => JSX.Element | null;
}): JSX.Element {
  const groupByField: { [field: string]: PrivacyToken[] } = {};

  privacyTokens.forEach((token) => {
    token.fieldList.forEach((field) => {
      if (!groupByField[field]) {
        groupByField[field] = [token];
      } else {
        groupByField[field].push(token);
      }
    });
  });

  return (
    <Box data-testid="counterparty-box">
      <Typography variant="h6">
        <Box textAlign="center">{counterparty}</Box>
      </Typography>
      <Box p={2}>
        {Object.entries(groupByField).map(([field, tokens]) => {
          const latestExpiry = FindLatestExpiryDate(tokens);
          return (
            <Paper elevation={6} key={field}>
              <Box m={2}>
                {tokens.map((token, index) => {
                  return (
                    <Box key={index}>
                      <PrivacyField
                        key={field}
                        field={field}
                        token={token}
                        deleteButtonFunction={deleteButton}
                        showLabel={index === 0}
                        highlightValue={AreDatesOnTheSameDay(
                          token.expiry,
                          latestExpiry
                        )}
                      />
                    </Box>
                  );
                })}
              </Box>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
}

/**
 * The dashboard containing the privacy tokens of the user.
 * Generic component so it can be used with both HotelPrivacyToken and GuestPrivacyToken.
 * Provides the option to group the tokens by a string field.
 * Provides the option to create a delete button for specific tokens.
 * @returns A component containing all privacy tokens grouped by a specific string field.
 */
export function PrivacyDashboard<T extends PrivacyToken>({
  retrieval,
  tokenGrouping,
  deleteButton,
}: {
  retrieval: {
    items: (T | null)[] | undefined;
    isLoading: boolean;
    isError: boolean;
  };
  tokenGrouping: (token: T) => string;
  deleteButton: (token: PrivacyToken) => JSX.Element | null;
}): JSX.Element {
  if (retrieval.isLoading) {
    return <CircularProgress />;
  }
  if (retrieval.isError || !retrieval.items) {
    return <ErrorComponent />;
  }

  const filteredTokens = retrieval.items.filter(NotEmptyItem);
  const groupByCounterparty = _.groupBy<T>(filteredTokens, tokenGrouping);

  return (
    <Container>
      {Object.entries(groupByCounterparty).map(([counterparty, tokens]) => {
        return (
          <HotelPrivacy
            key={counterparty}
            counterparty={counterparty}
            privacyTokens={tokens}
            deleteButton={deleteButton}
          />
        );
      })}
    </Container>
  );
}
