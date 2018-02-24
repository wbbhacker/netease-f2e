#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const _ = require('lodash');
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
	case 'getImg':
		let flag = process.argv[3] == 'true' ? true : false;
		let imgPath = process.cwd();
		getImgJson(imgPath,flag);
		break;
	case 'rename':
		if(process.argv[3] == undefined ){
			console.log(chalk.red('需要第三个参数：名称'));
			return;
		}else{
			rename(process.cwd(),process.argv[3])
		}
		
}

/***************************rename*******************************/ 
function rename(imgPath,newName){

	var obj = fs.readdirSync(imgPath).map((elem,idx)=>{

		return {
			name:elem,
			num:parseInt(elem.match(/[0-9]+/)[0])
		}

	});


	_.orderBy(obj,['num'],['asc']).forEach((obj,idx)=>{

		let oldPath = path.join(imgPath+'/'+obj.name);
		let ext = path.parse(oldPath).ext;
		let newPath = path.join(imgPath+'/'+newName+idx+ext);

		fs.renameSync(oldPath,newPath)

	});

	console.log(chalk.red('修改成功！！！'));
}



/***************************getImg*******************************/ 

function getImgJson(rootPath,flag){

	var str = '',
		arrSum = [];

	var name = path.parse(rootPath).name;
	var reg = new RegExp(name+'\/\\S*');

	readFile(rootPath);

	str = arrSum.map((elem)=>{

		elem = elem.replace(/\\/g,'/').match(reg)[0];
		return  flag ? '\'' + elem + '\'\n' : '\'' + elem + '\'';

	}).toString();

	str = '['+str+ ']';

	fs.writeFile('imgJsonData.js',str,(err)=>{
			if(err) throw err;
			console.log(chalk.red('写入 imgJsonData.js 成功！！！'));
	});

	function readFile(rootPath){

		fs.readdirSync(rootPath).forEach((elem)=>{

			if(fs.statSync(path.join(rootPath,elem)).isFile()){
				arrSum.push(path.join(rootPath,elem));
			}else{
				readFile(path.join(rootPath,elem));
			}

		});
	}

}




/***************************init*******************************/ 

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


