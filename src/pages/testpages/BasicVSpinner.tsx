import * as React from "react";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import { NumberField } from "@base-ui/react/number-field";
import { IconButton, InputAdornment } from "@mui/material";

type PositionValue = "static" | "relative" | "absolute" | "fixed" | "sticky";

interface BasicVSpinnerProps {
    position?: PositionValue; // default: 'absolute'
    caption?: string; // 表示ラベルなし。data-captionに付与
    editable?: boolean; // true=編集可 / false=読み取り専用 (readOnly: true を明記)
    enable?: boolean; // true=使用可 / false=disabled
    objectname?: string; // -> id
    visible?: boolean; // false のとき display: 'none'

    left?: string;
    top?: string;
    height?: string;
    width?: string;

    compulsory?: boolean; // -> required
    indicatevalue?: string; // 受け取りのみ（未使用）
    initialvalue?: number; // -> defaultValue
    max?: number; // 既定なし
    min?: number; // 既定なし
    step?: number; // default: 1
}

const ChevronUpSvg: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" width="100%" height="100%" {...props}>
        <path
            d="M7 14L12 9L17 14"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
        />
    </svg>
);

const ChevronDownSvg: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" width="100%" height="100%" {...props}>
        <path
            d="M7 10L12 15L17 10"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
        />
    </svg>
);

const BasicVSpinner: React.FC<BasicVSpinnerProps> = ({
    position = "absolute",
    caption,
    editable = true,
    enable = true,
    objectname,
    visible = true,

    left,
    top,
    height,
    width,

    compulsory = false,
    indicatevalue, // 受け取りのみ（未使用）
    initialvalue,
    max,
    min,
    step = 1,
}) => {
    const getPositionStyle = (v?: PositionValue) => (v ? { position: v } : {});
    const getVisibilityStyle = (v?: boolean) =>
        v === false ? { display: "none" } : {};
    const getLeftStyle = (v?: string) => (v ? { left: v } : {});
    const getTopStyle = (v?: string) => (v ? { top: v } : {});
    const getHeightStyle = (v?: string) => (v ? { height: v } : {});
    const getWidthStyle = (v?: string) => (v ? { width: v } : {});
    const getIdAttribute = (v?: string) => (v ? { id: v } : {});

    const combinedSx = {
        ...getPositionStyle(position),
        ...getVisibilityStyle(visible),
        ...getLeftStyle(left),
        ...getTopStyle(top),
        ...getHeightStyle(height),
        ...getWidthStyle(width),
    } as const;

    const getBgColor = (
        enable: boolean,
        editable: boolean,
        required?: boolean
    ) => {
        if (enable && editable && required) {
            return { backgroundColor: "#FFF8DC" };
        }
        if (enable && editable) {
            return { backgroundColor: "#FFFFFF" };
        }
        return {};
    };

    const spinButtonsWidth = "10px";

    return (
        <Box sx={combinedSx}>
            <NumberField.Root
                {...getIdAttribute(objectname)}
                data-caption={caption}
                defaultValue={initialvalue}
                min={min}
                max={max}
                step={step}
                required={!!compulsory}
                disabled={!enable}
                readOnly={!editable}
                style={{ height: "100%" }}
            >
                <NumberField.Input
                    render={(props, state) => {
                        const mergedInputProps = {
                            ...props,
                            style: {
                                height: "100%",
                            } as React.CSSProperties,
                            onBeforeInput: (e: React.FormEvent<HTMLInputElement>) => {
                                const data = (e as unknown as InputEvent).data;
                                if (data === "." || data === "-") {
                                    e.preventDefault?.();
                                    return;
                                }
                                // @ts-expect-error: props.onBeforeInput ない場合もあるため安全呼び出し
                                props.onBeforeInput?.(e);
                            },
                            onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
                                if (e.key === "." || e.key === "-") {
                                    e.preventDefault();
                                }
                                props.onKeyDown?.(e);
                            },
                        };

                        return (
                            <OutlinedInput
                                inputRef={props.ref}
                                value={state.inputValue}
                                onBlur={props.onBlur}
                                onChange={props.onChange}
                                onKeyUp={props.onKeyUp}
                                onFocus={props.onFocus}
                                slotProps={{ input: mergedInputProps }}
                                disabled={!enable}
                                readOnly={!editable}
                                endAdornment={
                                    <InputAdornment
                                      position="end"
                                      sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignSelf: "stretch",
                                        width: spinButtonsWidth,
                                        padding: 0,
                                        margin: 0,
                                        borderLeftStyle: "solid",
                                        borderLeftWidth: "1px",
                                        borderLeftColor:
                                          "var(--mui-palette-divider, rgba(0,0,0,0.12))",
                                        boxSizing: "border-box",
                                      }}
                                    >
                                      {/* 上ボタン：高さの 50% */}
                                      <div
                                        style={{
                                          width: "100%",
                                          height: "50%",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          boxSizing: "border-box",
                                        }}
                                      >
                                        <NumberField.Increment
                                          render={
                                            <IconButton
                                              aria-label="Increase"
                                              disabled={!enable || !editable}
                                              tabIndex={-1}
                                              sx={{
                                                width: "100%",
                                                height: "100%",
                                                padding: "0 1px 0 0",
                                                borderRadius: "2px",
                                                // アイコンがボタン全体にフィットするように
                                                "& svg": {
                                                  width: "100%",
                                                  height: "100%",
                                                },
                                              }}
                                            />
                                          }
                                        >
                                          <ChevronUpSvg />
                                        </NumberField.Increment>
                                      </div>
                  
                                      {/* 下ボタン：高さの 50% */}
                                      <div
                                        style={{
                                          width: "100%",
                                          height: "50%",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          boxSizing: "border-box",
                                        }}
                                      >
                                        <NumberField.Decrement
                                          render={
                                            <IconButton
                                              aria-label="Decrease"
                                              disabled={!enable || !editable}
                                              tabIndex={-1}
                                              sx={{
                                                width: "100%",
                                                height: "100%",
                                                padding: "0 1px 0 0",
                                                borderRadius: "2px",
                                                "& svg": {
                                                  width: "100%",
                                                  height: "100%",
                                                },
                                              }}
                                            />
                                          }
                                        >
                                          <ChevronDownSvg />
                                        </NumberField.Decrement>
                                      </div>
                                    </InputAdornment>
                                  }
                                sx={{
                                    height: "100%",
                                    minHeight: "0px",
                                    padding: 0,
                                    boxSizing: "border-box",
                                    "& .MuiOutlinedInput-input": {
                                        height: "100%",
                                        minHeight: "0px",
                                        paddingTop: "0px",
                                        paddingRight: "4px",
                                        paddingBottom: "0px",
                                        paddingLeft: "4px", // 左余白
                                        backgroundColor: getBgColor(enable, editable, compulsory),
                                        lineHeight: "normal",
                                        boxSizing: "border-box",
                                    },
                                    // 枠線内の余白（adornedEndで増えるパディングなど）をゼロ化
                                    "& .MuiOutlinedInput-adornedEnd": {
                                        paddingRight: "0px",
                                    },
                                }}
                            />
                        );
                    }}
                />
            </NumberField.Root>
        </Box>
    );
};

export default BasicVSpinner;