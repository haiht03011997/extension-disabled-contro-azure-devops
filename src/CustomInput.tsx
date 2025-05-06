import { InputNumber } from "antd";
import { IWorkItemFormService, WorkItemTrackingServiceIds } from "azure-devops-extension-api/WorkItemTracking";
import * as SDK from "azure-devops-extension-sdk";
import { getService } from "azure-devops-extension-sdk";
import * as React from "react";
import "./style.scss";

const CustomInput: React.FC = () => {
  const [value, setValue] = React.useState<string>("");
  const [fieldName, setFieldName] = React.useState<string>("");
  const [isDisabled, setDisabled] = React.useState<boolean>(false);
  const [min, setMin] = React.useState<number>(0);

  React.useEffect(() => {
    SDK.init();

    SDK.ready().then(async () => {
      const config = SDK.getConfiguration();
      const field = config.witInputs?.Field;
      const disabledRaw = config.witInputs?.IsDisabled;
      const disabled = disabledRaw === true || disabledRaw === "true"; // Chuyển đúng kiểu
      setDisabled(disabled);

      const minValueRaw = config.witInputs?.MinValue;
      const minValue = minValueRaw ? parseInt(minValueRaw) : 0; // Chuyển đổi sang số nguyên
      setMin(minValue);

      setFieldName(field);
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
    <InputNumber
      value={value}
      title={value}
      min={min}
      onChange={handleChange}
      placeholder="Nhập giá trị"
      disabled={isDisabled}
      className="w-100"
    />
  );
};

export default CustomInput;
