import healthCheck from "./healthCheck";

const testDate = "2019-11-16T13:06:00.000Z";
const getNow = () => new Date(testDate);

test("healthCheck", async () => {
  expect(await healthCheck(getNow)()).toStrictEqual({
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify({ timestamp: testDate }),
  });
});
