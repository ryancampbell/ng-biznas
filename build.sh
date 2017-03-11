#!/usr/bin/env bash

set -e -o pipefail

cd `dirname $0`

PACKAGES=(
  ng-tslint-rules
  ng-component-outlet
  ng-container-outlet)

TSC=tsc
TSLINT=tslint
GULP=gulp
NODE=node
BUILD_ALL=true
VERSION_PREFIX=$(node -p "require('./package.json').version")
VERSION_SUFFIX="-$(git log --oneline -1 | awk '{print $1}')"
BUILD_EXAMPLES=true

for ARG in "$@"; do
  case "$ARG" in
    --packages=*)
      PACKAGES_STR=${ARG#--packages=}
      PACKAGES=( ${PACKAGES_STR//,/ } )
      BUILD_ALL=false
      ;;
    --publish=*)
      VERSION_SUFFIX=""
      PUBLISH_VERSION=${ARG#--publish=}
      if [[ ${VERSION_PREFIX} != ${PUBLISH_VERSION} ]]; then
        echo "PUBLISH VERSION ${PUBLISH_VERSION} must match package.json version ${VERSION_PREFIX}";
        exit 1
      fi
      ;;
    *)
      echo "Unknown option $ARG."
      exit 1
      ;;
  esac
done

./check-environment.sh --verbose

VERSION="${VERSION_PREFIX}${VERSION_SUFFIX}"
echo "====== BUILDING Biznas Open Source for Angular ${VERSION} ======"

if [[ ${BUILD_ALL} == true ]]; then
  rm -rf ./dist/all
  # mkdir -p ./dist/all

  # build e2e, benchmarks, etc

  rm -rf ./dist/packages-dist
fi

mkdir -p ./dist/packages-dist

for PACKAGE in ${PACKAGES[@]}
do
  PWD=`pwd`
  ROOTDIR=${PWD}/modules/@biznas
  SRCDIR=${PWD}/modules/@biznas/${PACKAGE}
  DESTDIR=${PWD}/dist/packages-dist/${PACKAGE}
  DEST_MODULE=${DESTDIR}/@biznas

  rm -rf ${DESTDIR}
  mkdir -p ${DESTDIR}

  if [[ ${PACKAGE} == 'ng-tslint-rules' ]]; then

    cp ${SRCDIR}/tslint-recommended.json ${DESTDIR}/
    cp ${SRCDIR}/tslint-type-checking.json ${DESTDIR}/

  else

    echo "====== [${PACKAGE}]: COMPILING: ${TSC} -p ${SRCDIR}/tsconfig-build.json"
    $TSC -p ${SRCDIR}/tsconfig-build.json

    echo "====== [${PACKAGE}]: LINTING: $TSLINT -c ./tslint.json --type-check --project ${SRCDIR}/tsconfig-build.json ${SRCDIR}/src/**/*.ts"
    $TSLINT -c ./tslint.json --type-check --project ${SRCDIR}/tsconfig-build.json ./no${SRCDIR}/src/**/*.ts

  fi

  cp ${SRCDIR}/package.json ${DESTDIR}/
  cp ${PWD}/LICENSE ${DESTDIR}/
  cp ${PWD}/modules/@biznas/README.md ${DESTDIR}/

  (
    echo "====== VERSION: Updating version references"
    cd ${DESTDIR}
    echo "====== EXECUTE: perl -p -i -e \"s/0\.0\.0\-PLACEHOLDER/${VERSION}/g\" $""(grep -ril 0\.0\.0\-PLACEHOLDER .)"
    perl -p -i -e "s/0\.0\.0\-PLACEHOLDER/${VERSION}/g" $(grep -ril 0\.0\.0\-PLACEHOLDER .) < /dev/null 2> /dev/null
  )
done
