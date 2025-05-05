import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";
import { IWorkItemFormService, WorkItemTrackingServiceIds } from "azure-devops-extension-api/WorkItemTracking";
import { getService } from "azure-devops-extension-sdk";
import "./style.scss";
import { Input } from "antd";

const CustomInput: React.FC = () => {
  const [value, setValue] = React.useState<string>("");
  const [fieldName, setFieldName] = React.useState<string>("");
  const [isDisabled, setDisabled] = React.useState<boolean>(false);
  const [typeInput, setTypeInput] = React.useState<string>("text");

  React.useEffect(() => {
    SDK.init();

    SDK.ready().then(async () => {
      const config = SDK.getConfiguration();
      const field = config.witInputs?.Field;
      const disabledRaw = config.witInputs?.IsDisabled;
      const disabled = disabledRaw === true || disabledRaw === "true"; // Chuyển đúng kiểu
      setDisabled(disabled);
      const type = config.witInputs?.TypeInput;
      setDisabled(disabled)
      setFieldName(field);
      setTypeInput(type);
      const formService = await getService<IWorkItemFormService>(WorkItemTrackingServiceIds.WorkItemFormService);
      const fieldValue = await formService.getFieldValue(field);
      const valueStr = fieldValue as string;
      setValue(valueStr);

      let height = 32; // Chiều cao mặc định
      // Tính chiều cao động theo số dòng
      if(valueStr && valueStr.length > 0)
      {
        const lineHeight = 24;
        const padding = 12;
        const lineCount = (valueStr.match(/\n/g)?.length ?? 0) + 1;
        height = lineCount * lineHeight + padding;
      }

      SDK.resize(undefined, height);
      });
  }, []);

  const handleChange = async (e?: any) => {
    const newValue = e?.target?.value ?? e;
    setValue(newValue ?? "");

    if (fieldName) {
      const formService = await getService<IWorkItemFormService>(WorkItemTrackingServiceIds.WorkItemFormService);
      await formService.setFieldValue(fieldName, newValue ?? "");
    }
  };

  return (
    <Input
      value={value}
      title={value}
      onChange={handleChange}
      placeholder="Nhập giá trị"
      disabled={isDisabled}
      type={typeInput}
      className="w-100"
    />
  );
};

export default CustomInput;
