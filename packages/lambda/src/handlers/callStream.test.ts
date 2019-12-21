import callStream from "./callStream";

const log = () => {};

test("callStream", async () => {
  const postMessage = async () => ({ ok: true });
  expect(await callStream(log, postMessage)()).toBe(undefined);
});
