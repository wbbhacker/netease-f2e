# netease-f2e
> _f2e前端脚手架_

## Install

```
npm install netease-f2e -g
```


## commond

* 生成.gitlab-ci.yml文件
```
fe init 
```
> 在项目目录下打开命令行，输入命令`fe init ` ，自动创建.gitlab-ci.yml、MEADME.md、.gitignore文件, MEADME.md 里面含有项目的正式和测试链接;.gitignore文件会忽略.idea 文件夹 和 .project 文件;


* 获取当前文件夹下所有文件的json数据
```
fe getImg [true|false]
```
> 第三个参数为true时，生成的代码为格式化的；为false时，生成的代码为压缩的；默认为false

* 修改序列帧图片名字
```
fe rename customName
```
> 修改当前文件夹下所有img图片的名称： customName0-customName9.... ps：注意是序列帧图片

* 在默认浏览器中打开项目的正/测式链接
```
fe [test|go]
```
> 在默认浏览器中打开项目的正/测式链接,fe test 为打开测试链接,fe go 为打开正式链接;

## FAQ
### 插件安装失败原因
  1. 升级node版本 > 8.9.4  
  2. 重新在安装一次
