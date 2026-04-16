import { FormInstance, RuleObject } from 'antd/lib/form';

type ValidatorFunction = (
  fieldName: string,
  form: FormInstance,
  msg: string
) => (rule: RuleObject, value: string) => Promise<void>;

const validateField: ValidatorFunction = (fieldName, form, msg) => async (_, value) => {
  if (!value || !value.trim()) {
    // Reset the field value to an empty string
    form.setFieldValue(fieldName, '');
    return Promise.reject(new Error(`Please enter a valid ${msg}`));
  }
  return Promise.resolve();
};

export default validateField;
