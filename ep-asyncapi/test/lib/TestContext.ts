
import { v4 as uuidv4 } from 'uuid';

export type TTestEnv = {
  projectRootDir: string;
}

export class TestContext {

    private static itId: string;
    private static testEnv: TTestEnv;

    public static newItId() {
        TestContext.itId = uuidv4().replace(/-/g, '_');
    }
    public static getItId(): string {
        return TestContext.itId;
    }
    public static setTestEnv = (testEnv: TTestEnv) => {
      TestContext.testEnv = testEnv;
    }
    public static getTestEnv = (): TTestEnv => {
      return TestContext.testEnv;
    } 
}
