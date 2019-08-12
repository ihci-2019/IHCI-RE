# IHCI-Calender-Link
*****
### 原IHCI平台(IHCI-RE项目)的项目结构：
* api-doc：&emsp;关于user的api文档。
* icon-font：&emsp;图标、字体的静态文件。
* public: &emsp;前端编译后文件的所在目录。
* server: &emsp;后端文件夹。
* site: &emsp;前端文件夹。
    * activity-react: &emsp;前端项目文件夹。
* dest: &emsp;项目打包后文件所在目录（若没有，可手动生成）
*****
### 原IHCI平台(IHCI-RE项目)的依赖软件：
* NodeJS
* mongodb
* redis
* docker
*****
### 原IHCI平台(IHCI-RE项目)的编译和部署：
<p>&emsp;由于本人并不是IHCI平台的作者，也没有拿到详细的部署文档，所以这里只是给出了我自己的部署情况。</p>
###&emsp;1. 编译环境（前端）
<p>&emsp;此部分非常重要，因为现在的IHCI-RE中仍有部分坑点，最好与下面相同的环境中编译。</p>
<ul>
    <li>OS: win10 Version: 1903</li>
    <li>Node: v10.13.0以上</li>
    <li>npm: v6.4.1以上</li>
    <li>c++编译器：MSVC</li>
</ul>
<p>&emsp;由于原IHCI-RE项目中，给出的build.sh文件和run.sh文件使用的是Ubuntu/Debian系统的指令，因此容易会被人放到Ubuntu/Debian平台上去编译。但是，由于某种原因（本人也不知道），在npm编译的时候，会出现crypto-js文件读取失败的情况，导致编译失败。规避这个失败的方法就是使用windows系统进行编译。</p>

### &emsp;2. 编译指令(windows下进行)
<p>&emsp;此部分指令的默认目录均是在项目的根目录执行。</p>
```
    npm install
    npm run build
```
<p>&emsp;前端编译好的js文件会出现在public文件夹下的activity-react文件夹下。将其复制到Ubuntu该项目的public文件夹下即可。</p>

### &emsp;3. 打包指令(ubuntu下进行)
<p>&emsp;在打包之前，需要先安装gulp：</p>
```
    sudo npm install -g gulp
```
<p>&emsp;由于项目根目录下的已经存在gulpfile，所以这里直接gulp即可</p>
```
    gulp
```
<p>&emsp;静待打包完成。</p>
<p>&emsp;打包完成后，dest文件夹的文件夹结构为：</p>
<li>public: &emsp;同根目录public文件夹
<li>server: &emsp;同根目录server文件夹
<li>site: &emsp;同根目录site文件夹

### &emsp;4. 部署指令(ubuntu下进行)
<p>该操作所在的文件夹在打包完成的dest中。</p>
```
    cd server
    sudo node startup.js --port 80 //在80端口下使用config-dev配置文件启动服务器
    或：sudo node startup.js -c 配置文件名
```
