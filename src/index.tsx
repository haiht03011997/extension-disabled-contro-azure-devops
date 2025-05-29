import * as SDK from "azure-devops-extension-sdk";
import CustomInput from "./CustomInput";
import { createRoot } from "react-dom/client";

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(<CustomInput />);