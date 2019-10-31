import React from "react";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";

export function App() {
  const handleClick = React.useCallback(() => {
    fetch(
      "https://qyr9lpdtd2.execute-api.ap-northeast-1.amazonaws.com/prod/calls",
      {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "no-cors", // no-cors, cors, *same-origin
        // headers: {
        //   "Content-Type": "application/json; charset=utf-8",
        //   // "Content-Type": "application/x-www-form-urlencoded",
        // },
        // body: JSON.stringify({}), // 本文のデータ型は "Content-Type" ヘッダーと一致する必要があります
      },
    );
  }, [1]);

  return <PrimaryButton onClick={handleClick}>Call</PrimaryButton>;
}
