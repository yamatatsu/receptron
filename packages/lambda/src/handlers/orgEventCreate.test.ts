import orgEventCreate from "./orgEventCreate";

const log = () => {};

test("orgEventCreate", async () => {
  const event = {};
  const context = {};

  expect(await orgEventCreate(log)(event, context)).toStrictEqual({
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify({ ok: true }),
  });
});
