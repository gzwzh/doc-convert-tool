/**
 * 测试 Electron 更新功能集成
 */
const fs = require('fs');
const path = require('path');

console.log('='.repeat(60));
console.log('Electron 更新功能集成检查');
console.log('='.repeat(60));

const checks = [
  {
    name: 'Electron 主程序',
    path: 'electron/main.js',
    required: true
  },
  {
    name: 'Preload 脚本',
    path: 'electron/preload.js',
    required: true
  },
  {
    name: '版本号文件',
    path: 'version.txt',
    required: true
  },
  {
    name: '更新配置',
    path: 'update_config.json',
    required: true
  },
  {
    name: '自动更新模块',
    path: 'auto_updater.py',
    required: true
  },
  {
    name: '更新GUI',
    path: 'update_checker_gui.py',
    required: true
  },
  {
    name: '独立更新程序',
    path: 'updater.exe',
    required: true
  }
];

let allPassed = true;

console.log('\n核心文件检查:\n');

checks.forEach(check => {
  const exists = fs.existsSync(check.path);
  const status = exists ? '✓' : '✗';
  const color = exists ? '\x1b[32m' : '\x1b[31m';
  
  console.log(`${color}${status}\x1b[0m ${check.name}`);
  console.log(`  路径: ${check.path}`);
  
  if (!exists && check.required) {
    allPassed = false;
  }
  console.log();
});

// 检查 electron-builder 配置
console.log('Electron Builder 配置检查:\n');

const builderConfig = fs.readFileSync('electron-builder.yml', 'utf-8');
const requiredInConfig = [
  'version.txt',
  'update_config.json',
  'auto_updater.py',
  'update_checker_gui.py',
  'updater.exe'
];

requiredInConfig.forEach(file => {
  const included = builderConfig.includes(file);
  const status = included ? '✓' : '✗';
  const color = included ? '\x1b[32m' : '\x1b[31m';
  
  console.log(`${color}${status}\x1b[0m ${file} ${included ? '已包含' : '未包含'}`);
  
  if (!included) {
    allPassed = false;
  }
});

// 检查版本号
console.log('\n\n版本信息:\n');

if (fs.existsSync('version.txt')) {
  const version = fs.readFileSync('version.txt', 'utf-8').trim();
  console.log(`当前版本: ${version}`);
}

if (fs.existsSync('update_config.json')) {
  const config = JSON.parse(fs.readFileSync('update_config.json', 'utf-8'));
  console.log(`软件编号: ${config.software_id}`);
  console.log(`更新服务器: ${config.server_url}`);
}

// 总结
console.log('\n' + '='.repeat(60));
if (allPassed) {
  console.log('\x1b[32m✓ 所有检查通过！更新功能已正确集成\x1b[0m');
  console.log('\n下一步:');
  console.log('1. 运行 npm run build 生成安装程序');
  console.log('2. 安装并测试更新功能');
} else {
  console.log('\x1b[31m✗ 部分检查失败，请修复上述问题\x1b[0m');
}
console.log('='.repeat(60));
