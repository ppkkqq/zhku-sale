import Schema from "async-validator";

export default function validate({ rules, data, callback }) {
  const schema = new Schema(rules);

  schema.validate(data, callback);
}
