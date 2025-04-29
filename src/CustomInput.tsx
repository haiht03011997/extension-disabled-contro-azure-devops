import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";
import { IWorkItemFormService, WorkItemTrackingServiceIds } from "azure-devops-extension-api/WorkItemTracking";
import { getService } from "azure-devops-extension-sdk";
import { TextField } from "@fluentui/react";
import "./style.scss";

const CustomInput: React.FC = () => {
  const [value, setValue] = React.useState<string>("");
  const [fieldName, setFieldName] = React.useState<string>("");

  React.useEffect(() => {
    SDK.init();

    SDK.ready().then(async () => {
      const config = SDK.getConfiguration();
      const field = config.witInputs?.Field;
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

  const handleChange = async (_: any, newValue?: string) => {
    setValue(newValue ?? "");

    if (fieldName) {
      const formService = await getService<IWorkItemFormService>(WorkItemTrackingServiceIds.WorkItemFormService);
      await formService.setFieldValue(fieldName, newValue ?? "");
    }
  };

  return (
    <div>
      <TextField
        value={value}
        title={value}
        onChange={handleChange}
        disabled={true}
        className="w-100"
      />
    </div>
  );
};

export default CustomInput;
