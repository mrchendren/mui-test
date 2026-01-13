import { useState } from "react";
import { Box, FormControl, FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material";
import { AutoCompleteTest } from "./AutoCompleteTest";
import { DateBoxTest } from "./DateBoxTest";
import { CustomBoxTest } from "./CustomBoxTest";
import { DataGridTest } from "./DataGridTest";

type TestComponent = "autocomplete" | "datebox" | "custombox" | "datagrid";

export const TestPage = () => {
  const [selectedTest, setSelectedTest] = useState<TestComponent>("autocomplete");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTest(event.target.value as TestComponent);
  };

  const renderTestComponent = () => {
    switch (selectedTest) {
      case "autocomplete":
        return <AutoCompleteTest />;
      case "datebox":
        return <DateBoxTest />;
      case "custombox":
        return <CustomBoxTest />;
      case "datagrid":
        return <DataGridTest />;
      default:
        return <AutoCompleteTest />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        テストページ
      </Typography>

      <FormControl component="fieldset" sx={{ mb: 3 }}>
        <RadioGroup
          row
          value={selectedTest}
          onChange={handleChange}
          aria-label="テストコンポーネント選択"
        >
          <FormControlLabel
            value="autocomplete"
            control={<Radio />}
            label="AutoComplete"
          />
          <FormControlLabel
            value="datebox"
            control={<Radio />}
            label="DateBox"
          />
          <FormControlLabel
            value="custombox"
            control={<Radio />}
            label="CustomBox"
          />
          <FormControlLabel
            value="datagrid"
            control={<Radio />}
            label="DataGrid"
          />
        </RadioGroup>
      </FormControl>

      <Box sx={{ mt: 3 }}>
        {renderTestComponent()}
      </Box>
    </Box>
  );
};

