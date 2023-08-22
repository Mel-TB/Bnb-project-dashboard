import { useForm } from "react-hook-form";

import FormRow from "../../ui/form/FormRow";

import { Form } from "../../ui/form/Form.styles";
import { Input } from "../../ui/input/Input.styles";
import { Button } from "../../ui/button/Button.styles";

import { useUpdateUser } from "./hooks/useUpdateUser";

const UpdatePasswordForm = () => {
  const { register, handleSubmit, formState, getValues, reset } = useForm();
  const { errors } = formState;

  const { updateUser, isUpdating } = useUpdateUser();

  const onSubmit = ({ password }) => {
    updateUser({ password }, { onSuccess: reset });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow
        label='New password (min 8 chars)'
        error={errors?.password?.message}
      >
        <Input
          type='password'
          id='password'
          autoComplete='current-password'
          disabled={isUpdating}
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 8,
              message: "Password needs a minimum of 8 characters",
            },
          })}
        />
      </FormRow>

      <FormRow
        label='Confirm password'
        error={errors?.passwordConfirm?.message}
      >
        <Input
          type='password'
          autoComplete='new-password'
          id='passwordConfirm'
          disabled={isUpdating}
          {...register("passwordConfirm", {
            required: "This field is required",
            validate: (value) =>
              getValues().password === value || "Passwords need to match",
          })}
        />
      </FormRow>
      <FormRow>
        <Button
          onClick={reset}
          type='reset'
          variation='secondary'
        >
          Cancel
        </Button>
        <Button disabled={isUpdating}>Update password</Button>
      </FormRow>
    </Form>
  );
};

export default UpdatePasswordForm;
