import { Box, Typography } from "@material-ui/core";
import styles from "../../common/styles/styles";

function Footer(): JSX.Element {
  const additionalStyles = styles();

  return (
    <Box className={additionalStyles.footer}>
      <Box flexGrow={1}>
        <Typography variant="subtitle2">License: MIT</Typography>
      </Box>
      <Box>
        <Typography variant="subtitle2">2020 - 2021</Typography>
      </Box>
    </Box>
  );
}

export default Footer;
