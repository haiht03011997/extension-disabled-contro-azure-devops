import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";
import { IWorkItemFormService, WorkItemTrackingServiceIds } from "azure-devops-extension-api/WorkItemTracking";
import { getService } from "azure-devops-extension-sdk";
import "./style.scss";
import { Input } from "antd";

const ORG = process.env.REACT_APP_AZURE_ORG!;
const PAT = process.env.REACT_APP_AZURE_PAT!;
const PROJECT = process.env.REACT_APP_AZURE_PROJECT!;
const authHeader = "Basic " + PAT;

const CustomInput: React.FC = () => {
  const [value, setValue] = React.useState<string>("");

  React.useEffect(() => {
    SDK.init();

    SDK.ready().then(async () => {
      const config = SDK.getConfiguration();
      const field = config.witInputs?.Field;
      // ✅ Đăng ký onFieldChanged
      SDK.register(SDK.getContributionId(), {
        onFieldChanged: async (args: any) => {
          const changed = args.changedFields;
          const formService = await getService<IWorkItemFormService>(
            WorkItemTrackingServiceIds.WorkItemFormService
          );
           
          if(formService && changed["System.RelatedLinkCount"] >= 0) {
            const relatedLinkCount = await formService.getFieldValue("System.RelatedLinkCount") as number;
            
            if(relatedLinkCount <= 0) {
              await formService.setFieldValue(field, "");
              setValue("");
            }
            else {
              const parrentId:number = await formService.getFieldValue("System.Parent") as number;
              
              if(parrentId && parrentId > 0)
              {
                const parent = await handleGetInforParent(parrentId);
                let newValue: any;

                if (field === "Custom.83cc03ff-b4cd-4863-9fbf-254247a6d8cf") {
                  newValue = parent["System.AssignedTo"]["uniqueName"];
                }
                else if (field === "Custom.AreaPath") {
                  await formService.setFieldValue("System.AreaPath", parent["System.AreaPath"]);
                  newValue = parent[field];
                }
                else {
                  newValue = parent[field];
                }

                await formService.setFieldValue(field, newValue);
                setValue(newValue);
              }
              else {
                await formService.setFieldValue(field, "");
              }
            }
          }
        }
      });

      SDK.resize(undefined, 42);
    });
  }, []);

  const handleGetInforParent = async (id:number) => {
    const res = await fetch(
      `https://dev.azure.com/${ORG}/${encodeURI(PROJECT)}/_apis/wit/workitems/${id}?api-version=7.1`,
      {
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      }
    );
     if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Azure DevOps API error:", res.status, errorText);
      return;
    }
    const data = await res.json();
    return data?.fields;
  }

  return (
    <Input
      value={value}
      title={value}
      placeholder="Nhập giá trị"
      disabled={true}
    />
  );
};

export default CustomInput;
