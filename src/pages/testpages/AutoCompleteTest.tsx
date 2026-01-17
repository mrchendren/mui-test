import { Autocomplete, TextField } from "@mui/material";

// AutoCompleteで使える形式のデータ
// { label: string, id: number }[] の形にする
const options = [
  { label: "Option 1", id: 1 },
  { label: "Option 2", id: 2 },
  { label: "Option 3", id: 3 },
];
export const AutoCompleteTest = () => {

  return (
    <>
      {/* 入力欄のサイズの参考 */}
      <TextField
        sx={{
          width: "100px",
          "& .MuiOutlinedInput-input": {
            height: "20px",
            lineHeight: "20px",
            fontSize: "14px",
            padding: 0,
            paddingLeft: "4px",
          },
        }}
      />
      {/* テキストフィールドと同じようなサイズにする */}
      <Autocomplete
        options={options}
        freeSolo
        forcePopupIcon={true} // 三角ボタン表示
        // 絞り込みを無効化（常に全件表示）
        filterOptions={(options) => options}
        // クリアボタンを非表示にする
        disableClearable
        // オーバーライドして表示ラベルをカスタマイズ
        // 今はまだ使わないのでコメントアウトしておく
        // getOptionLabel={(option) => {
        //   // return option.label;
        //   if (typeof option === "string") {
        //     return option;
        //   }
        //   return `${option.id}: ${option.label}`;
        // }}
        renderInput={(params) => (
          <TextField
            {...params}
            sx={{
              width: "100px",
              // 入力エリア（コンテナ）のパディングを0にする
              "& .MuiOutlinedInput-root": {
                padding: 0,
                paddingRight: "20px !important", // アイコン分のパディングを詰める
                // Autocomplete特有のスタイルを上書きするため、詳細度を上げる
                "& .MuiAutocomplete-input": {
                  height: "20px",
                  lineHeight: "20px",
                  fontSize: "14px",
                  padding: 0,
                  paddingLeft: "4px",
                },
                // アイコンの位置を右に詰める
                "& .MuiAutocomplete-endAdornment": {
                  right: "2px",
                },
              },
            }}
          />
        )}
      />

      {/* クリック（フォーカス）時に全選択されるテキストフィールド */}
      <TextField
        label="Select All"
        defaultValue="Click me"
        sx={{ width: "100px", marginTop: "20px" }}
        onFocus={(event) => {
          event.target.select();
        }}
      />

      {/* 4つ目：リスト項目の高さとフォントサイズを入力欄に合わせる */}
      <Autocomplete
        options={options}
        freeSolo
        forcePopupIcon={true}
        filterOptions={(options) => options}
        disableClearable
        slotProps={{
          paper: {
            sx: {
              "& .MuiAutocomplete-option": {
                minHeight: "auto", // デフォルトの最小高さをリセット
                height: "20px",
                lineHeight: "20px",
                fontSize: "14px",
                padding: 0, // 入力欄に合わせてパディング調整
                paddingLeft: "4px", // 入力欄に合わせてパディング調整
              },
            },
          },
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            sx={{
              width: "100px",
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
      />

      {/* 5つ目：入力桁数を3桁に制限 */}
      <Autocomplete
        options={options}
        freeSolo
        forcePopupIcon={true}
        filterOptions={(options) => options}
        disableClearable
        slotProps={{
          paper: {
            sx: {
              // 詳細度を上げてデフォルトのパディング（padding-top: 6px等）を確実に上書きする
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
                ...params.inputProps, // Autocompleteの必須プロパティを展開
                maxLength: 3, // 3桁制限を追加
              },
            }}
            sx={{
              width: "100px",
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
      />
    </>
  );
};
