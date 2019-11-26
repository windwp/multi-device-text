import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Container, Grid, Header, Input } from "semantic-ui-react";
import ColorPicker from "../../components/ColorPicker";
import PhoneCanvasDevice, { PhoneCanvasHandler } from "../../components/PhoneCanvasDevice";
import { AnimationConfig, DeviceInformation, RoomState } from "../../model/dataModel";
const data: RoomState = {
  roomId: "0",
  numberDevice: 3,
  config: {
    bgColor: "#db2828",
    textGradientColor: ["#00ffee", "#00ff99"],
    message: "(づ｡◕‿‿◕｡)づ Hello World ✌.ʕʘ‿ʘʔ.✌         "
  },
  isStart: false,
  isPause: false,
  listDevice: []
};
const MultiLocalView: React.FC = () => {
  const [state, setState] = useState(data);
  const refList = useRef(
    Array(10)
      .fill(null)
      .map(o => React.createRef<PhoneCanvasHandler>())
  );
  function renderDevice() {
    return (
      <div className="container-phone">
        {state.listDevice &&
          state.listDevice.map((item, index) => (
            <PhoneCanvasDevice
              key={index}
              config={item}
              ref={refList.current[index]}
              style={{ width: `${Math.round(100 / state.numberDevice)}%` }}
            />
          ))}
      </div>
    );
  }

  function changeNumberDevice(num: string) {
    setState({ ...state, numberDevice: parseInt(num) || 0 });
  }

  const createDevice = useCallback(() => {
    let num = state.numberDevice || 0;
    if (num > 10) {
      num = 10;
      setState(s => ({ ...s, numberDevice: num }));
      return;
    }
    let newDeviceInfo = Array(num)
      .fill(null)
      .map(
        (_item, index): DeviceInformation => {
          return {
            id: `${index}_` + Math.round(Math.random() * 1000),
            name: `Phone + ${index + 1}`,
            position: index + 1,
            totalDevice: num
          };
        }
      );
    newDeviceInfo.sort(() => Math.random() - 0.5);
    setState(s => {
      console.log(": createDevice -> s", s);
      s.listDevice.forEach((_item, index) => {
        if (refList.current[index] && refList.current[index].current) {
          refList.current[index].current.stopAnimation();
        }
      });
      return {
        ...s,
        ...{ listDevice: newDeviceInfo }
      };
    });
  }, [state.numberDevice]);

  useEffect(() => {
    createDevice();
    return () => {};
  }, [createDevice]);

  function startAnimation() {
    let listInformation: Array<any> = [];
    state.listDevice.forEach((_item, index) => {
      if (refList.current[index] && refList.current[index].current) {
        listInformation.push(
          refList.current[index].current.getDeviceInformation()
        );
      }
    });
    state.listDevice.forEach((_item, index) => {
      if (refList.current[index] && refList.current[index].current) {
        const config: AnimationConfig = {
          bgColor: state.config.bgColor,
          textGradientColor: state.config.textGradientColor,
          message: state.config.message,
          numberDevice: state.numberDevice,
          listDevice: listInformation
        };
        refList.current[index].current.startAnimation(config);
      }
    });
  }
  function pauseAnimaion() {
    state.listDevice.forEach((_item, index) => {
      if (refList.current[index] && refList.current[index].current) {
        refList.current[index].current.pauseAnimation();
      }
    });
  }
  return (
    <div>
      <Container className="setting-form box-wrapper p-h-10 p-v-10 m-t-10">
        <Header textAlign="center"> Room Create</Header>
        <div className="row">
          <Input
            placeholder="Device Number"
            value={state.numberDevice}
            label="Number :"
            size="big"
            fluid={true}
            onChange={e => changeNumberDevice(e.target.value)}
          ></Input>
        </div>
        <div className="row center-container">
          <Button color="red" onClick={e => createDevice()}>
            Create Device
          </Button>
        </div>
        <div className="row">
          <Input
            value={state.config.message}
            label="Text :"
            size="big"
            fluid={true}
            onChange={e =>
              setState({
                ...state,
                ...{ config: { ...state.config, message: e.target.value } }
              })
            }
          ></Input>
        </div>
        <Grid columns="3" className="row">
          <Grid.Column>
            <div className="flex">
              <label>Background Color :</label>
              <ColorPicker
                color={state.config.bgColor}
                handleChange={color => {
                  setState({
                    ...state,
                    ...{ config: { ...state.config, bgColor: color } }
                  });
                }}
              ></ColorPicker>
            </div>
          </Grid.Column>
          <Grid.Column>
            <div className="flex">
              <label>Text Color 1:</label>
              <ColorPicker
                color={state.config.textGradientColor[0]}
                handleChange={color => {
                  setState({
                    ...state,
                    ...{
                      config: {
                        ...state.config,
                        textGradientColor: [
                          color,
                          state.config.textGradientColor[1]
                        ]
                      }
                    }
                  });
                }}
              ></ColorPicker>
            </div>
          </Grid.Column>
          <Grid.Column>
            <div className="flex">
              <label>Text Color 2:</label>
              <ColorPicker
                color={state.config.textGradientColor[1]}
                handleChange={color => {
                  setState({
                    ...state,
                    ...{
                      config: {
                        ...state.config,
                        textGradientColor: [
                          state.config.textGradientColor[0],
                          color
                        ]
                      }
                    }
                  });
                }}
              ></ColorPicker>
            </div>
          </Grid.Column>
        </Grid>
        <div className="row center-container">
          <Button color="red" onClick={() => startAnimation()}>
            Start
          </Button>
          <Button color="red" onClick={() => pauseAnimaion()}>
            Pause
          </Button>
        </div>
      </Container>
      <Container
        style={{ marginTop: "40px", textAlign: "center", height: 300 }}
      >
        {renderDevice()}
      </Container>
    </div>
  );
};

export default MultiLocalView;
