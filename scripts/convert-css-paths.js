const fs = require('fs');
const path = require('path');
const glob = require('glob');

// 项目根目录的绝对路径
const rootDir = path.resolve(__dirname, '..');

// 查找所有CSS文件
const cssFiles = glob.sync('app/**/*.css', { cwd: rootDir });

console.log(`找到 ${cssFiles.length} 个CSS文件`);

// 处理每个CSS文件
cssFiles.forEach(file => {
  const filePath = path.join(rootDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 检查文件中是否有 url(@/ 模式
  if (content.includes('url(@/')) {
    console.log(`处理文件: ${file}`);
    
    // 获取当前CSS文件相对于项目根目录的路径
    const relativeDirFromRoot = path.dirname(file);
    
    // 替换 url(@/path) 为相对路径
    content = content.replace(/url\(@\/([^)]+)\)/g, (match, p1) => {
      // 计算从CSS文件到目标资源的相对路径
      const targetPath = p1;
      const relativePath = path.relative(relativeDirFromRoot, targetPath);
      
      // 确保路径分隔符是正斜杠(/)
      const normalizedPath = relativePath.replace(/\\/g, '/');
      
      console.log(`  将 @/${targetPath} 替换为 ${normalizedPath}`);
      return `url(${normalizedPath})`;
    });
    
    // 写回文件
    fs.writeFileSync(filePath, content);
  }
});

console.log('CSS路径转换完成！');