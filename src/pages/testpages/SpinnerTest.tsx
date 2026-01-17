import { Box } from "@mui/material";
import BasicVSpinner from "./BasicVSpinner";

const SpinnerTest = () => {
    return (
        <Box sx={{position: "relative", top: "0px", left: "0px"}}>

            <span style={{ position: "absolute", top: "0px", left: "200px" }}>高さ10px</span>
            <BasicVSpinner
                top="0px"
                left="0px"
                height="10px"
                width="200px"
                initialvalue={0}
                objectname="spinner-small"
                compulsory={true}
            />

            <span style={{ position: "absolute", top: "100px", left: "200px" }}>高さ20px</span>
            <BasicVSpinner
                top="100px"
                left="0px"
                height="20px"
                width="200px"
                initialvalue={0}
                objectname="spinner-large"
            />
        </Box>
    );
};

export default SpinnerTest;