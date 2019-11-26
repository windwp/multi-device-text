import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Container, Divider, Grid, Header, Icon, Input, Message, Segment } from "semantic-ui-react";
import { randomString } from "../common/utils";

const Home = () => {
  let history = useHistory();
  const [roomId, setRoomId] = useState("");
  const viewCreateRoom = () => {
    const newId = randomString(6);
    history.push(`/create/${newId}`);
  };
  const joinRoom = () => {
    history.push(`/room/${roomId}`);
  };
  return (
    <div>
      <Container className="m-t-10">
        <Message className="m-b-20">
          <Header size="huge" as="h1">
            MultiScreen Text
          </Header>
          <p className="lead">
            A tool for help you display a running text across browser and device
          </p>
        </Message>
        <Segment>
          <Grid columns={2} stackable textAlign="center">
            <Divider vertical>Or</Divider>
            <Grid.Row verticalAlign="middle">
              <Grid.Column>
                <div>
                  <Header icon>
                    <Icon name="world" /> Create New Room{" "}
                  </Header>
                </div>
                <Button primary onClick={viewCreateRoom}>
                  Create
                </Button>
              </Grid.Column>
              <Grid.Column>
                <Header icon>
                  <Icon name="search" onClick={joinRoom} /> Join Room{" "}
                </Header>
                <div>
                  <Input
                    placeholder="Search existings room..."
                    value={roomId}
                    onKeyPress={(event: any) => {
                      if (event.key === "Enter") {
                        joinRoom();
                      }
                    }}
                    onChange={event => setRoomId(event.target.value)}
                  />
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <Segment>
          <p className="lead">Tutorial</p>
          <div>
            <img
              src="/images/screencast.gif"
              alt="multiscreen demo"
              className="screencast"
            />
          </div>
        </Segment>
      </Container>
    </div>
  );
};
export default Home;
