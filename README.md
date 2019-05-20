# DomiFa

[![Build Status](https://travis-ci.com/SocialGouv/domifa.svg?branch=master)](https://travis-ci.com/SocialGouv/domifa)
[![codecov](https://codecov.io/gh/SocialGouv/domifa/branch/master/graph/badge.svg)](https://codecov.io/gh/SocialGouv/domifa)

> Faciliter l'accès aux droits pour les personnes sans domicile stable, en simplifiant la gestion de la domiciliation

## Release policy

### Auto

Trigger a custom build on [Travis](https://travis-ci.com/SocialGouv/domifa) (in the "More options" right menu) on the `master` branch with a custom config:

```yml
env:
  global:
    - RELEASE=true
```

You can change the lerna arguments though the `LERNA_ARGS` variable.

```yml
env:
  global:
    - LERNA_ARGS="--force-publish --yes"
    - RELEASE=true
```

### Manual

You need an [Github token](https://github.com/settings/tokens/new) to release.

```sh
#
# Bump, push to git and publish to npm
$ GH_TOKEN==************ yarn lerna version

#
# You might want to add a Gif to your release to make it groovy ;)
```
