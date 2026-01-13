import { useEffect, useRef, useState } from "react";
import {
    Box,
    IconButton,
    InputAdornment,
    Popover,
    TextField,
} from "@mui/material";
import {
    DateCalendar,
    type DateView,
} from "@mui/x-date-pickers";
import type { RenderEditCellProps, RenderCellProps } from "react-data-grid";

// 元号定義
const ERAS = [
    { name: "令和", start: new Date(2019, 4, 1) },
    { name: "平成", start: new Date(1989, 0, 8) },
    { name: "昭和", start: new Date(1926, 11, 25) },
    { name: "明治", start: new Date(1868, 0, 25) },
] as const;

// 日付から元号情報を取得
const getEraFromDate = (date: Date) => {
    for (const era of ERAS) {
        if (date >= era.start) {
            const year = date.getFullYear() - era.start.getFullYear() + 1;
            return { era: era.name, year };
        }
    }
    return null;
};

// 日付を元号形式でフォーマット（例：令和05年12月25日）
const formatEra = (date: Date | null): string => {
    if (!date) return "";
    const info = getEraFromDate(date);
    if (!info) return "";
    const y = info.year.toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const d = date.getDate().toString().padStart(2, "0");
    return `${info.era}${y}年${m}月${d}日`;
};

// 日付をyyMMdd形式でフォーマット（6桁）
const formatYYMMDD = (date: Date): string => {
    const info = getEraFromDate(date);
    if (!info) return "";
    const y = info.year.toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const d = date.getDate().toString().padStart(2, "0");
    return `${y}${m}${d}`;
};

// 入力文字列（yyMMdd）を日付にパース
const parseEraDate = (
    input: string,
    era: "令和" | "平成" | "昭和" | "明治"
): Date | null => {
    // 6桁の数字でなければ無効
    if (!/^\d{6}$/.test(input)) return null;
    const yy = Number(input.slice(0, 2));
    const mm = Number(input.slice(2, 4));
    const dd = Number(input.slice(4, 6));

    const eraDef = ERAS.find((e) => e.name === era);
    if (!eraDef) return null;

    // 元号の年（yy）から西暦を計算する。元年(yy=1)は開始年と同じなので、yy-1を加算する。
    const year = eraDef.start.getFullYear() + yy - 1;
    const date = new Date(year, mm - 1, dd);

    // new Date()が自動補正する不正な日付（例: 2月30日 -> 3月1日 or 2日）をチェックする。
    if (
        date.getFullYear() !== year ||
        date.getMonth() !== mm - 1 ||
        date.getDate() !== dd
    )
        return null;

    // 計算した日付が、その元号の開始日より前でないことを確認する（例: 昭和元年1月1日）。
    if (date < eraDef.start) return null;
    return date;
};

