// import { useState } from "react";
// import { TextField, Autocomplete, Box } from "@mui/material";

// // 型定義
// type DisplayMode = "ID" | "LABEL" | "ID_LABEL";
// interface OptionType {
//   id: string;
//   label: string;
// }

// const options: OptionType[] = [
//   { id: "101", label: "Apple" },
//   { id: "102", label: "Banana" },
//   { id: "103", label: "Cherry" },
// ];

// export default function FinalAutocomplete() {
//   // 設定値（プロジェクトの要件に合わせて変更）
//   const [displayMode] = useState<DisplayMode>("ID_LABEL");
//   const [idMaxLength] = useState(4); // 桁数制限

//   // 内部では常にオブジェクトを保持する設計（リスト外入力時も {id,label} にする）
//   const [value, setValue] = useState<OptionType | null>(null);
//   const [inputValue, setInputValue] = useState("");

//   // 表示文字列の生成ロジック
//   const getDisplayText = (option: OptionType) => {
//     const isReal = options.some(
//       (opt) => opt.id === option.id && opt.label === option.label
//     );

//     // リスト外入力の場合、または表示モードが ID の場合
//     if (!isReal || displayMode === "ID") return option.id;

//     // リスト内かつ各モードの表示
//     if (displayMode === "LABEL") return option.label;
//     if (displayMode === "ID_LABEL") return `${option.id}: ${option.label}`;

//     return option.id;
//   };

//   return (
//     <Box sx={{ p: 3, width: 400 }}>
//       <Autocomplete
//         freeSolo
//         disableClearable
//         forcePopupIcon={true} // 三角ボタン表示
//         filterOptions={(options) => options} // 絞り込み無効
//         options={options}
//         value={value}
//         inputValue={inputValue}
//         // 型安全に比較：value が string | null の可能性があるため分岐する
//         isOptionEqualToValue={(option: any, val: any) => {
//           if (!val) return false;
//           if (typeof val === "string") return option.id === val;
//           return option.id === val.id;
//         }}
//         getOptionLabel={(option) => {
//           if (typeof option === "string") return option;
//           return getDisplayText(option as OptionType);
//         }}
//         onInputChange={(event, newInputValue) => {
//           void event;
//           setInputValue(newInputValue);
//         }}
//         onChange={(event: any, newValue: any) => {
//           void event;
//           // freeSolo の場合 newValue が string になることがある
//           if (typeof newValue === "string") {
//             setValue({ id: newValue, label: newValue });
//           } else if (newValue === null) {
//             setValue(null);
//           } else {
//             setValue(newValue as OptionType);
//           }
//         }}
//         renderInput={(params) => (
//           <TextField
//             {...(params as any)}
//             label={displayMode === "LABEL" ? "選択専用" : "ID入力または選択"}
//             onBlur={() => {
//               // フォーカスアウト時の確定処理（仕様書準拠）
//               const matched = options.find((opt) => opt.id === inputValue);
//               if (matched) {
//                 setValue(matched);
//               } else if (inputValue !== "") {
//                 setValue({ id: inputValue, label: inputValue });
//               }
//             }}
//             // inputProps をマージして maxLength / readOnly を設定
//             inputProps={{
//               ...(params.inputProps as any),
//               maxLength: idMaxLength,
//               readOnly: displayMode === "LABEL",
//             }}
//           />
//         )}
//       />
//     </Box>
//   );
// }
