import { Callback, AuthConf } from '@verdaccio/types';
import { getTeamListByUser, getUserNameFromToken, parseData } from './api';
import configs from './configs';

export default class Github {
  constructor(config: AuthConf) {
    const { organization, token, paginationCount } = config;
    const { ORG_NAME, TOKEN } = process.env;
    configs.organization = ORG_NAME || organization;
    configs.token = TOKEN || token;

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
      .catch((error) => cb(error));
  }
}