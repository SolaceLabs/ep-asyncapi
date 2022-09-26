import { v4 as uuidv4 } from 'uuid';

export class TestUtils {

  public static getUUID = (): string => {
    return uuidv4();
  }

  public static assertNever = (extLogName: string, x: never): never => {
    const funcName = 'assertNever';
    const logName = `${TestUtils.name}.${funcName}()`;
    throw new Error(`${logName}:${extLogName}: unexpected object: ${JSON.stringify(x)}`);
  }

}