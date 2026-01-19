import { Box, FormControlLabel, Radio, RadioGroup, styled, Typography, Divider, Chip } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';

const StyledBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5),
    backgroundColor: '#F6F9FC',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#ccc',
    border: '1px solid #0072bc',
    borderRadius: '4px',
    height: '30px',
}));

interface SwitchPattern {
    switchid: string;
    target: string;
}

interface LockPattern {
    target: string;
}

interface CompulsoryPattern {
    target: string;
}

interface Function {
    name: string;
    templateabledflag: boolean; // 仮実装では値を受け取るだけ
    switchPatterns?: SwitchPattern[]; // 仮実装では値を受け取るだけ
    lockPatterns?: LockPattern[]; // 仮実装では値を受け取るだけ
    compulsoryPatterns?: CompulsoryPattern[]; // 仮実装では値を受け取るだけ
    onClick?: (value: string) => void;
}

// 「最低1件以上」を必須にする配列の型
type NonEmptyArray<T> = [T, ...T[]];

interface FormHeaderProps {
    disptitle: string;
    functions: NonEmptyArray<Function>;
    width?: number | string; // 外枠の幅。px 数値 or CSS 文字列 ('100%', '80vw', '48rem' など)
    dispid: string;
}


// ★デバッグ表示フラグ（テスト後は false に戻してください）
const VISIBLE_DEBUG = true;

