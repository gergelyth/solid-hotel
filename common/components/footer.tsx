import { Box, Typography } from "@material-ui/core";
import styles from "../styles/styles";

/**
 * @returns A generic footer component with license and credits.
 */
function Footer(): JSX.Element {
  const additionalStyles = styles();

  return (
    <Box className={additionalStyles.footer}>
      <Box flexGrow={1}>
        <Typography variant="subtitle2">License: MIT</Typography>
      </Box>
      <Box>
        <Typography variant="subtitle2">2020 - 2022</Typography>
      </Box>
    </Box>
  );
}

export default Footer;
