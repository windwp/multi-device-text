import React, { Fragment, useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createSelector } from "reselect";
import useWindowSize from "../../common/use-window-size";
import { createTempDevice } from "../../common/utils";
import { Error, Loading } from "../../components/mini";
import RetryConnectPanel from "../../components/retry-connect";
import { createUpdateDevicePacket, DeviceInformation, NetworkModel, RoomState, RootState } from "../../model/dataModel";
import { NETWORK_JOIN_ROOM, NETWORK_UPDATE } from "../../model/networktype";
import { toggleHeader } from "../../state/app.action";
import * as roomAction from "../room-create/state/room-create.action";
import CanvasDevice, { CanvasHandler } from "./canvas-device";
import "./room-join.css";
const deviceSelector = createSelector(
  (state: RootState) => ({
    list: state.room.listDevice,
    id: state.room.deviceId
  }),
  combine => {
    return combine.list ? combine.list.find(o => o.id === combine.id) : null;
  }
);
const RoomJoin: React.FC = () => {
  const { id: roomId } = useParams();
  const canvasRef = useRef<CanvasHandler>(null);
  const device = useSelector((state: RootState) => deviceSelector(state));
  const state = useSelector<RootState, any>(state => state.room) as RoomState;
  const dispatch = useDispatch();
  const size = useWindowSize();
  useEffect(() => {
    if (device && device.id) {
      const packet = createUpdateDevicePacket(
        device,
        NETWORK_UPDATE
      );
      dispatch(roomAction.updateRequestRoom(roomId, device.id, packet));
    }
  }, [size]);

  useEffect(() => {
    const mydevice: DeviceInformation = createTempDevice();
    var packet: NetworkModel = {
      type: NETWORK_JOIN_ROOM,
      device: mydevice
    };
    dispatch(roomAction.updateState({ roomId }));
    dispatch(roomAction.joinRequestRoom(roomId, state.deviceId, packet));
  }, [roomId]);
  var start = useCallback(() => {
    dispatch(toggleHeader(false));
    var item = { ...state.config, listDevice: state.listDevice };
    canvasRef.current.startAnimation(item, device);
  }, [state.config, state.listDevice]);
  useEffect(() => {
    if (state.isStart) {
      start();
      return;
    }
  }, [state.isStart]);
  useEffect(() => {
    if (!canvasRef.current) return;
    if (state.isPause) {
      canvasRef.current.pauseAnimation();
      return;
    }
    canvasRef.current.pauseAnimation();
  }, [state.isPause]);
  return (
    <div>
      {(state.isLoading || (!device && !state.isError && !state.isStart)) && (
        <Loading />
      )}
      {!state.isLoading && (
        <Fragment>
          {!state.isStart && state.isDisconnect && <RetryConnectPanel />}
          {state.isError && <Error message={state.errorMessage}></Error>}
          {state.isStart && <CanvasDevice config={device} ref={canvasRef} />}
          {state.isStart && state.isPause && device && (
            <div className="room-pause">
              <div className="main-container">
                <div>
                  <div className="device-title">{device.name}</div>
                </div>
              </div>
            </div>
          )}
          {!state.isStart && !state.isDisconnect && device && (
            <div className="room-join">
              <div className="main-container">
                <div className="center-container m-t-10">
                  <label>It is ready to start</label>
                </div>
                <div>
                  <div className="device-title">{device.name}</div>
                </div>
              </div>
            </div>
          )}
        </Fragment>
      )}
    </div>
  );
};

export default RoomJoin;
