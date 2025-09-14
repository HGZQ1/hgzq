# hgzq
这是一个AI短视频创意灵感生成助手，由小琴羽不是神明开发，该程序接入了阿里云百炼大模型平台的qwen-plusAI大模型辅助分析和输出。

以下是使用步骤，求求看仔细了>.<
在该文件夹目录下打开PowerShell输入npm start获取网站端口，进入http://localhost:3000

----------------------------------------------------------------------------------------------------------------------------------------------------------------------
如果你遇到的错误是在Windows PowerShell中执行 npm install 命令时，由于系统禁止运行脚本导致无法加载 npm.ps1 文件 。以下是解决这个问题的步骤：
 
步骤一：以管理员身份打开PowerShell
 
- 在Windows搜索栏中输入“PowerShell”。
- 找到“Windows PowerShell”应用，右键点击它，然后选择“以管理员身份运行”。（请先下载依赖，在powershell里输入：npm install)
 
步骤二：查看当前的执行策略
 
在以管理员身份打开的PowerShell窗口中，运行以下命令：
 
Get-ExecutionPolicy
 
 
这会显示当前系统的脚本执行策略，可能的值有 Restricted （默认值，禁止运行所有脚本）、 AllSigned （要求所有脚本都经过数字签名才能运行）、 RemoteSigned （本地创建的脚本可以直接运行，从互联网下载的脚本需要数字签名）等。
 
步骤三：更改执行策略
 
如果你信任你要运行的脚本，可以将执行策略更改为 RemoteSigned  ，在PowerShell中运行以下命令：
  
Set-ExecutionPolicy RemoteSigned

然后再次打开powershell输入npm start，进入http://localhost:3000
