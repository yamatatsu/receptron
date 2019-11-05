import React from "react";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";

export function App() {
  const handleClick = React.useCallback(() => {
    fetch(
      "https://yiz5siv7e4.execute-api.ap-northeast-1.amazonaws.com/prod/calls",
      {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "no-cors", // no-cors, cors, *same-origin
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          organizationId: "CAC8E5C0-BE9E-4CA3-832C-1CB39F0D34E3",
        }),
      },
    );
  }, [1]);

  return <PrimaryButton onClick={handleClick}>Call</PrimaryButton>;
}
