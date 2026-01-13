import { Box, Typography } from "@mui/material";
import type { BoxProps } from "@mui/material/Box";

// ============================================
// カスタムBoxコンポーネント
// MUI Boxをベースにボーダーのスタイル改造のみを適用
// ============================================

interface CustomBoxProps extends BoxProps {
  children?: React.ReactNode;
}

const CustomBox = ({ children, sx, ...other }: CustomBoxProps) => {
  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider", // MUIのテーマカラーを使用
        ...sx, // ユーザー指定のスタイルで上書き可能
      }}
      {...other}
    >
      {children}
    </Box>
  );
};

// ============================================
// テストページ
// ============================================

export const CustomBoxTest = () => {
  return (
    <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
      <Typography variant="h5">CustomBox テスト</Typography>

      {/* 基本的な使用例 */}
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          1. 基本的な使用例
        </Typography>
        <CustomBox sx={{ p: 2 }}>
          <Typography>シンプルなテキストコンテンツ</Typography>
        </CustomBox>
      </Box>

      {/* 複数の子要素を含む例 */}
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          2. 複数の子要素を含む例
        </Typography>
        <CustomBox sx={{ p: 2 }}>
          <Typography variant="h6">タイトル</Typography>
          <Typography>説明文がここに入ります。</Typography>
          <Typography color="text.secondary">補足情報</Typography>
        </CustomBox>
      </Box>

      {/* カスタムスタイルで上書きする例 */}
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          3. カスタムスタイルで上書きする例
        </Typography>
        <CustomBox
          sx={{
            p: 2,
            borderColor: "primary.main",
            borderWidth: 2,
            borderRadius: 1,
          }}
        >
          <Typography>ボーダー色とサイズをカスタマイズ</Typography>
        </CustomBox>
      </Box>

      {/* 異なるサイズやレイアウトの例 */}
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          4. 異なるサイズやレイアウトの例
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <CustomBox sx={{ p: 1, width: 100, height: 100 }}>
            <Typography variant="caption">小</Typography>
          </CustomBox>
          <CustomBox sx={{ p: 2, width: 150, height: 100 }}>
            <Typography variant="caption">中</Typography>
          </CustomBox>
          <CustomBox sx={{ p: 3, width: 200, height: 100 }}>
            <Typography variant="caption">大</Typography>
          </CustomBox>
        </Box>
      </Box>

      {/* ネストした例 */}
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          5. ネストした例
        </Typography>
        <CustomBox sx={{ p: 2 }}>
          <Typography gutterBottom>外側のCustomBox</Typography>
          <CustomBox sx={{ p: 2, borderColor: "secondary.main" }}>
            <Typography>内側のCustomBox</Typography>
          </CustomBox>
        </CustomBox>
      </Box>
    </Box>
  );
};

