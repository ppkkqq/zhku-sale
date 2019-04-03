export const passwordRule = {
  type: "string",
  required: true,
  pattern: /^[0-9a-zA-Z_]{8,16}$/,
  message: "密码长度必须在8到16位,仅包含数字，字母，下划线"
};
export const mobileRule = {
  type: "string",
  pattern: /^1[3456789]\d{9}$/,
  required: true,
  message: "手机号码不正确"
};
export const dealPasswordRule = {
  type: "string",
  required: true,
  message: "交易密码必须为6位数字",
  pattern: /^[0-9]{6}$/
};
export const verificationCodeRule = {
  type: "string",
  required: true,
  message: "验证码必须为6位",
  min: 6,
  max: 6
};
export const verificationCodeRuleEqual = (code = "") => {
  return [
    verificationCodeRule,
    {
      validator(rule, value, callback, source, options) {
        var errors = [];
        if (value !== code) {
          errors.push("验证码不正确");
        }
        callback(errors);
      }
    }
  ];
};
export const rePasswordRule = [
  passwordRule,
  {
    validator(rule, value, callback, source, options) {
      var errors = [];
      if (source.password !== source.rePassword) {
        errors.push("两次输入的密码不一致");
      }
      callback(errors);
    }
  }
];
export const reDealPasswordRule = (dealPassword = "") => {
  return [
    dealPasswordRule,
    {
      validator(rule, value, callback, source, options) {
        var errors = [];
        if (value !== dealPassword) {
          errors.push("两次输入的密码不一致");
        }
        callback(errors);
      }
    }
  ];
};
