import { Box } from "@mui/material";
import RadioSet from "./switchcheckpages/RadioSet";
import DisplayByRadio from "./switchcheckpages/DisplayByRadio";

const SwitchCheckPage = () => {
    return (
        <Box>
            <h5>switch page test</h5>
            <RadioSet />
            <DisplayByRadio radioGroupName="radio-set" />
        </Box>
    );
};

export default SwitchCheckPage;