import { Box } from "@mui/material";
import { useState } from "react";

interface DisplayByRadioProps {
    radioGroupName?: string;
}

const DisplayByRadio = ({ radioGroupName }: DisplayByRadioProps) => {
    const [radioValue] = useState("不明");

    return (
        <Box sx={{ border: "1px solid black" }}>
            <div>ここはラジオボタンの値を表示します</div>
            <div>ラジオボタンの値：{radioValue}</div>
        </Box>
    );
};

export default DisplayByRadio;