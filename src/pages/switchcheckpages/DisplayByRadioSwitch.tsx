import { Box } from "@mui/material";
import { useState, useEffect, Children, isValidElement, type ReactNode } from "react";

interface DisplayByRadioSwitchProps {
    radioGroupName?: string;
    children?: ReactNode;
}

const DisplayByRadioSwitch = ({ radioGroupName, children }: DisplayByRadioSwitchProps) => {
    const [switchValue, setSwitchValue] = useState<string | null>(null);

    useEffect(() => {
        if (!radioGroupName) return;

        const getSelectedValue = () => {
            const selected = document.querySelector<HTMLInputElement>(
                `input[name="${radioGroupName}"]:checked`
            );
            return selected?.value ?? null;
        };

        const handleChange = () => setSwitchValue(getSelectedValue());

        const radioButtons = document.querySelectorAll<HTMLInputElement>(
            `input[name="${radioGroupName}"]`
        );

        // 初期値設定
        // useEffect内で同期的にsetStateを呼ぶとlintエラーになるため、setTimeoutでラップしている。
        // 改善案として「初期値取得を行わず、イベント監視のみにする」設計を検討したが、
        // ラジオボタンにdefaultValueがある場合、マウント時点で既に選択されている値を
        // 取得できず状態のズレが生じるため却下。
        setTimeout(() => setSwitchValue(getSelectedValue()), 0);

        // 変更監視
        radioButtons.forEach((r) => r.addEventListener("change", handleChange));

        return () => {
            radioButtons.forEach((r) => r.removeEventListener("change", handleChange));
        };
    }, [radioGroupName]);

    // childrenをフィルタリングして、ラジオボタンの値と一致する子要素のみを表示
    const filteredChildren = Children.map(children, (child) => {
        if (!isValidElement(child)) return null;

        const switchContentId = (child.props as { "data-switch-content-id"?: string })["data-switch-content-id"];
        if (switchContentId === switchValue) {
            return child;
        }
        return null;
    });

    return (
        <Box sx={{ border: "1px solid black" }}>
            <div>ここはラジオボタンの値を表示します</div>
            <div>ラジオボタンの値：{switchValue}</div>
            {filteredChildren}
        </Box>
    );
};

export default DisplayByRadioSwitch;
