/// <reference path="../../types.d.ts"/>
import { useCookie } from "@use-hook/use-cookie";
import React, { Fragment, useCallback, useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import { Button, Container, Grid, Input } from "semantic-ui-react";
import { reorder } from "../../common/utils";
import ColorPicker from "../../components/ColorPicker";
import { Error, Loading } from "../../components/mini";
import RetryConnectPanel from "../../components/retry-connect";
import { createUpdateConfigPacket, RoomState, RootState } from "../../model/dataModel";
import * as networktype from "../../model/networktype";
import BoxShare from "./box-share";
import "./room-create.css";
import * as roomAction from "./state/room-create.action";

const RoomCreate: React.FC = () => {
  const [deviceId, setDeviceId] = useCookie("deviceId", "");
  let { id: roomId } = useParams();
  const state = useSelector<RootState, any>(state => state.room) as RoomState;
  const dispatch = useDispatch();
  const setConfigState = useCallback(
    state => dispatch(roomAction.updateConfigState(state)),
    [dispatch]
  );

  const start = () => {
    var packet = createUpdateConfigPacket(
      state,
      networktype.NETWORK_START
    );
    dispatch(
      roomAction.sendStartRequestRoom(state.roomId, state.deviceId, packet)
    );
  };
  const pause = useCallback(
    () =>
      dispatch(
        roomAction.sendPauseRequestRoom(state.roomId, state.deviceId, null)
      ),
    [state.roomId, state.deviceId]
  );

  useEffect(() => {
    dispatch(roomAction.updateState({ roomId, isLoading: true }));
    dispatch(roomAction.createRequestRoom(roomId, deviceId));
  }, [roomId]);
  useEffect(() => {
    if (
      state.deviceId &&
      state.deviceId.length > 5 &&
      deviceId !== state.deviceId
    ) {
      setDeviceId(state.deviceId);
      return;
    }
    if (deviceId.length > 0 && state) {
      dispatch(roomAction.updateState({ deviceId: deviceId }));
    }
  }, [state.deviceId]);

  const onDragEnd = (result: any) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    const items = reorder(
      state.listDevice,
      result.source.index,
      result.destination.index
    );
    let position = 1;
    items.forEach(o => {
      o.position = position++;
    });
    dispatch(roomAction.updateState({ listDevice: items }));
  };

  const changeMessage = useCallback(e => {
    setConfigState({ message: e.target.value });
  }, []);
  const changeTextGradientColor = useCallback(
    (color: string, index: number) => {
      const newColor =
        index === 0
          ? [color, state.config.textGradientColor[1]]
          : [state.config.textGradientColor[0], color];
      setConfigState({
        textGradientColor: newColor
      });
    },
    [state.config.textGradientColor[0], state.config.textGradientColor[1]]
  );
  return (
    <div>
      {state.isLoading && <Loading />}
      {!state.isLoading && (
        <Fragment>
          {state.isDisconnect && <RetryConnectPanel />}
          {state.isError && <Error message={state.errorMessage} />}
          {!state.isError && !state.isDisconnect && (
            <Fragment>
              <Grid className="m-h-5">
                <Grid.Column computer={12} mobile={16} className="p-h-5 ">
                  <Container className="setting-form box-wrapper p-h-10 p-v-10 m-t-10 h-100">
                    <div className="row text-center">
                      <h3>Setting </h3>
                    </div>
                    <div className="row m-t-10">
                      <Input
                        value={state.config.message}
                        label="Text :"
                        size="big"
                        fluid={true}
                        onChange={changeMessage}
                      ></Input>
                    </div>
                    <Grid columns="3" className="row">
                      <Grid.Column mobile={16} tablet={5} computer={5}>
                        <div className="flex">
                          <label>Background Color :</label>
                          <ColorPicker
                            color={state.config.bgColor}
                            handleChange={color => {
                              setConfigState({ bgColor: color });
                            }}
                          ></ColorPicker>
                        </div>
                      </Grid.Column>
                      <Grid.Column mobile={16} tablet={5} computer={5}>
                        <div className="flex">
                          <label>Text Color 1:</label>
                          <ColorPicker
                            color={state.config.textGradientColor[0]}
                            handleChange={color =>
                              changeTextGradientColor(color, 0)
                            }
                          ></ColorPicker>
                        </div>
                      </Grid.Column>
                      <Grid.Column mobile={12} tablet={5} computer={5}>
                        <div className="flex">
                          <label>Text Color 2:</label>
                          <ColorPicker
                            color={state.config.textGradientColor[1]}
                            handleChange={color =>
                              changeTextGradientColor(color, 1)
                            }
                          ></ColorPicker>
                        </div>
                      </Grid.Column>
                    </Grid>
                    <div className="row center-container">
                      <Button color="red" onClick={start}>
                        Start
                      </Button>
                      <Button color="red" onClick={pause}>
                        Pause
                      </Button>
                    </div>
                  </Container>
                </Grid.Column>
                <Grid.Column computer={4} mobile={16} className="p-h-5 ">
                  <Container className="setting-form box-wrapper p-h-10 p-v-10 m-t-10 h-100">
                    <BoxShare></BoxShare>
                  </Container>
                </Grid.Column>
              </Grid>

              {/* List Device */}

              {state.listDevice.length > 0 && (
                <Container className="setting-form box-wrapper p-h-10 p-v-10 m-t-15">
                  <div>
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId="droppable" direction="horizontal">
                        {provided => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="device-wrapper"
                          >
                            {state.listDevice.map((item, index) => (
                              <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                              >
                                {provided => (
                                  <div
                                    className="device-item center-container"
                                    ref={provided.innerRef}
                                    {...provided.dragHandleProps}
                                    {...provided.draggableProps}
                                  >
                                    <div className="device-title">
                                      {item.name}
                                    </div>
                                    {provided.placeholder}
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </div>
                </Container>
              )}
            </Fragment>
          )}
        </Fragment>
      )}
    </div>
  );
};

export default RoomCreate;
