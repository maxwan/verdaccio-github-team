import { Callback, PluginOptions, Logger } from '@verdaccio/types';
import { getTeamListByUser, getUserNameFromToken, parseData } from './api';
import configs from './configs';
import { GithubTeamConfig } from './types';

export default class Github {
  private logger: Logger;

  constructor(config: GithubTeamConfig, options: PluginOptions<GithubTeamConfig>) {
    const { organization = '', paginationCount } = config;
    const { TOKEN = '' } = process.env;
    configs.organization = organization;
    configs.token = TOKEN;

    this.logger = options.logger;

    if (paginationCount) {
      configs.paginationCount = paginationCount;
    }
  }

  authenticate(user: string, password: string, cb: Callback) {
    getUserNameFromToken(password)
      .then((userName: string) => {
        // login ID and token user name do not match
        if (user !== userName) {
          throw new Error('invalidToken');
        }

        return userName;
      })
      .then((userName) => getTeamListByUser(userName))
      .then((data) => parseData(data, user))
      .then((teamList) => cb(null, teamList))
      .catch((error) => {
        this.logger.error(error);
        cb(error);
      });
  }
}