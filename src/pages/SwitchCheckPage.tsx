import { Box } from "@mui/material";
import RadioSet from "./switchcheckpages/RadioSet";
import DisplayByRadio from "./switchcheckpages/DisplayByRadio";

const SwitchCheckPage = () => {
    return (
        <Box>
            <h5>switch page test</h5>
            <RadioSet radioGroupName="radio-set" defaultValue="1" />
            <DisplayByRadio radioGroupName="radio-set" switchContentId="1">
                <div>ここはラジオボタンの値が1のときに表示されます</div>
            </DisplayByRadio>
            <DisplayByRadio radioGroupName="radio-set" switchContentId="2">
                <div>ここはラジオボタンの値が2のときに表示されます</div>
            </DisplayByRadio>
            <DisplayByRadio radioGroupName="radio-set" switchContentId="3">
                <div>ここはラジオボタンの値が3のときに表示されます</div>
            </DisplayByRadio>
            <DisplayByRadio radioGroupName="radio-set" switchContentId="unknown">
                <div>ここはラジオボタンの値が不明のときに表示されます</div>
            </DisplayByRadio>
        </Box>
    );
};

export default SwitchCheckPage;