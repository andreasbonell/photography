# Photography Portfolio

## Requirements & dependencies

* [Node.js](https://www.nodejs.org)
* [Gulp](https://github.com/gulpjs/gulp)

All other dependencies are handled by the node package manager.

## Getting started

Create a new empty project, using whichever back-end framework you prefer. Then follow the steps below to set git it up to pull from the correct repo for the boilerplate. Depending on which framework you use, you might get some conflicts. Fix these, then commit and push to your main repo as usual.

Add the boilerplate repo as a remote:
	
	$ git remote add boilerplate git@bitbucket.org:analogfolk-ondemand/nycanaint-boilerplate.git
	
Configure the push url to be empty -- we don't accidentally want to push changes to the boilerplate repo:

	$ git config remote.boilerplate.pushurl ""

When listing your remotes, you should see something like this:
	
	$ git remote -v
	boilerplate	git@bitbucket.org:analogfolk-ondemand/nycanaint-boilerplate.git (fetch)
	boilerplate	 (push)

Pull the boilerplate files from the repo:

	$ git pull boilerplate master

Install the dependencies locally to the project:

	$ npm install --save-dev

Explore the files in the src directory, and change gulpfile.js to fit your needs.

## Commands

Below are the default commands/tasks configured with gulp for this project.

Build for development:

	$ gulp dev

Build for development, and watch for changes:

	$ gulp watch

Build for production (this will concatinate and minify):

	$ gulp dist
