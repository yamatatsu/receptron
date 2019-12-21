import { PostMessage, callingArguments } from "../slack";

type Log = (args: any) => void;

export default (log: Log, postMessage: PostMessage) => async () => {
  const result = await postMessage(callingArguments());
  log({ result });
};
