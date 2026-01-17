import { Box, FormControlLabel, Radio, RadioGroup } from "@mui/material";

const RadioSet = () => {
    return (
        <Box>
            <RadioGroup
                name="radio-set"
                row
            >
                <FormControlLabel
                    value="1"
                    control={<Radio />}
                    label="1"
                />
                <FormControlLabel
                    value="2"
                    control={<Radio />}
                    label="2"
                />
                <FormControlLabel
                    value="3"
                    control={<Radio />}
                    label="3"
                />
            </RadioGroup>
        </Box>
    );
};

export default RadioSet;