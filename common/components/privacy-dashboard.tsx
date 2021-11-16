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
  deleteButton,
}: {
  field: string;
  token: PrivacyToken;
  deleteButton: (token: PrivacyToken) => JSX.Element | null;
}): JSX.Element {
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
      <Grid item xs={2}>
        {deleteButton(token)}
      </Grid>
    </Grid>
  );
}

function HotelPrivacy({
  hotelName,
  privacyTokens,
  deleteButton,
}: {
  hotelName: string;
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
          <Box px={2} fontWeight="fontWeightBold">
            {hotelName}
          </Box>
        </Typography>
      </Grid>
      <Grid item>
        <Box px={2}>
          <Grid container spacing={1} justify="center" direction="column">
            {Object.entries(groupByField).map(([field, tokens]) => {
              return tokens.map((token) => {
                return (
                  <PrivacyField
                    key={field}
                    field={field}
                    token={token}
                    deleteButton={deleteButton}
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
  deleteButton,
}: {
  privacyTokenContainerUrl: string | null;
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
  const groupByHotel = _.groupBy<PrivacyToken>(
    filteredTokens,
    (token) => token.hotel
  );

  return (
    <Grid
      container
      spacing={1}
      justify="center"
      alignItems="stretch"
      direction="column"
    >
      {Object.entries(groupByHotel).map(([hotelName, tokens]) => {
        return (
          <HotelPrivacy
            key={hotelName}
            hotelName={hotelName}
            privacyTokens={tokens}
            deleteButton={deleteButton}
          />
        );
      })}
    </Grid>
  );
}
