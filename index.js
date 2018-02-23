#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const secondArgv = process.argv[2];
	
let pathObj,goOrAuto,projectName,data;
	
let code =  'stages:\n'+
			'- deploy\n'+
			'deploy:\n'+
			'  stage: deploy\n'+
			'  script:\n'+
			'    - echo "hello world"\n'+
			'    - online.sh %s %s\n'+
			'  only:\n'+
			'    - master';

	
switch(secondArgv){
	case 'init':
		init();
		break;
}

function init(){
	// create .yml file
	pathObj = path.parse(process.cwd());
	goOrAuto = pathObj.dir.search('sale_go') > -1 ? 'sale_go' : 'sale_auto';
	projectName = pathObj.name;

	data = sprintf(code,goOrAuto,projectName);

	fs.writeFile('.gitlab-ci.yml',data,(err)=>{
		if (err) throw err;
		console.log(chalk.red('success!!!'));
	});

	// create project files
}

function sprintf(str) {
    var args = arguments,
        flag = true,
        i = 1;

    str = str.replace(/%s/g, function () {
        var arg = args[i++];

        if (typeof arg === 'undefined') {
            flag = false;
            return '';
        }
        return arg;
    });
    return flag ? str : '';
}


