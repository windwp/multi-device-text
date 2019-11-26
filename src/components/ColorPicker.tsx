import React, { CSSProperties, useCallback, useEffect, useState } from "react";
import { ColorResult, SketchPicker } from "react-color";
import reactCSS from "reactcss";
const styles = reactCSS({
  default: {
    color: {
      width: "36px",
      height: "14px",
      borderRadius: "2px"
    },
    swatch: {
      padding: "5px",
      background: "#fff",
      borderRadius: "1px",
      boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
      display: "inline-block",
      cursor: "pointer"
    },
    popover: {
      position: "absolute",
      zIndex: 2
    } as CSSProperties,
    cover: {
      position: "fixed",
      top: "0px",
      right: "0px",
      bottom: "0px",
      left: "0px"
    } as CSSProperties
  }
});
const ColorPicker: React.FC<{
  color: string;
  handleChange: (a: string) => void;
}> = ({ color, handleChange }) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [icolor, setColor] = useState(color);
  const togglePicker = useCallback(() => {
    setDisplayColorPicker(c => !c);
  }, []);
  useEffect(() => {
    setColor(color);
  }, [color]);
  const onChange = useCallback(
    (color: ColorResult) => {
      setColor(color.hex);
      handleChange(color.hex);
    },
    [handleChange]
  );
  return (
    <div>
      <div style={styles.swatch} onClick={togglePicker}>
        <div style={{ ...styles.color, background: icolor }} />
      </div>
      {displayColorPicker ? (
        <div style={styles.popover}>
          <div style={styles.cover} onClick={togglePicker} />
          <SketchPicker color={icolor} onChange={onChange} />
        </div>
      ) : null}
    </div>
  );
};

export default React.memo(ColorPicker);
