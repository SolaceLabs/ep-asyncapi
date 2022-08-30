import { 
  // SemVer, 
  // coerce as SemVerCoerce, 
  valid as SemVerValid 
} from "semver";

export class EpAsyncApiUtils {

  public isSemVerFormat({ versionString }:{
    versionString: string;
  }): boolean {
    try {
      const s: string | null = SemVerValid(versionString);
      if(s === null) return false;
      return true;
    } catch(e) {
      return false;
    }
  }

}
export default new EpAsyncApiUtils();
