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
  DateField,
  DatePicker,
  LocalizationProvider,
  type DateView,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, parse } from "date-fns";

export const DateBoxTest = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {/* 入力欄のサイズの参考 */}
      <TextField
        onFocus={(event) => {
          event.target.select();
        }}
        sx={{
          width: "150px",
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
      {/* DatePicker */}
      <StyledDatePicker />
      {/* DateField */}
      <StyledDateField />
      {/* DateField with ID */}
      <StyledSpinDateField />
      {/* Spin Gengo TextField */}
      <GengoSpinTextField />
      {/* Gengo Date Picker */}
      <TextFieldAndDateCalender />
      {/* Gengo Date Calender (Merged) */}
      <GengoDateCalender />
    </LocalizationProvider>
  );
};

const StyledDatePicker = () => {
  const [value, setValue] = useState<Date | null>(null);
  const [focused, setFocused] = useState(false);

  return (
    <DatePicker
      value={value}
      onChange={(newValue) => setValue(newValue)}
      format={focused ? "yyyyMMdd" : "yyyy年 MM月 dd日"}
      slotProps={{
        textField: {
          id: "date-picker-with-id",
          onFocus: () => {
            setFocused(true);
          },
          onBlur: () => setFocused(false),
          sx: {
            width: "150px",
            "& .MuiOutlinedInput-root, & .MuiPickersOutlinedInput-root": {
              padding: 0,
              // アイコン(14px) + ボタン左右padding(2px*2) = 18px
              paddingRight: "12px",
            },
            "& .MuiInputBase-input, & .MuiPickersInputBase-sectionsContainer, & .MuiPickersSectionList-root":
            {
              height: "20px",
              lineHeight: "20px",
              fontSize: "14px",
              padding: "0 0 0 4px !important",
            },
            // DatePickerのアイコンを囲むAdornmentのデフォルトマージンを削除
            "& .MuiInputAdornment-root": {
              marginLeft: 0,
            },
          },
        },
        openPickerButton: {
          sx: {
            padding: "0 2px",
            "& .MuiSvgIcon-root": {
              fontSize: "14px",
            },
          },
        },
      }}
    />
  );
};

const StyledDateField = () => {
  const [value, setValue] = useState<Date | null>(null);
  const [focused, setFocused] = useState(false);

  return (
    <DateField
      value={value}
      onChange={(newValue) => setValue(newValue)}
      format={focused ? "yyyyMMdd" : "yyyy年 MM月 dd日"}
      slotProps={{
        textField: {
          onFocus: () => setFocused(true),
          onBlur: () => setFocused(false),
          sx: {
            width: "150px",
            "& .MuiOutlinedInput-root, & .MuiPickersOutlinedInput-root": {
              padding: 0,
              paddingRight: "2px",
            },
            "& .MuiInputBase-input, & .MuiPickersInputBase-sectionsContainer, & .MuiPickersSectionList-root":
            {
              height: "20px",
              lineHeight: "20px",
              fontSize: "14px",
              padding: "0 0 0 4px !important",
            },
          },
        },
      }}
    />
  );
};

const StyledSpinDateField = () => {
  const [value, setValue] = useState<Date | null>(null);
  const [focused, setFocused] = useState(false);

  const handleDateChange = (days: number) => {
    const baseDate = value && !isNaN(value.getTime()) ? value : new Date();
    const newDate = new Date(baseDate);
    newDate.setDate(newDate.getDate() + days);
    setValue(newDate);
  };

  return (
    <DateField
      value={value}
      onChange={(newValue) => setValue(newValue)}
      format={focused ? "yyyyMMdd" : "yyyy年 MM月 dd日"}
      slotProps={{
        textField: {
          id: "date-field-with-id",
          error: false, // バリデーションエラー（赤枠）を無効化
          onFocus: () => setFocused(true),
          onBlur: () => setFocused(false),
          slotProps: {
            input: {
              endAdornment: (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <button
                    type="button"
                    onClick={() => handleDateChange(1)}
                    onMouseDown={(e) => e.preventDefault()}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      padding: 0,
                      lineHeight: 0,
                      height: "10px",
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M7 14l5-5 5 5z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDateChange(-1)}
                    onMouseDown={(e) => e.preventDefault()}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      padding: 0,
                      lineHeight: 0,
                      height: "10px",
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M7 10l5 5 5-5z" />
                    </svg>
                  </button>
                </div>
              ),
            },
          },
          sx: {
            width: "150px",
            "& .MuiOutlinedInput-root, & .MuiPickersOutlinedInput-root": {
              padding: 0,
              paddingRight: "2px",
            },
            "& .MuiInputBase-input, & .MuiPickersInputBase-sectionsContainer, & .MuiPickersSectionList-root":
            {
              height: "20px",
              lineHeight: "20px",
              fontSize: "14px",
              padding: "0 0 0 4px !important",
            },
          },
        },
      }}
    />
  );
};

