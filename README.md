Verdaccio GitHub Team
=====================
This is an authentication plugin for [Verdaccio](https://verdaccio.org/) with a [Github](https://github.com/) account.
Allowing package access to be managed by using [Github Team](https://help.github.com/en/articles/about-teams), Github Team feature is only available to a Github organization.

Configuration
-------------
<h3>Authentication</h3>
Below snippet is an example to use this authentication plugin.
Add `github-team` under the `auth` config, there will be 2 configurations are below

- `organization` is the name of your [Github organization](https://help.github.com/en/articles/about-organizations).
- `paginationCount` is the number of results to include in a single API call, the value is optional and will be default to 100. Value ranges
from 1 to 100, any value outside the ranges will be default 100.

```yaml
auth:
  github-team:
    organization: moneytree
    paginationCount: 100
```

<h3>Package Access</h3>
Here is an example of configuring [scoped packages](https://docs.npmjs.com/about-scopes) access with a Github team name.
Any authenticated user can access any packages except scoped packages, however only Github user that is under the team name `web-developer` can access any scoped packages. Meanwhile only Github user under `web-lead` can publish and unpublish to scoped packages.

```yaml
packages:
  '@**/*': # scoped packages
    access: web-developer
    publish: web-lead
    unpublish: web-lead
    proxy: npmjs

  '**':
    access: $authenticated
    publish: $authenticated
    unpublish: $authenticated
    proxy: npmjs
```

Setting Github TOKEN for verdaccio server
------------------------------------------
Internally, Github TOKEN is required to make API call to Github server. You should start the Verdacccio server with a TOKEN environment variable.
E.g: using node to start the server
```bash
TOKEN=abcdefg1234 yarn start
```

Please generate the TOKEN from [GitHub Personal Access Tokens page](https://github.com/settings/tokens/new) with `read:org` checked under `admin:org`.


Installing packages
-------------------
To install a package, first you need to login with a Github credential, please generate the user TOKEN from [GitHub Personal Access Tokens page](https://github.com/settings/tokens/new) with `read:user` under `user`.

Go through the steps below to login (replace square bracket section with your value)
1. `npm login --registry=[your npm server registry path]`.
2. Please enter your github username when prompted, you should be able to search your Github profile via `https://github.com/[username]`.
3. Copy paste the created user TOKEN with `read:user` access as the password.
4. Enter your email address.
5. After you are logged in successfully, you can start installing via `npm install myPackage --registry=[your npm server registry path]`.

Publishing a packages
---------------------
Repeat steps 1 to 4 from Installing packages. Then publish with the standard NPM way.

E.g: Go to your package folder to publish (with the `package.json`), then run
```
npm publish myPackage --registry=[your npm server registry path]
```

License
-------
[MIT licensed](https://github.com/maxwan/verdaccio-github-team/blob/master/LICENSE).
