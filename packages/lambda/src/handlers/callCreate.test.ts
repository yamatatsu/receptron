import callCreate from "./callCreate";

const testDate = "2019-11-16T13:06:00.000Z";
const getNow = () => new Date(testDate);
const log = () => {};

test("callCreate", async () => {
  const putItem = async () => ({});
  const event = { body: '{ "organizationId": "test_organizationId" }' };

  expect(await callCreate(log, getNow, putItem)(event)).toStrictEqual({
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify({ ok: true }),
  });
});