const GengoSpinTextField = () => {
  const [value, setValue] = useState<Date | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);

  const lastEraRef = useRef<"令和" | "平成" | "昭和" | "明治">("令和");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const ERAS = [
    { name: "令和", start: new Date(2019, 4, 1) },
    { name: "平成", start: new Date(1989, 0, 8) },
    { name: "昭和", start: new Date(1926, 11, 25) },
    { name: "明治", start: new Date(1868, 0, 25) },
  ] as const;

  const getEraFromDate = (date: Date) => {
    for (const era of ERAS) {
      if (date >= era.start) {
        const year = date.getFullYear() - era.start.getFullYear() + 1;
        return { era: era.name, year };
      }
    }
    return null;
  };

  const formatEra = (date: Date | null) => {
    if (!date) return "";
    const info = getEraFromDate(date);
    if (!info) return "";
    const y = info.year.toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const d = date.getDate().toString().padStart(2, "0");
    return `${info.era}${y}年${m}月${d}日`;
  };

  const formatYYMMDD = (date: Date) => {
    const info = getEraFromDate(date);
    if (!info) return "";
    const y = info.year.toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const d = date.getDate().toString().padStart(2, "0");
    return `${y}${m}${d}`;
  };

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
    const year = eraDef.start.getFullYear() + yy - 1;
    const date = new Date(year, mm - 1, dd);
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== mm - 1 ||
      date.getDate() !== dd
    )
      return null;
    if (date < eraDef.start) return null;
    return date;
  };
  useEffect(() => {
    if (focused && inputRef.current) {
      inputRef.current.select();
    }
  }, [focused]);

  const handleFocus = () => setFocused(true);

  // 【最適化2 & 3】 不要なガードを削除し、ロジックを平坦化
  const handleBlur = () => {
    setFocused(false);

    // タイピングされていないなら何もしない
    if (editing === null) return;

    // バッファのクリアを確実に実行するための try-finally 的な構造
    const inputBuffer = editing;
    setEditing(null); // 先に状態をリセット

    if (!inputBuffer) {
      setValue(null);
      return;
    }

    const parsed = parseEraDate(inputBuffer, lastEraRef.current);
    if (parsed) {
      const info = getEraFromDate(parsed);
      if (info) lastEraRef.current = info.era;
      setValue(parsed);
    }
    // パース失敗時は setEditing(null) だけされて値は元のまま（キャンセル扱い）
  };

  const handleChange = (next: string) => {
    if (focused && /^\d{0,6}$/.test(next)) {
      setEditing(next);
    }
  };

  const handleSpin = (days: number) => {
    const base = value && !isNaN(value.getTime()) ? value : new Date();
    const next = new Date(base);
    next.setDate(next.getDate() + days);

    const info = getEraFromDate(next);
    if (info) lastEraRef.current = info.era;

    setValue(next);
    setEditing(null);
    setFocused(true);
    inputRef.current?.focus();
  };

  const displayValue = focused
    ? editing ?? (value ? formatYYMMDD(value) : "")
    : formatEra(value);

  return (
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
            <div style={{ display: "flex", flexDirection: "column" }}>
              <button
                type="button"
                tabIndex={-1}
                // この preventDefault があるため、handleBlur 内の判定は不要になる
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSpin(1)}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  padding: 0,
                  lineHeight: 0,
                  height: "10px",
                }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M7 14l5-5 5 5z" />
                </svg>
              </button>
              <button
                type="button"
                tabIndex={-1}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSpin(-1)}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  padding: 0,
                  lineHeight: 0,
                  height: "10px",
                }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M7 10l5 5 5-5z" />
                </svg>
              </button>
            </div>
          ),
        },
      }}
      sx={{
        width: "150px",
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
  );
};

