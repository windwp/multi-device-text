import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import PixilRunning from "../../effect/pixilRunning";
import { AnimationConfig, DeviceInformation, EffectConfig, IEffect } from "../../model/dataModel";
const data: {
  stage?: IEffect;
} = {};
export interface CanvasHandler {
  startAnimation(animation: AnimationConfig, device: DeviceInformation): void;
  stopAnimation(): void;
  pauseAnimation(): void;
}
type PhoneProps = { config: DeviceInformation };
const CanvasDevice: React.RefForwardingComponent<any, PhoneProps> = (
  { config },
  ref
) => {
  const [state, setstate] = useState(data);
  const canvasRef = useRef<HTMLCanvasElement>();
  function startAnimation(
    animationData: AnimationConfig,
    device: DeviceInformation
  ) {
    stopAnimation();
    if (!canvasRef.current) {
      setTimeout(() => startAnimation(animationData, device), 2000);
      return;
    }
    console.log("START ANIMATION");
    let config = new EffectConfig();
    config.textGradientColor = animationData.textGradientColor;
    config.bg_color = animationData.bgColor || "#0000ff";
    config.font_size = 40;
    config.font_style = "20px Arial";
    config.speed = 2;
    config.distance_device = 5;
    config.distance_text = 50;
    config.currentDevice = device;
    config.message = animationData.message;
    config.allDevices = animationData.listDevice;
    config.totalDevice = animationData.listDevice.length;
    canvasRef.current.width = device.size.width;
    canvasRef.current.height = device.size.height;
    var stage = new PixilRunning(canvasRef.current, config);
    stage.start();
    setstate({ ...state, stage });
  }
  useImperativeHandle(
    ref,
    (): CanvasHandler => ({
      stopAnimation: () => stopAnimation(),
      pauseAnimation: () => pauseAnimation(),
      startAnimation: (
        animation: AnimationConfig,
        device: DeviceInformation
      ) => {
        startAnimation(animation, device);
      }
    })
  );
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
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100vh" }}
      ></canvas>
    </div>
  );
};
const PhoneCanvasRefWrapper = React.forwardRef<any, PhoneProps>(CanvasDevice);
export default PhoneCanvasRefWrapper;
