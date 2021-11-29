import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Typography,
  Paper,
  Divider,
} from "@material-ui/core";
import _ from "lodash";
import { usePrivacyTokens } from "../hooks/usePrivacyTokens";
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
        <Box color="text.disabled">{text}</Box>
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
      spacing={1}
      alignItems="center"
      justify="center"
      direction="row"
    >
      <Grid item xs={3}>
        <Typography>{showLabel ? field : ""}</Typography>
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
    <Paper elevation={12}>
      <Grid item>
        <Typography variant="body1">
          <Box fontWeight="fontWeightBold" textAlign="center" border={5}>
            {counterparty}
          </Box>
        </Typography>
      </Grid>
      <Grid item>
        <Box p={2}>
          <Grid container spacing={1} justify="center" direction="column">
            <Box my={2}>
              <Divider variant="middle" />
            </Box>
            {Object.entries(groupByField).map(([field, tokens]) => {
              const latestExpiry = FindLatestExpiryDate(tokens);
              console.log(latestExpiry);
              return (
                <Box key={field}>
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
                        <Box>
                          {index === tokens.length - 1 ? null : (
                            <Divider variant="middle" />
                          )}
                        </Box>
                      </Box>
                    );
                  })}
                  <Box my={2}>
                    <Divider variant="middle" />
                  </Box>
                </Box>
              );
            })}
          </Grid>
        </Box>
      </Grid>
    </Paper>
  );
}

export function PrivacyDashboard({
  privacyTokenContainerUrl,
  tokenGrouping,
  deleteButton,
}: {
  privacyTokenContainerUrl: string | null;
  tokenGrouping: (token: PrivacyToken) => string;
  deleteButton: (token: PrivacyToken) => JSX.Element | null;
}): JSX.Element {
  const { items, isLoading, isError } = usePrivacyTokens(
    privacyTokenContainerUrl
  );

  if (isLoading) {
    return <CircularProgress />;
  }
  if (isError || !items) {
    return (
      <Container maxWidth="sm">
        <Typography>An error occurred.</Typography>
      </Container>
    );
  }

  const filteredTokens = items.filter(NotEmptyItem);
  const groupByCounterparty = _.groupBy<PrivacyToken>(
    filteredTokens,
    tokenGrouping
  );

  return (
    <Grid
      container
      item
      spacing={3}
      justify="center"
      alignItems="stretch"
      direction="column"
    >
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
    </Grid>
  );
}
