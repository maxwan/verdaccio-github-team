import { PluginOptions } from '@verdaccio/types';
import Github from './github';
import { GithubTeamConfig } from './types';

export default function (config: GithubTeamConfig, options: PluginOptions<GithubTeamConfig>) {
  return new Github(config, options);
};
