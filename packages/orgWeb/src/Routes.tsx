import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  RouteProps,
  useHistory,
} from "react-router-dom";
import { currentAuthenticatedUser } from "./aws";
import Top from "./components/Top";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import ConsoleTop from "./components/ConsoleTop";

export const path = {
  top: "/",
  signIn: "/signIn",
  signUp: "/signUp",
  consoleTop: "/console",
} as const;
export function usePushHistory(_path: typeof path[keyof typeof path]) {
  const history = useHistory();
  return () => history.push(_path);
}

export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact path={path.top}>
          <Top />
        </Route>
        <Route path={path.signIn}>
          <SignIn />
        </Route>
        <Route path={path.signUp}>
          <SignUp />
        </Route>
        <Route
          path={path.consoleTop}
          render={args => <PrivatePath {...args} />}
        />
      </Switch>
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
          pathname: path.signIn,
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
