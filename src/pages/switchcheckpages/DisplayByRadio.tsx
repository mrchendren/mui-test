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

        // 初期値設定
        // useEffect内で同期的にsetStateを呼ぶとlintエラーになるため、setTimeoutでラップしている。
        // 改善案として「初期値取得を行わず、イベント監視のみにする」設計を検討したが、
        // ラジオボタンにdefaultValueがある場合、マウント時点で既に選択されている値を
        // 取得できず状態のズレが生じるため却下。
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