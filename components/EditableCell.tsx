import { ButtonGroup } from "@chakra-ui/button";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Editable,
  EditableInput,
  EditablePreview,
  useEditableControls,
} from "@chakra-ui/react";
type Props = {
  defaultValue: string;
  onSubmit: (name: string) => void;
};

const EditableCell = ({ defaultValue, onSubmit }: Props) => {
  const EditableControl = () => {
    const { isEditing, getSubmitButtonProps, getCancelButtonProps } =
      useEditableControls();

    return isEditing ? (
      <ButtonGroup size="sm">
        <IconButton
          icon={<CheckIcon />}
          aria-label="submit"
          {...getSubmitButtonProps()}
        />
        <IconButton
          icon={<CloseIcon />}
          aria-label="close"
          {...getCancelButtonProps()}
        />
      </ButtonGroup>
    ) : (
      <></>
    );
  };

  return (
    <Editable
      defaultValue={defaultValue}
      placeholder={defaultValue}
      onSubmit={onSubmit}
      d="flex"
      w="240px"
    >
      <EditablePreview />
      <EditableInput />
      <EditableControl />
    </Editable>
  );
};
export default EditableCell;
