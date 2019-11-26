import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Container } from "semantic-ui-react";
import { createTempDevice } from "../common/utils";
import { DeviceInformation, NetworkModel, RootState } from "../model/dataModel";
import { NETWORK_JOIN_ROOM } from "../model/networktype";
import { createRequestRoom, joinRequestRoom, updateState } from "../pages/room-create/state/room-create.action";

const RetryConnectPanel = () => {
  const state = useSelector((state: RootState) => state.room);
  const dispatch = useDispatch();

  const retry = useCallback(() => {
    dispatch(updateState({ isLoading: true }));
    if (state.isMaster) {
      dispatch(createRequestRoom(state.roomId, state.deviceId));
    } else {
      const mydevice: DeviceInformation = createTempDevice();
      var packet: NetworkModel = {
        type: NETWORK_JOIN_ROOM,
        device: mydevice
      };
      dispatch(joinRequestRoom(state.roomId, state.deviceId, packet));
    }
  }, [dispatch, state.isMaster, state.roomId, state.deviceId]);
  return (
    <Container className="setting-form box-wrapper p-h-10 p-v-10 m-t-10">
      <div>
        <div className="row text-center">
          You are disconnect to server, Please try again.
        </div>
        <div className="row center-container">
          <Button color="brown" onClick={retry}>
            Retry
          </Button>
        </div>
      </div>
    </Container>
  );
};
export default RetryConnectPanel;
