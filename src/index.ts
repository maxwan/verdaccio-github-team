import Github from './github';
import { AuthConf } from '@verdaccio/types';

export default function (config: AuthConf) {
  return new Github(config);
};
