export class CamVariableMap<T> extends Map<string, T> {
  constructor(public $scope: any, public camForm: any) {
    super();
  }

  #setScope<T>(key: string, value: T): Promise<T> {
    return new Promise((resolve) => {
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

          resolve(this.$scope[key]);
        });
      });
    });
  }

  set(key: string, value: T): this;
  set(key: string, value: Promise<T>): this;
  set(key: string, value: T | Promise<T>) {
    (async () => {
      this.#setScope(key, await value);
      super.set(key, this.$scope[key] as T);
    })();

    return this;
  }
}