const TextFieldAndDateCalender = () => {
  const [value, setValue] = useState<Date | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const textFieldRef = useRef<HTMLDivElement | null>(null);
  const [view, setView] = useState<DateView>("day");

  const handleOpen = () => {
    setAnchorEl(textFieldRef.current);
    setView("day");
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleEntered = () => {
    // Popoverのアニメーション完了後に実行されるため、確実に要素が存在する
    if (calendarRef.current) {
      const dayButton = calendarRef.current.querySelector(
        'button[role="gridcell"][tabindex="0"]'
      ) as HTMLElement;
      if (dayButton) {
        dayButton.focus();
      }
    }
  };

  return (
    <>
      <TextField
        ref={textFieldRef}
        value={value ? format(value, "yyyy-MM-dd") : ""}
        onChange={(e) => {
          const d = parse(e.target.value, "yyyy-MM-dd", new Date());
          setValue(isNaN(d.getTime()) ? null : d);
        }}
        // フォーカスを外したときコンソールにvalueを表示（動作確認用）
        onBlur={() => console.log(value)}
        slotProps={{
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
          width: "150px",
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
        //
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
              if (view === "day") {
                handleClose();
              }
            }}
          />
        </Box>
      </Popover>
    </>
  );
};

const GengoDateCalender = () => {
  const [value, setValue] = useState<Date | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);
  // ユーザーがyyMMdd形式で入力した際に、どの元号で解釈するかのヒントとして最後に使用された元号を保持する。
  const lastEraRef = useRef<"令和" | "平成" | "昭和" | "明治">("令和");
  const inputRef = useRef<HTMLInputElement | null>(null);

  // --- Popover (カレンダー) 関連のstate ---
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<DateView>("day");

  const ERAS = [
    { name: "令和", start: new Date(2019, 4, 1) },
    { name: "平成", start: new Date(1989, 0, 8) },
    { name: "昭和", start: new Date(1926, 11, 25) },
    { name: "明治", start: new Date(1868, 0, 25) },
  ] as const;

  const getEraFromDate = (date: Date) => {
    for (const era of ERAS) {
      if (date >= era.start) {
        const year = date.getFullYear() - era.start.getFullYear() + 1;
        return { era: era.name, year };
      }
    }
    return null;
  };

  const formatEra = (date: Date | null) => {
    if (!date) return "";
    const info = getEraFromDate(date);
    if (!info) return "";
    const y = info.year.toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const d = date.getDate().toString().padStart(2, "0");
    return `${info.era}${y}年${m}月${d}日`;
  };

  const formatYYMMDD = (date: Date) => {
    const info = getEraFromDate(date);
    if (!info) return "";
    const y = info.year.toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const d = date.getDate().toString().padStart(2, "0");
    return `${y}${m}${d}`;
  };

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
    if (editing === null) return;

    // 先に編集バッファをキャプチャし、状態をリセットする
    const inputBuffer = editing;
    setEditing(null);

    // 入力値が空文字列の場合は日付をnullにする
    if (!inputBuffer) {
      setValue(null);
      return;
    }

    // 最後に使われた元号をヒントに日付をパースする
    const parsed = parseEraDate(inputBuffer, lastEraRef.current);
    if (parsed) {
      // パースに成功した場合のみ、日付を更新し、使用された元号を記憶する。
      const info = getEraFromDate(parsed);
      if (info) lastEraRef.current = info.era;
      setValue(parsed);
    }
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
          width: "150px",
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
              }
              if (view === "day") {
                handleClose();
              }
            }}
          />
        </Box>
      </Popover>
    </>
  );
};
