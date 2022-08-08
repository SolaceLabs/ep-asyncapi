
export class Constants {
  private readonly _scriptDir: string;
  private readonly _workingDir: string;
  private readonly _epAsyncApiDir: string;
  private readonly _workingEpAsyncApiDir: string;
  private readonly _skipping: string;

  constructor(scriptDir: string) {
    this._scriptDir = scriptDir;
    this._skipping = '+++ SKIPPING +++';
    this._workingDir = `${scriptDir}/working_dir`;
    this._epAsyncApiDir = `${scriptDir}/../ep-asyncapi`;
    this._workingEpAsyncApiDir = `${this._workingDir}/ep-asyncapi`;
  }
  public log() {
    console.log(`${Constants.name} = ${JSON.stringify(this, null, 2)}`);
  }
  public get ScriptDir() { return this._scriptDir; }
  public get WorkingDir() { return this._workingDir; }
  public get EpAsyncApiDir() { return this._epAsyncApiDir; }
  public get WorkingEpAsyncApiDir() { return this._workingEpAsyncApiDir; }
  public get Skipping() { return this._skipping; }
}