const FormHeader: React.FC<FormHeaderProps> = ({
    disptitle = '',
    functions = [],
    width = '1264px', // 現行の画面種別「標準画面」の幅のサイズx4をデフォルトとする
    dispid = '',
}) => {
    // 画面表示時は一番左のラジオボタンを選択した状態（現行踏襲）
    const [selectedFunction, setSelectedFunction] = useState(functions[0]?.name ?? '');

    // 全 functions の switchPatterns から target -> Set<switchid> のマップを作る（重複はユニーク化）
    const targetToSwitchIdsMap = useMemo(() => {
        const map = new Map<string, Set<string>>();
        functions.forEach((func) => {
            (func.switchPatterns ?? []).forEach((sp) => {
                const target = (sp?.target ?? '').trim();
                const switchid = (sp?.switchid ?? '').trim();
                if (!target || !switchid) return; // 空は除外
                if (!map.has(target)) map.set(target, new Set<string>());
                map.get(target)!.add(switchid);
            });
        });
        return map;
    }, [functions]);

    // hiddenGroupValues は初期化関数で一度だけ導出（Effect での同期的 setState を避ける）
    const [hiddenGroupValues, setHiddenGroupValues] = useState<Record<string, string>>(() => {
        const initial: Record<string, string> = {};
        const initialFunc =
            functions.find((f) => f.name === (functions[0]?.name ?? '')) ?? functions[0];

        (initialFunc?.switchPatterns ?? []).forEach((sp) => {
            const target = (sp?.target ?? '').trim();
            const switchid = (sp?.switchid ?? '').trim();
            if (!target || !switchid) return;
            initial[target] = switchid;
        });
        return initial;
    });

    // メインのラジオ切替：A案（該当 target のみ上書き／無い target は前回値維持）
    const handleFunctionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setSelectedFunction(newValue);

        const func = functions.find((f) => f.name === newValue);
        if (func?.switchPatterns && func.switchPatterns.length > 0) {
            setHiddenGroupValues((prev) => {
                const next = { ...prev };
                func.switchPatterns!.forEach((sp) => {
                    const target = (sp?.target ?? '').trim();
                    const switchid = (sp?.switchid ?? '').trim();
                    if (!target || !switchid) return;
                    next[target] = switchid;
                });
                return next;
            });
        }
    };

    // hiddenGroupValuesが変更されたとき、対応するinput要素にchangeイベントを発火
    // これにより、DisplayByRadioSwitchがDOMのchangeイベントを検出して値を更新できる
    useEffect(() => {
        for (const target of Object.keys(hiddenGroupValues)) {
            const groupName = `${target}_${dispid}`;
            const value = hiddenGroupValues[target];

            // 対象のinput要素を取得してchangeイベントを発火
            const input = document.querySelector<HTMLInputElement>(
                `input[name="${groupName}"][value="${value}"]`
            );
            if (input) {
                input.checked = true;
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }
    }, [dispid, hiddenGroupValues]);

    // ログ：見えないラジオグループの名称・候補 value・現在値（functions は不変前提）
    useEffect(() => {
        console.groupCollapsed('[FormHeader] Invisible Radio Groups Snapshot');
        for (const target of targetToSwitchIdsMap.keys()) {
            const groupName = `${target}_${dispid}`;
            const switchIds = [...(targetToSwitchIdsMap.get(target) ?? new Set<string>())];
            const selected = hiddenGroupValues[target] ?? '';
            console.log(`Group: ${groupName}`);
            console.log(`  values:`, switchIds);
            console.log(`  selected:`, selected);
        }
        console.groupEnd();
    }, [dispid, targetToSwitchIdsMap, hiddenGroupValues]);

    return (
        <Box sx={{ width }}>
            {/* タイトルバー */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 3,
                    py: 1,
                    minHeight: 36,
                    borderBottomRightRadius: '40px',
                    background: 'linear-gradient(135deg, #f6f9fc 0%, #b7deff 80%, #90caf9ff 150%)',
                    color: '#025290',
                }}
            >
                <Typography
                    variant="h6"
                    sx={{ flexGrow: 1, color: '#025290', fontSize: 20, fontWeight: 'bold' }}
                >
                    {disptitle}
                </Typography>
            </Box>

            {/* メインのラジオグループ + デバッグ用“見えない”ラジオグループ（右側に表示） */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'stretch',
                    gap: 2,
                    px: 1,
                    py: 0.5,
                }}
            >
                {/* メイン：表示されるラジオグループ (name は固定値のまま) */}
                <StyledBox sx={{ flexShrink: 0 }}>
                    <RadioGroup
                        row
                        value={selectedFunction}
                        onChange={handleFunctionChange}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                        }}
                    >
                        {functions.map((func, index) => (
                            <FormControlLabel
                                key={index}
                                value={func.name}
                                control={
                                    <Radio
                                        sx={{
                                            '& .MuiSvgIcon-root': { fontSize: 18 },
                                            color: '#025290',
                                        }}
                                    />
                                }
                                label={func.name}
                                sx={{
                                    margin: 0,
                                    '& .MuiFormControlLabel-label': {
                                        color: '#025290',
                                        fontSize: '18px',
                                    },
                                }}
                            />
                        ))}
                    </RadioGroup>
                </StyledBox>

                {/* 仕切り */}
                <Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />

                {/* デバッグ表示：これまで“見えない”ラジオを右側に可視化 */}
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1.5,
                        alignItems: 'center',
                        py: 0.5,
                    }}
                >
                    {[...targetToSwitchIdsMap.keys()].map((target) => {
                        const hiddenName = `${target}_${dispid}`;
                        const switchIds = [...(targetToSwitchIdsMap.get(target) ?? new Set<string>())];
                        const current = hiddenGroupValues[target] ?? '';

                        // VISIBLE_DEBUG が false のときだけ完全非表示に戻す
                        const visibilitySx = VISIBLE_DEBUG
                            ? {
                                px: 1,
                                py: 0.5,
                                border: '1px dashed #90caf9',
                                borderRadius: 1,
                                backgroundColor: '#f8fbff',
                                display: 'flex',
                            }
                            : { display: 'none' as const };

                        return (
                            <Box key={hiddenName} sx={visibilitySx}>
                                <Chip
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    label={`Group: ${hiddenName}`}
                                    sx={{ mb: 0.5, fontSize: 11 }}
                                />
                                <RadioGroup
                                    name={hiddenName}
                                    value={current}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        flexWrap: 'wrap',
                                        gap: 1,
                                    }}
                                >
                                    {switchIds.map((sid) => (
                                        <FormControlLabel
                                            key={sid}
                                            value={sid}
                                            control={
                                                <Radio
                                                    size="small"
                                                    sx={{
                                                        '& .MuiSvgIcon-root': { fontSize: 16 },
                                                        color: '#1976d2',
                                                    }}
                                                />
                                            }
                                            label={sid}
                                            sx={{
                                                m: 0,
                                                '& .MuiFormControlLabel-label': { fontSize: 12, color: '#1976d2' },
                                            }}
                                        />
                                    ))}
                                </RadioGroup>
                                {/* HTML標準ラジオボタン版（コメントアウト）
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        flexWrap: 'wrap',
                                        gap: 1,
                                    }}
                                >
                                    {switchIds.map((sid) => (
                                        <label
                                            key={sid}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                                color: '#1976d2',
                                            }}
                                        >
                                            <input
                                                type="radio"
                                                name={hiddenName}
                                                value={sid}
                                                defaultChecked={sid === current}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setHiddenGroupValues((prev) => ({
                                                            ...prev,
                                                            [target]: sid,
                                                        }));
                                                    }
                                                }}
                                                style={{
                                                    cursor: 'pointer',
                                                }}
                                            />
                                            <span>{sid}</span>
                                        </label>
                                    ))}
                                </Box>
                                */}
                            </Box>
                        );
                    })}
                </Box>
            </Box>
        </Box>
    );
};

export default FormHeader;