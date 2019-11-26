import QRCode from "qrcode.react";
import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useSelector } from "react-redux";
import { Input } from "semantic-ui-react";
import ENV from "../../enviroment";
import { RootState } from "../../model/dataModel";
const BoxShare: React.FC = () => {
  const roomId = useSelector((state: RootState) => state.room.roomId);
  const url = `${ENV.urlDomain}room/${roomId}`;
  return (
    <div>
      <div>
        <h3 className="text-center">Share</h3>
        <CopyToClipboard text={url} onCopy={() => {}}>
          <Input value={url} className="w-100"></Input>
        </CopyToClipboard>
      </div>
      <div className="center-container">
        <QRCode
          value={url}
          size={200}
          bgColor={"#ffffff"}
          fgColor={"#000000"}
          level={"Q"}
          includeMargin={true}
          renderAs={"canvas"}
        />
      </div>
    </div>
  );
};

export default React.memo(BoxShare);
