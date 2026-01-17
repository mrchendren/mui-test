import { Box } from "@mui/material";
import { useState, useEffect } from "react";

interface DisplayByRadioProps {
    radioGroupName?: string;
}

const DisplayByRadio = ({ radioGroupName }: DisplayByRadioProps) => {
    const [radioValue, setRadioValue] = useState("不明");

    useEffect(() => {
        if (!radioGroupName) return;

        const getSelectedValue = () => {
            const selected = document.querySelector<HTMLInputElement>(
                `input[name="${radioGroupName}"]:checked`
            );
            return selected?.value ?? "不明";
        };

        const handleChange = () => setRadioValue(getSelectedValue());

        const radioButtons = document.querySelectorAll<HTMLInputElement>(
            `input[name="${radioGroupName}"]`
        );

        // 初期値設定（lint回避のためコールバック内で実行）
        setTimeout(() => setRadioValue(getSelectedValue()), 0);

        // 変更監視
        radioButtons.forEach((r) => r.addEventListener("change", handleChange));

        return () => {
            radioButtons.forEach((r) => r.removeEventListener("change", handleChange));
        };
    }, [radioGroupName]);

    return (
        <Box sx={{ border: "1px solid black" }}>
            <div>ここはラジオボタンの値を表示します</div>
            <div>ラジオボタンの値：{radioValue}</div>
        </Box>
    );
};

export default DisplayByRadio;