// 日付編集セルコンポーネント
export const DateBoxColumn = <T extends { date: Date | null }>({
    row,
    onRowChange,
    onClose,
}: RenderEditCellProps<T>) => {
    // row.dateを初期値として使用（編集セルは編集モードに入ったときに作成されるため、初期化時にrow.dateを使えば十分）
    const [value, setValue] = useState<Date | null>(row.date);
    const [editing, setEditing] = useState<string | null>(null);
    const [focused, setFocused] = useState(false);
    // ユーザーがyyMMdd形式で入力した際に、どの元号で解釈するかのヒントとして最後に使用された元号を保持する。
    const lastEraRef = useRef<"令和" | "平成" | "昭和" | "明治">("令和");
    const inputRef = useRef<HTMLInputElement | null>(null);

    // --- Popover (カレンダー) 関連のstate ---
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const calendarRef = useRef<HTMLDivElement>(null);
    const [view, setView] = useState<DateView>("day");

    useEffect(() => {
        if (focused && inputRef.current) {
            inputRef.current.select();
        }
    }, [focused]);

    const handleFocus = () => setFocused(true);

    // blurイベントハンドラ。入力が確定したときの処理。
    const handleBlur = () => {
        setFocused(false);
        // 編集バッファに何もなければ（キー入力がなければ）何もしない
        if (editing === null) {
            // 編集が終了 onCloseを実行すると編集が終了する trueを渡す
            onClose(true);
            return;
        }

        // 先に編集バッファをキャプチャし、状態をリセットする
        const inputBuffer = editing;
        setEditing(null);

        // 入力値が空文字列の場合は日付をnullにする
        if (!inputBuffer) {
            onRowChange({ ...row, date: null }, true);
            // 編集を終了 onCloseを実行すると編集が終了する trueを渡す
            onClose(true);
            return;
        }

        // 最後に使われた元号をヒントに日付をパースする
        const parsed = parseEraDate(inputBuffer, lastEraRef.current);
        if (parsed) {
            // パースに成功した場合のみ、日付を更新し、使用された元号を記憶する。
            const info = getEraFromDate(parsed);
            if (info) lastEraRef.current = info.era;
            setValue(parsed);
            onRowChange({ ...row, date: parsed }, true);
        }
        // 編集を終了 onCloseを実行すると編集が終了する trueを渡す
        onClose(true);
    };

    const handleChange = (next: string) => {
        if (focused && /^\d{0,6}$/.test(next)) {
            setEditing(next);
        }
    };

    const handleOpen = () => {
        setAnchorEl(inputRef.current);
        setView("day");
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    // カレンダーが開いた後、フォーカス可能な日付（今日または選択中の日）に自動でフォーカスを当てる。
    const handleEntered = () => {
        if (calendarRef.current) {
            const dayButton = calendarRef.current.querySelector(
                'button[role="gridcell"][tabindex="0"]'
            ) as HTMLElement;
            if (dayButton) {
                dayButton.focus();
            }
        }
    };

    // 表示する値の制御ロジック
    // フォーカス時: 編集中の値があればそれを、なければ日付をyyMMdd形式で表示
    // 非フォーカス時: 元号を含む正式なフォーマットで表示
    const displayValue = focused
        ? editing ?? (value ? formatYYMMDD(value) : "")
        : formatEra(value);

    return (
        <>
            <TextField
                inputRef={inputRef}
                value={displayValue}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={(e) => handleChange(e.target.value)}
                slotProps={{
                    htmlInput: { inputMode: "numeric", pattern: "[0-9]*" },
                    input: {
                        endAdornment: (
                            <InputAdornment position="end" sx={{ marginLeft: 0 }}>
                                <IconButton
                                    onClick={handleOpen}
                                    edge="end"
                                    size="small"
                                    sx={{ padding: "0 2px" }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24">
                                        <path
                                            fill="currentColor"
                                            d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"
                                        />
                                    </svg>
                                </IconButton>
                            </InputAdornment>
                        ),
                    },
                }}
                sx={{
                    width: "100%",
                    "& .MuiOutlinedInput-root": {
                        padding: 0,
                        paddingRight: "2px",
                    },
                    "& .MuiInputBase-input": {
                        height: "20px",
                        lineHeight: "20px",
                        fontSize: "14px",
                        padding: "0 0 0 4px !important",
                    },
                }}
            />
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                slotProps={{
                    transition: {
                        onEntered: handleEntered,
                    },
                }}
            >
                <Box ref={calendarRef}>
                    <DateCalendar
                        value={value}
                        onViewChange={setView}
                        onChange={(newValue) => {
                            setValue(newValue);
                            if (newValue) {
                                const info = getEraFromDate(newValue);
                                if (info) lastEraRef.current = info.era;
                                onRowChange({ ...row, date: newValue }, true);
                            } else {
                                onRowChange({ ...row, date: null }, true);
                            }
                            if (view === "day") {
                                handleClose();
                                // 編集を終了 onCloseを実行すると編集が終了する trueを渡す
                                onClose(true);
                            }
                        }}
                    />
                </Box>
            </Popover>
        </>
    );
};

// 日付表示セルコンポーネント
export const DateCell = <T extends { date: Date | null }>({ row }: RenderCellProps<T>) => {
    return (
        <Box
            sx={{
                height: "20px",
                lineHeight: "20px",
                fontSize: "14px",
                padding: 0,
                paddingLeft: "4px",
                display: "flex",
                alignItems: "center",
            }}
        >
            {formatEra(row.date)}
        </Box>
    );
};

