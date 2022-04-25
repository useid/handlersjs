# Handlersjs
## Configure Git

Start by installing Git and configuring your global Git name and email address. You can do so by executing the following commands. Please make sure to use exactly the same name and email address as in your Github profile.

```
$ git config --global user.name "John Doe"
$ git config --global user.email john@digita.ai
```

To be safe, backup all of your existing repositories, or simply create a new folder which will contain your Github repositories. Once done, clone the Github repositories by executing the following command.

```
$ git clone git@github.com:digita-ai/handlersjs.git
```

In order to pull and publish packages from GitHub, you need to [authenticate by using a personal access token](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry). Start by generating one which has at least the `write:packages` and `read:packages` scopes on [this page](https://github.com/settings/tokens). Note that you will not be able to recover or view the token after it has been created, so keep it somewhere safe.

```
$ npm login --registry#https://npm.pkg.github.com
Username: [your GitHub username]
Password: [your personal access token]
Email: [your GitHub e-mail address]
```