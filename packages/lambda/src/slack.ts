import {
  WebClient,
  WebAPICallResult,
  ChatPostMessageArguments,
} from "@slack/web-api";

export type PostMessage = (
  args: ChatPostMessageArguments,
) => Promise<WebAPICallResult>;

export const messenger = (token: string | undefined): PostMessage => {
  const slack = new WebClient(token);
  return args => slack.chat.postMessage(args);
};

export function callingArguments() {
  return {
    channel: "CQ7URCBD5",
    text: "",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*ヤマモト タツヤ* is calling from entrance.",
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "OK",
              emoji: true,
            },
            // value?: string,
            // url?: string,
            style: "primary",
          },
        ],
      },
    ],
  };
}
