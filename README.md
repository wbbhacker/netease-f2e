# netease-f2e
> _f2e前端脚手架_

## Install

```
npm install netease-f2e -g
```


## commond

* 生成.gitlab-ci.yml文件
```
fe init [true]
```

> 在项目目录下打开命令行，输入命令`fe init ` ，自动创建.gitlab-ci.yml、MEADME.md文件, MEADME.md 里面含有项目的正式和测试链接;
> 第三个参数为ture时，会生成.gitignore文件，忽略.idea 文件夹 和 .project 文件


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
## FAQ
### 插件安装失败原因
  1. 升级node版本 > 8.9.4  
  2. 重新在安装一次
