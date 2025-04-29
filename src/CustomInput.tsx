import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";
import { IWorkItemFormService, WorkItemTrackingServiceIds } from "azure-devops-extension-api/WorkItemTracking";
import { getService } from "azure-devops-extension-sdk";
import { TextField } from "@fluentui/react";

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
      setValue(fieldValue as string);
    });
  }, []);

  const handleChange = async (_: any, newValue?: string) => {
    setValue(newValue || "");

    if (fieldName) {
      const formService = await getService<IWorkItemFormService>(WorkItemTrackingServiceIds.WorkItemFormService);
      await formService.setFieldValue(fieldName, newValue || "");
    }
  };

  return (
    <div style={{ padding: "6px" }}>
      <TextField
        value={value}
        onChange={handleChange}
        disabled={true}
        styles={{ fieldGroup: { width: "100%" } }}
      />
    </div>
  );
};

export default CustomInput;
