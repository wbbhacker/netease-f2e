#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const c = require('child_process');
const chalk = require('chalk');
const _ = require('lodash');
const secondArgv = process.argv[2];
	
let pathObj,goOrAuto,projectName,data,urlData;
	
let code =  'stages:\n'+
			'- deploy\n'+
			'deploy:\n'+
			'  stage: deploy\n'+
			'  tags:\n'+
    		'	 - sales\n'+
			'  script:\n'+
			'    - echo "hello world"\n'+
			'    - /home/gitlab-runner/.local/bin/online.sh %s %s\n'+
			'  only:\n'+
			'    - master';

let autoUrl = '* 测试地址(test): http://test.go.163.com/web/sale_auto/%s/index.html\n\r'+
			  '* 正式地址(formal): http://s.auto.163.com/web/%s/index.html';

let goUrl = '* 测试地址(test): http://test.go.163.com/web/sale_go/%s/index.html\n\r'+
			'* 正式地址(formal): http://go.163.com/web/%s/index.html';

let ignore = '.idea/\r\n.project\r\n.DS_Store';


	
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
		break;
	case 'test':
		open(false);

		break;
	case 'go':
		open(true);
		
		break;
		
}
/***************************open*******************************/ 
function open(flag){

	pathObj = path.parse(process.cwd());
	testUrl = pathObj.dir.search('sale_auto') > -1 ? 'http://test.go.163.com/web/sale_auto/'+pathObj.name+'/index.html' : 'http://test.go.163.com/web/sale_go/'+pathObj.name+'/index.html';
	onlineUrl = pathObj.dir.search('sale_auto') > -1 ? 'http://s.auto.163.com/web/'+pathObj.name+'/index.html' : 'http://go.163.com/web/'+pathObj.name+'/index.html';
	console.log(testUrl,onlineUrl)
	if(flag){
		c.exec('start ' + onlineUrl);
	}else{
		c.exec('start ' + testUrl)
	}
}


/***************************rename*******************************/ 
function rename(imgPath,newName){

	var obj = fs.readdirSync(imgPath).map((elem,idx)=>{

		return {
			name:elem,
			num:parseInt(elem.match(/[0-9]+/) instanceof Array ? elem.match(/[0-9]+/)[0] : 0) 
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



function init(opt){
	let str;
	opt = opt || {};

	pathObj = path.parse(process.cwd());
	goOrAuto = pathObj.dir.search('sale_auto') > -1 ? 'sale_auto' : 'sale_go';
	str = pathObj.dir.search('sale_auto') > -1 ? autoUrl  : goUrl;
	projectName = pathObj.name;


	urlData = sprintf(str,pathObj.name,pathObj.name);
	data = sprintf(code,goOrAuto,projectName);

	fs.writeFile('.gitlab-ci.yml',data,(err)=>{
		if (err) throw err;
		console.log(chalk.red('create .gitlab-ci.yml success!!!'));
	});

	fs.writeFile('README.md',urlData,(err)=>{
		if (err) throw err;
		console.log(chalk.red('create README.md success!!!'));
 	});

 		
 	fs.writeFile('.gitignore',ignore,'utf8',(err)=>{
		if (err) throw err;
		console.log(chalk.red('create .gitignore success!!! '));
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


