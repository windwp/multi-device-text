import React from "react";
import { useSelector } from "react-redux";
import { NavLink, Route, Switch } from "react-router-dom";
import { Grid, Menu } from "semantic-ui-react";
import { RootState } from "./model/dataModel";
import Page404 from "./pages/404";
import About from "./pages/about";
import Home from "./pages/home";
import MultiLocalView from "./pages/multi-local-view/multi-local-view";
import RoomCreate from "./pages/room-create/room-create";
import RoomJoin from "./pages/room-join/room-join";

const Routes: React.FC = () => {
  const isShowHeader = useSelector<RootState, any>(
    state => state.app.theme.showHeader
  );
  return (
    <div>
      <Grid
        padded
        className={`tablet computer only ${isShowHeader ? "" : "hidden"}`}
      >
        <Menu borderless fluid size="huge">
          <NavLink exact to="/" className="item">
            MultiScreen Text
          </NavLink>
          <NavLink exact to="/about" activeClassName="active" className="item">
            About
          </NavLink>
        </Menu>
      </Grid>
      <Grid padded className={`mobile only ${isShowHeader ? "" : "hidden"}`}>
        <Menu borderless fluid size="huge">
          <NavLink exact to="/" className="item">
            MultiScreen Text
          </NavLink>
        </Menu>
      </Grid>
      <Switch>
        <Route path="/about">
          <About />
        </Route>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/create/:id">
          <RoomCreate />
        </Route>
        <Route path="/room/:id">
          <RoomJoin />
        </Route>
        <Route path="/local">
          <MultiLocalView />
        </Route>
        <Route path="*" component={Page404} />
      </Switch>
    </div>
  );
};

export default Routes;
