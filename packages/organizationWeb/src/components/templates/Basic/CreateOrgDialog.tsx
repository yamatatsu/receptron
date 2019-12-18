import React, { FunctionComponent } from "react";
import {
  PrimaryButton,
  DefaultButton,
} from "office-ui-fabric-react/lib/Button";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import {
  Dialog,
  DialogType,
  DialogFooter,
} from "office-ui-fabric-react/lib/Dialog";
import { useFormik } from "formik";
import { Org } from "../../../domains/organization";

type Props = {
  addOrg: (e: Org) => void;
  open: boolean;
  toggle: () => void;
};
const CreateOrgDialog: FunctionComponent<Props> = ({
  addOrg,
  open,
  toggle,
}) => {
  const { submitForm, handleChange, values } = useFormik({
    onSubmit: args => {
      addOrg(args);
      toggle();
    },
    initialValues: { name: "" },
  });

  return (
    <Dialog
      hidden={!open}
      onDismiss={toggle}
      dialogContentProps={{
        type: DialogType.largeHeader,
        title: "Create New Organization",
        subText:
          "At first, you need to create new organization for starting Receptron!",
      }}
    >
      <form onSubmit={submitForm}>
        <TextField
          label="Name"
          type="text"
          name="name"
          onChange={handleChange}
          value={values.name}
        />
      </form>
      <DialogFooter>
        <PrimaryButton onClick={submitForm} text="Create" />
        <DefaultButton onClick={toggle} text="Cancel" />
      </DialogFooter>
    </Dialog>
  );
};

export default CreateOrgDialog;
