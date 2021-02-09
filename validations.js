class Validator {
  constructor(form) {
    this.inputs = form.querySelectorAll("input, select");
    this.form = form;   
  }

  clearErrors() {
    const errors = this.form.querySelectorAll('div.error');
    for (const error of errors) {
      error.remove();
    }

    for (const input of this.inputs) {
      input.classList.remove('error');
    }
  }

  validate() {
    this.clearErrors();
    let errors = false;
    
    for(const input of this.inputs) {
      if (input.required) {
        errors = this.validateRequired(input);
      }

      if (input.dataset.type === "number") {
        errors = this.validateNumber(number);
      }
    }

    return errors;
  }

  validateRequired(input) {
    if (input.value === "") {
      input.classList.add('error');
      const rect = input.getBoundingClientRect(); 
      input.insertAdjacentHTML("afterend",`
        <div style="position: absolute; top: ${rect.bottom + 5}px; left: ${rect.left + 5}px" class='error'>Cannot be Blank</div>
      `);
      return false;
    }
    return true;
  }

  validateNumber(input) {
    if (isNaN(input.value)) {
      input.classList.add('error');
      const rect = input.getBoundingClientRect(); 
      input.insertAdjacentHTML("afterend",`
        <div style="position: absolute; top: ${rect.bottom + 5}px; left: ${rect.left + 5}px" class='error'>Must be a number</div>
      `);
      return false;
    }
    return true;
  }
}


