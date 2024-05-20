export class CamVariable {
  camForm;
  $scope;

  constructor(camForm, $scope = {}) {
    this.camForm = camForm;
    this.$scope = $scope;
  }

  #setScope(key, value) {
    this.camForm.on("form-loaded", () => {
      this.camForm.variableManager.fetchVariable(key);

      this.camForm.on("variables-fetched", () => {
        const _value = this.camForm.variableManager.variableValue(key);

        if (_value === undefined) {
          this.$scope[key] = value;
          this.camForm.variableManager.variable(key).type = "json";
          this.camForm.variableManager.variable(key).valueInfo = {
            serializationDataFormat: "application/json",
          };
          this.camForm.variableManager.variable(key).value = this.$scope[key];
        } else {
          this.$scope[key] = _value;
        }
      });
    });
  }

  async set(key, value) {
    this.#setScope(key, value instanceof Promise ? await value : value);
  }
}
