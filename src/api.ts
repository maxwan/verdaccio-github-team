import fetch from 'node-fetch';
import configs from './configs';

async function graphQLPost(query: string, token: string) {
  const response = await fetch(
    'https://api.github.com/graphql',
    {
      method: 'POST',
      body: query,
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  // failed to get response from github API
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`[Github]: ${response.status} - ${response.statusText}`);
  }

  const json = await response.json();

  // github API return errors
  if (json.errors) {
    throw new Error(`[Github]: ${json.erros}`);
  }

  return json.data;
}

interface INextPageParams {
  teamName?: string;
  endCursor?: string;
}

export async function getTeamListByUser(userName: string, { endCursor }: INextPageParams = {}) {
  const teamsQuery = [`userLogins: ["${userName}"]`];

  if (endCursor) {
    teamsQuery.push(`after: "${endCursor}"`);
  }

  const paginationQuery = `first: ${configs.paginationCount}`;
  const query = JSON.stringify({
    query: `{
      organization(login: ${configs.organization}) {
        teams(${[paginationQuery, ...teamsQuery].join(', ')}) {
          totalCount
          edges {
            node {
              name
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }`
  });

  return await graphQLPost(query, configs.token);
};

export async function getUserNameFromToken(token: string): Promise<string> {
  const query = JSON.stringify({
    query: `{
      viewer {
        login
      }
    }`
  });

  const viewerData = await graphQLPost(query, token);
  return viewerData.viewer.login;
};

interface IMemberNode {
  node: {
    name: string;
  };
}

interface IResponseData {
  organization: {
    teams: {
      totalCount: number;
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string;
      };
      edges: Array<IMemberNode>;
    }
  }
}

export async function parseData(data: IResponseData, userName: string): Promise<string[]> {
  const { organization: { teams: { edges, pageInfo, totalCount } }} = data;
  const { hasNextPage, endCursor } = pageInfo;
  let teamList: string[] = [];

  // no teams, user ID didn't exists
  if (!totalCount) {
    return teamList;
  }

  for (let i = 0; i < edges.length; i++) {
    const team = edges[i];
    teamList.push(team.node.name);
  }

  if (hasNextPage && endCursor) {
    const nextPageData = await getTeamListByUser(userName, { endCursor });
    teamList = [...teamList, ...await parseData(nextPageData, userName)];
  }

  return teamList;
};
