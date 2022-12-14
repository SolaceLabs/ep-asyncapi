import s from 'shelljs';
import path from 'path';
import { Constants } from './lib/Constants';

const scriptName: string = path.basename(__filename);
const scriptDir: string = path.dirname(__filename);

const CONSTANTS = new Constants(scriptDir);

const prepare = () => {
  const funcName = 'prepare';
  const logName = `${scriptDir}/${scriptName}.${funcName}()`;
  console.log(`${logName}: starting ...`);
  if(s.rm('-rf', CONSTANTS.WorkingDir).code !== 0) process.exit(1);
  if(s.mkdir('-p', CONSTANTS.WorkingDir).code !== 0) process.exit(1);
  // if(s.mkdir('-p', `${CONSTANTS.WorkingDir}/resources`).code !== 0) process.exit(1);
  console.log(`${logName}: success.`);
}

const copySourcesToWorkingDir = () => {
  const funcName = 'copySourcesToWorkingDir';
  const logName = `${scriptDir}/${scriptName}.${funcName}()`;
  console.log(`${logName}: starting ...`);

  console.log(`${logName}: copying ep-asyncapi sources to working dir ...`);
  if(s.cp('-rf', CONSTANTS.EpAsyncApiDir, CONSTANTS.WorkingDir).code !== 0) process.exit(1);
  if(s.rm('-rf', `${CONSTANTS.WorkingEpAsyncApiDir}/dist`).code !== 0) process.exit(1);
  if(s.rm('-rf', `${CONSTANTS.WorkingEpAsyncApiDir}/node_modules`).code !== 0) process.exit(1);
  
  console.log(`${logName}: success.`);
}

const devBuild = () => {
  const funcName = 'devBuild';
  const logName = `${scriptDir}/${scriptName}.${funcName}()`;
  console.log(`${logName}: starting ...`);
  s.cd(`${CONSTANTS.WorkingEpAsyncApiDir}`);
  console.log(`${logName}: directory = ${s.exec(`pwd`)}`);
  if(s.exec('npm install').code !== 0) process.exit(1);
  // if(s.exec('npm run dev:build').code !== 0) process.exit(1);
  if(s.cd(`${scriptDir}`).code !== 0) process.exit(1);
  console.log(`${logName}: success.`);
}

const build = () => {
  const funcName = 'build';
  const logName = `${scriptDir}/${scriptName}.${funcName}()`;

  s.cd(`${CONSTANTS.WorkingEpAsyncApiDir}`);
  console.log(`${logName}: directory = ${s.exec(`pwd`)}`);
  if(s.rm('-rf', `./dist`).code !== 0) process.exit(1);
  if(s.exec('npm run build').code !== 0) process.exit(1);

  console.log(`${logName}: success.`);
}

const main = () => {
  const funcName = 'main';
  const logName = `${scriptDir}/${scriptName}.${funcName}()`;
  console.log(`${logName}: starting ...`);
  CONSTANTS.log();
  
  prepare();
  copySourcesToWorkingDir();
  devBuild();
  build();

  console.log(`${logName}: success.`);
}

main();
