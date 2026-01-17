import { useMemo, useState } from "react";
import { Box, Typography, Autocomplete, TextField } from "@mui/material";
import { DataGrid } from "react-data-grid";
import type { RenderEditCellProps, RenderCellProps, Column } from "react-data-grid";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateBoxColumn, DateCell } from "./DateBoxColumn";
import "react-data-grid/lib/styles.css";

// 年代の選択肢データ
interface GenerationOption {
    id: string;
    label: string;
}

const generationOptions: GenerationOption[] = [
    { id: "01", label: "10代以下" },
    { id: "02", label: "20代" },
    { id: "03", label: "30代" },
    { id: "04", label: "40代" },
    { id: "05", label: "50代" },
    { id: "06", label: "60代" },
    { id: "07", label: "70代" },
    { id: "08", label: "80代以上" },
];

// idからlabelを取得するヘルパー関数
const getGenerationLabel = (id: string): string => {
    const option = generationOptions.find((opt) => opt.id === id);
    return option ? option.label : id;
};

interface Row {
    id: number;
    name: string;
    generation: string; // 年代のid（"01", "02"など）
    email: string;
    date: Date | null; // 日付
}

// 年代列の編集セルコンポーネント
const GenerationEditCell = ({
    row,
    onRowChange,
    onClose,
}: RenderEditCellProps<Row>) => {
    const [inputValue, setInputValue] = useState<string>(row.generation);

    // 現在の値からオプションを取得
    const currentOption = generationOptions.find(
        (opt) => opt.id === row.generation
    );

    return (
        <Autocomplete
            options={generationOptions}
            value={currentOption}
            inputValue={inputValue}
            freeSolo
            forcePopupIcon={true}
            filterOptions={(options) => options}
            disableClearable
            autoFocus
            openOnFocus
            getOptionLabel={(option) => {
                if (typeof option === "string") {
                    return option;
                }
                // 入力欄表示用にIDを返す
                return option.id;
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onInputChange={(_event, newInputValue) => {
                // 入力値をIDとして管理
                setInputValue(newInputValue);
            }}
            onChange={(_event, newValue) => {
                if (newValue && typeof newValue !== "string") {
                    setInputValue(newValue.id);
                    onRowChange({ ...row, generation: newValue.id }, true);
                }
            }}
            onBlur={() => {
                // 入力値をIDとして確定
                onRowChange({ ...row, generation: inputValue }, true);
                // 編集を終了 onCloseを実行すると編集が終了する trueを渡す
                onClose(true);
            }}
            slotProps={{
                paper: {
                    sx: {
                        "& .MuiAutocomplete-listbox .MuiAutocomplete-option": {
                            minHeight: "auto",
                            height: "20px",
                            lineHeight: "20px",
                            fontSize: "14px",
                            padding: 0,
                            paddingLeft: "4px",
                        },
                    },
                },
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    slotProps={{
                        htmlInput: {
                            ...params.inputProps,
                            maxLength: 2,
                        },
                    }}
                    sx={{
                        width: "100%",
                        "& .MuiOutlinedInput-root": {
                            padding: 0,
                            paddingRight: "20px !important",
                            "& .MuiAutocomplete-input": {
                                height: "20px",
                                lineHeight: "20px",
                                fontSize: "14px",
                                padding: 0,
                                paddingLeft: "4px",
                            },
                            "& .MuiAutocomplete-endAdornment": {
                                right: "2px",
                            },
                        },
                    }}
                />
            )}
            sx={{
                width: "100%",
                height: "100%",
            }}
        />
    );
};

// 年代列の表示セルコンポーネント
const GenerationCell = ({ row }: RenderCellProps<Row>) => {
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
            {getGenerationLabel(row.generation)}
        </Box>
    );
};

export const DataGridTest = () => {
    const [rows, setRows] = useState<Row[]>([
        { id: 1, name: "山田太郎", generation: "02", email: "yamada@example.com", date: null },
        { id: 2, name: "佐藤花子", generation: "03", email: "sato@example.com", date: null },
        { id: 3, name: "鈴木一郎", generation: "02", email: "suzuki@example.com", date: null },
    ]);

    const columns: Column<Row>[] = useMemo(
        () => [
            { key: "id", name: "ID", width: 80 },
            { key: "name", name: "名前", width: 150 },
            {
                key: "generation",
                name: "年代",
                width: 150,
                renderEditCell: GenerationEditCell,
                renderCell: GenerationCell,
            },
            { key: "email", name: "メールアドレス", width: 250 },
            {
                key: "date",
                name: "日付",
                width: 200,
                renderEditCell: DateBoxColumn,
                renderCell: DateCell,
            },
        ],
        []
    );

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    DataGrid テスト
                </Typography>
                <Box
                    sx={{
                        mt: 2,
                        "& .rdg-cell": {
                            padding: 0,
                        },
                    }}
                >
                    <DataGrid
                        columns={columns}
                        rows={rows}
                        onRowsChange={setRows}
                        rowHeight={20}
                        style={{
                            height: "100px",
                        }}
                    />
                </Box>
                <Box>
                    <DataGrid
                        columns={columns}
                        rows={rows}
                        onRowsChange={setRows}
                        rowHeight={30}
                        style={{
                            height: "100px",
                            // width: "200px",
                            fontSize: "14px",
                            // 3. スクロールバーの制御
                            // "auto"   : 必要に応じて表示（デフォルト）
                            // "scroll" : 常に表示（領域を確保）
                            // "hidden" : 強制的に非表示（はみ出した部分は見えなくなる）
                            // overflowY: "scroll", // 縦スクロールバーを常に表示
                            // overflowX: "hidden", // 横スクロールバーを強制非表示
                            position: 'absolute',
                            top: '40px',
                            left: 40,
                        }}
                    />
                </Box>
            </Box>
        </LocalizationProvider>
    );
};
