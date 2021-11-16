import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@material-ui/core";
import _ from "lodash";
import { usePrivacyTokens } from "../hooks/usePrivacyTokens";
import { PrivacyToken } from "../types/PrivacyToken";
import { NotEmptyItem } from "../util/helpers";

function PrivacyField({
  field,
  token,
  deleteButtonFunction,
}: {
  field: string;
  token: PrivacyToken;
  deleteButtonFunction: (token: PrivacyToken) => JSX.Element | null;
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
        {field}
      </Grid>
      <Grid item xs={5}>
        {token.reason}
      </Grid>
      <Grid item xs={2}>
        {token.expiry.toDateString()}
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
      <Grid item justify="flex-start">
        <Typography variant="body1">
          <Box mx={2} px={2} fontWeight="fontWeightBold">
            {counterparty}
          </Box>
        </Typography>
      </Grid>
      <Grid item>
        <Box p={2}>
          <Grid container spacing={1} justify="center" direction="column">
            {Object.entries(groupByField).map(([field, tokens]) => {
              return tokens.map((token) => {
                return (
                  <PrivacyField
                    key={field}
                    field={field}
                    token={token}
                    deleteButtonFunction={deleteButton}
                  />
                );
              });
            })}
          </Grid>
        </Box>
      </Grid>
    </Box>
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
      spacing={1}
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
