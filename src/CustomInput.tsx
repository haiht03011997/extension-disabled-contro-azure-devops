import { Input } from "antd";
import { IWorkItemFormService, WorkItemTrackingServiceIds } from "azure-devops-extension-api/WorkItemTracking";
import * as SDK from "azure-devops-extension-sdk";
import { getService } from "azure-devops-extension-sdk";
import * as React from "react";
import "./style.scss";

const CustomInput: React.FC = () => {
  const [value, setValue] = React.useState<string>("");
  const [fieldName, setFieldName] = React.useState<string>("");
  const [label, setLabel] = React.useState<string>("");
  const [isDisabled, setDisabled] = React.useState<boolean>(false);
  const [isShow, setShow] = React.useState<boolean>(false);

  React.useEffect(() => {
    SDK.init();

    SDK.ready().then(async () => {
      const config = SDK.getConfiguration();
      
      // ✅ Đăng ký onFieldChanged
      SDK.register(SDK.getContributionId(), {
        onFieldChanged: async (args: any) => {
          const changed = args.changedFields;
          const formService = await getService<IWorkItemFormService>(
            WorkItemTrackingServiceIds.WorkItemFormService
          );
          if(formService)
          {
            if (changed["Custom.a2a2331d-644d-479d-b7fa-42698a4a8af0"]) {
              const currentValue = await formService.getFieldValue("Custom.a2a2331d-644d-479d-b7fa-42698a4a8af0") as string;
              if( currentValue.toLowerCase() !== "CBNV".toLowerCase()) 
                  setShow(true);
              else
                  setShow(false);
            }
          }
        },
        onLoaded: async () => {
          const formService = await getService<IWorkItemFormService>(
            WorkItemTrackingServiceIds.WorkItemFormService
          );
          const initialState : string = await formService.getFieldValue("System.State") as string;
          const normalized = String(initialState ?? "").toLowerCase();
          const disabledRaw = config.witInputs?.IsDisabled;
          const configDisabled = disabledRaw === true || disabledRaw === "true";

          const finalDisabled = normalized === "hoàn thành" ? true : configDisabled;
          setDisabled(finalDisabled);
        },
      });

      const field = config.witInputs?.Field;
      setFieldName(field);
      
      const label = config.witInputs?.Label;
      setLabel(label);
      const formService = await getService<IWorkItemFormService>(
        WorkItemTrackingServiceIds.WorkItemFormService
      );
      // Lấy giá trị ban đầu
      const rawValue = await formService.getFieldValue(field);
      const valueStr = rawValue as string;
      setValue(valueStr);

      SDK.resize(undefined, 55);
    });
  }, []);

  const handleChange = async (e?: any) => {
    const newValue = e?.target?.value ?? e;
    setValue(newValue ?? "");

    if (fieldName) {
      const formService = await getService<IWorkItemFormService>(WorkItemTrackingServiceIds.WorkItemFormService);
      await formService.setFieldValue(fieldName, newValue ?? "");
      if(newValue) {
        await formService.clearError();
      }
      else
        await formService.setError(`Trường ${label} là bắt buộc.`);
    }
  };

  return (
    isShow &&
    (
      <div className="custom-input-container">
        <label className={`${(value && value.length > 0) ? '' : 'text-error'}`}>{label}</label>
        <Input
          value={value}
          title={value}
          onChange={handleChange}
          placeholder="Nhập giá trị"
          disabled={isDisabled}
        />
      </div>
    )
  );
};

export default CustomInput;
