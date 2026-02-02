; Inno Setup 安装脚本 - 文档转换器
; 版本: 1.0.0

#define MyAppName "文档转换器"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "鲲穹AI"
#define MyAppExeName "文档转换器.exe"
#define MyAppAssocName "文档转换器"
#define MyAppAssocExt ""
#define MyAppAssocKey StringChange(MyAppAssocName, " ", "") + MyAppAssocExt

[Setup]
; 应用基本信息
AppId={{8F9A2B3C-4D5E-6F7A-8B9C-0D1E2F3A4B5C}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
DefaultDirName={autopf}\{#MyAppName}
DefaultGroupName={#MyAppName}
; 输出配置
OutputDir=release\{#MyAppVersion}\innosetup
OutputBaseFilename=文档转换器-Setup-{#MyAppVersion}
; 图标和界面
SetupIconFile=frontend\public\app.ico
UninstallDisplayIcon={app}\{#MyAppExeName}
; 压缩
Compression=lzma2/max
SolidCompression=yes
; 权限和兼容性
PrivilegesRequired=admin
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
; 界面选项
WizardStyle=modern
DisableProgramGroupPage=yes
; 许可和信息
LicenseFile=
InfoBeforeFile=
InfoAfterFile=
; 卸载
UninstallDisplayName={#MyAppName}
UninstallFilesDir={app}\uninstall

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "创建桌面快捷方式"; GroupDescription: "附加图标:"; Flags: unchecked

[Files]
; 主程序文件
Source: "release\{#MyAppVersion}\win-unpacked\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs
; 注意: 不要在任何共享系统文件上使用 "Flags: ignoreversion"

[Icons]
; 开始菜单快捷方式
Name: "{group}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"
Name: "{group}\卸载 {#MyAppName}"; Filename: "{uninstallexe}"
; 桌面快捷方式
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon

[Run]
; 安装完成后运行程序
Filename: "{app}\{#MyAppExeName}"; Description: "启动 {#MyAppName}"; Flags: nowait postinstall skipifsilent

[Code]
// 检查是否已安装旧版本
function InitializeSetup(): Boolean;
var
  ResultCode: Integer;
  UninstallString: String;
begin
  Result := True;
  
  // 检查是否已安装
  if RegQueryStringValue(HKLM, 'Software\Microsoft\Windows\CurrentVersion\Uninstall\{8F9A2B3C-4D5E-6F7A-8B9C-0D1E2F3A4B5C}_is1', 'UninstallString', UninstallString) then
  begin
    if MsgBox('检测到已安装旧版本，是否先卸载？', mbConfirmation, MB_YESNO) = IDYES then
    begin
      Exec(RemoveQuotes(UninstallString), '/SILENT', '', SW_SHOW, ewWaitUntilTerminated, ResultCode);
      Result := True;
    end
    else
    begin
      Result := False;
    end;
  end;
end;

// 安装前关闭正在运行的程序
function PrepareToInstall(var NeedsRestart: Boolean): String;
var
  ResultCode: Integer;
begin
  Result := '';
  
  // 尝试关闭正在运行的程序
  if CheckForMutexes('{#MyAppName}') then
  begin
    if MsgBox('检测到程序正在运行，需要关闭后才能继续安装。是否立即关闭？', mbConfirmation, MB_YESNO) = IDYES then
    begin
      // 这里可以添加关闭程序的代码
      Result := '';
    end
    else
    begin
      Result := '请先关闭正在运行的程序';
    end;
  end;
end;
