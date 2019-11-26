import React, { useEffect, useImperativeHandle, useState } from "react";
import PixilRunning from "../effect/pixilRunning";
import { AnimationConfig, DeviceInformation, EffectConfig, IEffect, RoomState } from "../model/dataModel";
import "./PhoneCanvasDevice.css";
type PhoneProps = { config: DeviceInformation; style: any };
export interface PhoneCanvasHandler {
  startAnimation(param: any): void;
  stopAnimation(): void;
  pauseAnimation(): void;
  getDeviceInformation(): DeviceInformation;
}
const PhoneCanvasDevice: React.RefForwardingComponent<any, PhoneProps> = (
  { config, style },
  ref
) => {
  const data: {
    canvas?: HTMLCanvasElement;
    canvasSize?: { width: number; height: number };
    image?: HTMLImageElement;
    stage?: IEffect;
  } = {};
  const { name, id, position } = config;
  const [state, setstate] = useState(data);
  useEffect(() => {
    function resizeCanvas(image: HTMLImageElement, canvas: HTMLCanvasElement) {
      console.log("resize canvas");
      if (!image || !canvas) return;
      //tinh toan vi tri tuong doi cua canvas dua vao kich thuoc tam hinh` iphone
      const sourceImage = {
        width: 2144,
        height: 1182
      };
      const sourceCanvas = {
        width: 1360,
        height: 760
      };
      const positionTop = {
        left: 380,
        top: 220
      };
      const cImage = {
        width: image.width,
        height: (image.width * sourceImage.height) / sourceImage.width
      };
      const cCanvas = {
        width:
          Math.round((cImage.width * sourceCanvas.width) / sourceImage.width) +
          1,
        height:
          Math.round(
            (cImage.height * sourceCanvas.height) / sourceImage.height
          ) + 1
      };
      canvas.width = cCanvas.width;
      canvas.height = cCanvas.height;
      let top = Math.floor(
        (positionTop.top * cImage.height) / sourceImage.height
      );
      let left = Math.floor(
        (positionTop.left * cImage.width) / sourceImage.width
      );
      canvas.style.top = top + "px";
      canvas.style.left = left + "px";
      setstate(s => ({ ...s, canvasSize: cCanvas }));
    }
    resizeCanvas(state.image, state.canvas);
    return () => {};
  }, [config.totalDevice, state.image, state.canvas]);

  useImperativeHandle(
    ref,
    (): PhoneCanvasHandler => ({
      stopAnimation: () => stopAnimation(),
      pauseAnimation: () => pauseAnimation(),
      startAnimation: (param: RoomState) => {
        startAnimation(param);
      },
      getDeviceInformation: () => getDeviceInformation()
    })
  );

  function startAnimation(animationData: AnimationConfig) {
    stopAnimation();
    let config = new EffectConfig();
    config.textGradientColor = animationData.textGradientColor;
    config.bg_color = animationData.bgColor || "#0000ff";
    config.font_size = 20;
    config.font_style = "20px Arial";
    config.speed = 2;
    config.distance_device = 5;
    config.distance_text = 50;
    config.currentDevice = getDeviceInformation();
    config.message = animationData.message;
    config.allDevices = animationData.listDevice;
    config.totalDevice = animationData.numberDevice;
    var stage = new PixilRunning(state.canvas, config);
    stage.start();
    setstate({ ...state, stage });
  }
  function pauseAnimation() {
    if (state.stage) {
      state.stage.pause();
    }
  }
  function stopAnimation() {
    if (state.stage) {
      state.stage.stop();
      state.stage = null;
    }
  }

  function getDeviceInformation(): DeviceInformation {
    return {
      name: name,
      id: id,
      position: position,
      size: {
        width: state.canvasSize.width,
        height: state.canvasSize.height
      }
    };
  }
  let canvasStyle: React.CSSProperties = {
    backgroundColor: "blue",
    position: "absolute",
    top: "0px",
    left: "0px"
  } as React.CSSProperties;
  return (
    <div className="phone-device" style={style}>
      <div className="phone-title">
        <label>{name}</label>
      </div>
      <div className="phone-canvas">
        <canvas
          style={canvasStyle}
          ref={canvas => {
            if (!state.canvas && canvas) setstate(s => ({ ...s, canvas }));
          }}
        ></canvas>
        <img
          src="/images/phone.png"
          className="phone-image"
          width="100%"
          style={{ position: "absolute" }}
          ref={image => {
            if (!state.image && image) setstate(s => ({ ...s, image }));
          }}
          alt={"Phone " + position}
        />
      </div>
    </div>
  );
};

// export default PhoneCanvasDevice;
const PhoneCanvasRefWrapper = React.forwardRef<any, PhoneProps>(
  PhoneCanvasDevice
);
export default PhoneCanvasRefWrapper;
// const ComponentWithForwardedRef: React.ComponentType<Props> = React.forwardRef(
//     (props: Props, ref?: React.Ref<div>) => <div ref={ref}>{props.message}</div>
// );
