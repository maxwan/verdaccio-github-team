interface IConfigs {
  organization: string;
  token: string;
  paginationCount: number;
}

const MAX_PAGINATION_COUNT = 100;

class Configs implements IConfigs {
  public _organization = '';
  public _token = '';
  public _paginationCount = MAX_PAGINATION_COUNT;

  set organization(organization: string) {
    if (!organization) {
      throw new Error('[Config] Missing "organization" in config.');
    }

    this._organization = organization;
  }

  get organization() {
    return this._organization;
  }

  set token(token: string) {
    if (!token) {
      throw new Error('[Config] Missing "TOKEN" environment variable.');
    }

    this._token = token;
  }

  get token() {
    return this._token;
  }

  set paginationCount(count: number) {
    this._paginationCount = Math.max(Math.min(count, MAX_PAGINATION_COUNT), MAX_PAGINATION_COUNT);
  }

  get paginationCount() {
    return this._paginationCount;
  }
}

export default new Configs();
