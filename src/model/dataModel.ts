import { NetworkModelType } from "./networktype";

export class DeviceInformation {
  roomid?: any;
  name?: string;
  id?: string;
  browserName?: string;
  position?: number;
  totalDevice?: number;
  size?: {
    width: number,
    height: number
  }
}

export interface RoomState {
  config?: AnimationConfig;
  roomId: string;
  numberDevice: number;
  listDevice: Array<DeviceInformation>;
  roomStatus?: string;
  roomEventSource?: EventSource;
  deviceId?: string;
  isMaster?: boolean;
  isStart?: boolean;
  isPause?: boolean;
  isError?: boolean;
  isLoading?: boolean;
  isDisconnect?: boolean;
  errorMessage?: string;
}
export interface RootState {
  room: RoomState,
  app: any,
}
export interface AnimationConfig {
  message?: string;
  numberDevice?: number;
  listDevice?: Array<DeviceInformation>;
  bgColor?: string;
  textGradientColor?: [string, string];
}
export class EffectConfig {
  message: string;
  speed: number;
  textGradientColor: [string, string];
  bg_color: string;
  font_style: string;
  font_size: number = 20;
  distance_text: number = 50;// khoang cach' chay. giua 2 thiet bi.
  distance_device: number = 5;// khoang cach' giua 2 chu~ lien tuc. trong text
  currentDevice: DeviceInformation;
  allDevices: Array<DeviceInformation>;
  totalDevice: number;
  public stringToColor(hex: string): number {
    return parseInt(hex.replace(/^#/, ''), 16);
  }
}


export interface IEffect {
  isPaused: boolean;
  isStarted: boolean;
  start(config?: any): boolean
  stop(): boolean;
  pause(): boolean
}

export interface NetworkModel {
  isStart?: boolean;
  isPause?: boolean;
  roomId?: string;
  error?: string;
  type: NetworkModelType,
  config?: AnimationConfig;
  device?: DeviceInformation;
  listDevice?: Array<DeviceInformation>;
}

export const createUpdateConfigPacket = (state: RoomState, type: NetworkModelType) => {
  const packet: NetworkModel = {
    type: type as any,
    config: {
      bgColor: state.config.bgColor,
      textGradientColor: state.config.textGradientColor,
      message: state.config.message,
    },
    listDevice: state.listDevice
  };
  return packet;
}
export const createUpdateDevicePacket = (device: DeviceInformation, type: NetworkModelType) => {
  const packet: NetworkModel = {
    type: type as any,
    device: {
      id: device.id,
      roomid: device.roomid,
      name: device.name,
      browserName: device.browserName,
      position: device.position,
      size: { width: window.innerWidth - 2, height: window.innerHeight - 2 }
    }
  };
  return packet;
}