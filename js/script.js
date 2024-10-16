const CONFIG = {
  firstName: {
    required: "Имя обязательно к заполнению",
    strLength: "поле не должно превышать 12 символов",
    minValue: 2,
    maxValue: 12,
  },
  lastName: {
    required: "фамилия обязательна к заполнению",
    strLength: "поле не должно превышать 24 символа",
    maxValue: 24,
  },
  email: {
    required: "email обязателен к заполнению",
    domainIncludes: "email должен быть yandex.ru или google.com",
    value: ["yandex.ru", "google.com", "mail.ru"],
  },
  inputPassword: {
    required: "пароль обязателен к заполнению",
    symbolIncludes:
      "ваш пароль должен содержать от 8 до 20 символов, включать буквы и цифры и не содержать пробелов, специальных символов или эмодзи",
    value: /^(\d|\w)+?$/,
  },
  confirmPassword: {
    required: "подтвердите пароль",
    notEquals: "впароли не совпадают",
    value: (fields) => {
      return fields.inputPassword === fields.confirmPassword;
    },
  },
  birthDate: {
    required: "дата рождения обязательна к заполнению",
    restriction: "вам должно быть больше 18 лет",
    startDate: "1920-01-01",
    endDate: () => {
      const date = new Date();
      date.setFullYear(date.getFullYear() - 18);
      return date.toISOString().slice(0, 10);
    },
  },
  gender: {
    required: "укажите пол!",
  },
  agreementCheckbox: {
    required: "чтобы продолжить регистрацию, необходимо согласиться",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  const form = document.registration;
  const submitBtn = form.querySelector('[type="submit"]');

  function addError(key, str) {
    console.error(key, str);
    const field = form.querySelector(`[name="${key}"]`);

    const errEl = document.createElement("small");
    errEl.classList.add("js-error");
    errEl.classList.add("d-block");
    errEl.classList.add("text-danger");
    errEl.innerText = str;

    field?.parentElement?.append(errEl);
  }

  function clearErrors() {
    form.querySelectorAll(".js-error").forEach((el) => {
      el.remove();
    });
  }

  function validate(fields) {
    console.log("validate", fields);

    clearErrors();

    for (const key in fields) {
      const value = fields[key];

      const validator = CONFIG[key];
      if (validator) {
        if (validator.required && !value) {
          addError(key, validator.required);
        }
        if (
          validator.strLength &&
          (value.length > validator.maxValue ||
            value.length < validator.minValue)
        ) {
          addError(key, validator.strLength);
        }
        if (validator.domainIncludes) {
          let err = 0;
          for (let i = 0; i < validator.value.length; i++) {
            const domain = validator.value[i];
            if (value.indexOf(domain) === -1) {
              err++;
            }
          }
          if (err === validator.value.length) {
            addError(key, validator.domainIncludes);
          }
        }
        if (validator.symbolIncludes && !validator.value.test(value)) {
          addError(key, validator.symbolIncludes);
        }
        if (validator.notEquals && !validator.value(fields)) {
          addError(key, validator.notEquals);
        }
        if (
          validator.restriction &&
          new Date(validator.endDate()).getTime() < new Date(value).getTime()
        ) {
          addError(key, validator.restriction);
        }
      }
    }
  }

  submitBtn.addEventListener("click", (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    const fields = {
      gender: undefined,
      agreementCheckbox: undefined,
    };
    formData.forEach((value, key) => (fields[key] = value));

    validate(fields);

    document.getElementById('output').textContent = JSON.stringify(fields, null, 2);
  });



});

// document.getElementById('registrationForm').addEventListener('submit', function(event) {
//   event.preventDefault();

//   let password = document.getElementById('inputPassword').value;
//   let confirmPassword = document.getElementById('confirmPassword').value;

//   if (password !== confirmPassword) {
//       document.getElementById('errorMsg').textContent = 'Пароли не совпадают!';
//       return;
//   } else {
//       document.getElementById('errorMsg').textContent = '';
//   }

//   let obj = {
//       firstName: document.getElementById('firstName').value,
//       lastName: document.getElementById('lastName').value,
//       email: document.getElementById('email').value,
//       password: password,
//       gender: document.querySelector('input[name="gender"]:checked').value,
//       birthDate: document.getElementById('birthDate').value,
//       agreement: document.getElementById('agreementCheckbox').checked
//   };

//   document.getElementById('output').textContent = JSON.stringify(obj, null, 2);
// });
