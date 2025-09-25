const fs = require('fs-extra');
const path = require('path');
const { minify } = require('html-minifier-terser');

async function build() {
  console.log('🚀 Building project...');
  
  // 빌드 폴더 초기화
  await fs.ensureDir('dist');
  await fs.emptyDir('dist');
  
  // HTML 파일 minify
  console.log('📄 Minifying HTML...');
  const htmlContent = await fs.readFile('src/index.html', 'utf8');
  
  const minifiedHtml = await minify(htmlContent, {
    removeComments: true,
    removeCommentsFromCDATA: true,
    removeCDATASectionsFromCDATA: true,
    collapseWhitespace: true,
    conservativeCollapse: false,
    preserveLineBreaks: false,
    collapseBooleanAttributes: true,
    removeAttributeQuotes: true,
    removeRedundantAttributes: true,
    preventAttributesEscaping: true,
    useShortDoctype: true,
    removeEmptyAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    removeOptionalTags: false,
    removeIgnored: false,
    removeEmptyElements: false,
    lint: false,
    keepClosingSlash: false,
    caseSensitive: false,
    minifyJS: true,
    minifyCSS: true,
    minifyURLs: false
  });
  
  await fs.writeFile('dist/index.html', minifiedHtml);
  
  // 애셋 파일 복사
  console.log('🖼️  Copying assets...');
  const srcDir = 'src';
  const distDir = 'dist';
  
  const files = await fs.readdir(srcDir);
  for (const file of files) {
    if (file !== 'index.html') {
      await fs.copy(path.join(srcDir, file), path.join(distDir, file));
    }
  }
  
  // logo 폴더가 있는지 확인하고 복사
  const logoSrcPath = path.join(srcDir, 'logo');
  const logoDistPath = path.join(distDir, 'logo');
  
  if (await fs.pathExists(logoSrcPath)) {
    await fs.copy(logoSrcPath, logoDistPath);
    console.log('📁 Logo files copied to dist/logo/');
  }
  
  // 빌드 완료 정보 출력
  const originalSize = (await fs.stat('src/index.html')).size;
  const minifiedSize = (await fs.stat('dist/index.html')).size;
  const reduction = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);
  
  console.log(`✅ Build completed!`);
  console.log(`📊 HTML size: ${originalSize} bytes → ${minifiedSize} bytes (${reduction}% reduction)`);
  console.log(`📁 Output: dist/`);
}

build().catch(console.error);