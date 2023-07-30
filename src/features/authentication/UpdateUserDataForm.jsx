import { useState } from "react";

import { Button } from "../../ui/button/Button.styles";
import { FileInput } from "../../ui/input/FileInput.styles";
import { Form } from "../../ui/form/Form.styles";
import { FormRow } from "../../ui/FormRow";
import { Input } from "../../ui/input/Input.styles";

import { useUser } from "./useUser";

const UpdateUserDataForm = () => {
  // We don't need the loading state, and can immediately use the user data, because we know that it has already been loaded at this point
  const {
    user: {
      email,
      user_metadata: { fullName: currentFullName },
    },
  } = useUser();

  const [fullName, setFullName] = useState(currentFullName);
  const [avatar, setAvatar] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow label='Email address'>
        <Input
          value={email}
          disabled
        />
      </FormRow>
      <FormRow label='Full name'>
        <Input
          type='text'
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          id='fullName'
        />
      </FormRow>
      <FormRow label='Avatar image'>
        <FileInput
          id='avatar'
          accept='image/*'
          onChange={(e) => setAvatar(e.target.files[0])}
        />
      </FormRow>
      <FormRow>
        <Button
          type='reset'
          variation='secondary'
        >
          Cancel
        </Button>
        <Button>Update account</Button>
      </FormRow>
    </Form>
  );
};

export default UpdateUserDataForm;
