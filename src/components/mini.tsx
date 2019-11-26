import React from "react";
import { Button, Container, Header } from "semantic-ui-react";
import Shimmer from "./shimmer";

export const Loading = () => {
  return (
    <Container className="center-container box-wrapper m-t-15 p-t-10">
      <Header textAlign="center">Loading</Header>
      <Shimmer className="p-h-15 p-b-15"></Shimmer>
    </Container>
  );
};

export const Error: React.FC<{ message: string }> = ({ message }) => {
  return (
    <Container className="center-container box-wrapper m-t-15 p-t-10">
      <Header textAlign="center">Error</Header>
      <div className="text-center error-text">{message}</div>
    </Container>
  );
};

const TestPanel = () => {
  return process.env.REACT_APP_IS_DEBUG ? (
    <Container className="setting-form box-wrapper p-h-10 p-v-10 m-t-10">
      <div>
        <div>Test Panel</div>
        <div className="row">
          <Button color="brown">Add Device</Button>
        </div>
      </div>
    </Container>
  ) : null;
};
