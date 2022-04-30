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

function FindLatestExpiryDate(tokens: PrivacyToken[]): Date {
  return tokens.reduce((x, y) => (x.expiry > y.expiry ? x : y)).expiry;
}

function AreDatesOnTheSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
}

function GetHighlightedOrNotEntry(
  text: string,
  highlightValue: boolean
): JSX.Element {
  return (
    <Typography>
      {highlightValue ? (
        <Box>{text}</Box>
      ) : (
        <Box color="text.disabled" fontSize="75%">
          {text}
        </Box>
      )}
    </Typography>
  );
}

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
      justify="center"
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
    <Box>
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
    return (
      <Container maxWidth="sm">
        <Typography>An error occurred.</Typography>
      </Container>
    );
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
