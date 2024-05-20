export class CamVariableMap<T> extends Map<string, T> {
  constructor(public $scope: any) {
    super();
  }

  #setScope<T>(key: string, value: T): Promise<T> {
    const $scope = this.$scope;

    return new Promise((resolve) => {
      camForm.on("form-loaded", function () {
        camForm.variableManager.fetchVariable(key);

        camForm.on("variables-fetched", function () {
          const _value = camForm.variableManager.variableValue(key);

          if (_value === undefined) {
            $scope[key] = value;
            camForm.variableManager.variable(key).type = "json";
            camForm.variableManager.variable(key).valueInfo = {
              serializationDataFormat: "application/json",
            };
            camForm.variableManager.variable(key).value = $scope[key];
          } else {
            $scope[key] = _value;
          }

          resolve($scope[key]);
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
