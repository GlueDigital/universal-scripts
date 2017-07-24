[![Build Status](https://travis-ci.org/GlueDigital/universal-scripts.svg?branch=master)](https://travis-ci.org/GlueDigital/universal-scripts)

# Universal Scripts
Alternative scripts and configuration for [Create React App](https://github.com/facebookincubator/create-react-app), with enhaced functionality.

## Status
Please note that this project is still under heavy development, and not ready for outside usage.<br>
We plan to have a beta ready for testing in a few days. Please check back soon!

## About
When building a real web app, you need a lot of features not found on most "learning" starter kits, such as the one provided by React. This package provides an opinionated alternative with what we believe is the minimum that any modern app needs.

In addition to the features present on React Scripts, it features:
 - Server side rendering, using Koa
 - Internationalization support, with react-intl
 - State management, via Redux

## Usage
You can use the original Create React App with this package:
> create-react-app --scripts-version universal-scripts <app-name>
