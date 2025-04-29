import * as SDK from "azure-devops-extension-sdk";
import CustomInput from "./CustomInput";
import { createRoot } from "react-dom/client";

SDK.init();

SDK.ready().then(() => {
  SDK.register(SDK.getContributionId(), () => {
    return {
      onLoaded: () => {
        const root = createRoot(document.getElementById("root")!);
        root.render(<CustomInput />);
      }
    };
  });

  SDK.notifyLoadSucceeded();
});
