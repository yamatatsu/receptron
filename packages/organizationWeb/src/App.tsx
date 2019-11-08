import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  RouteProps,
} from "react-router-dom";
import { currentAuthenticatedUser } from "./aws";
import Top from "./components/Top";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import ConsoleTop from "./components/ConsoleTop";

export function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/">
            <Top />
          </Route>
          <Route path="/signIn">
            <SignIn />
          </Route>
          <Route path="/signUp">
            <SignUp />
          </Route>
          <Route path="/console" render={args => <PrivatePath {...args} />} />
        </Switch>
      </div>
    </Router>
  );
}

function PrivatePath({ location }: RouteProps) {
  const { error, fetching } = useFetch(currentAuthenticatedUser);

  if (fetching) return <p>"Loading..."</p>;
  if (error === "not authenticated")
    return (
      <Redirect
        to={{
          pathname: "/signIn",
          state: { from: location },
        }}
      />
    );
  if (error) return <p>{error}</p>;
  return <ConsoleTop />;
}

function useFetch<Data extends {}>(fn: () => Promise<Data>) {
  const [data, setData] = React.useState<Data | null>(null);
  const [error, setError] = React.useState<Error | string | null>(null);
  React.useEffect(() => {
    fn()
      .then(setData)
      .catch(setError);
  }, [fn]);
  return { data, error, fetching: !data && !error };
}
