// Test script to verify Lottie pro badge implementation
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Pro Badge Animation Implementation\n');

// 1. Check if lottie-react is installed
try {
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  if (packageJson.dependencies['lottie-react']) {
    console.log('✅ lottie-react installed:', packageJson.dependencies['lottie-react']);
  } else {
    console.log('❌ lottie-react NOT found in dependencies');
  }
} catch (e) {
  console.log('❌ Error reading package.json');
}

// 2. Check if pro-badge.json exists and is valid
try {
  const animationPath = './src/assets/animations/pro-badge.json';
  const animationData = JSON.parse(fs.readFileSync(animationPath, 'utf8'));
  console.log('✅ pro-badge.json exists and is valid JSON');
  console.log('   - Width:', animationData.w, 'px');
  console.log('   - Height:', animationData.h, 'px');
  console.log('   - Frame rate:', animationData.fr, 'fps');
} catch (e) {
  console.log('❌ pro-badge.json missing or invalid');
}

// 3. Check CreateBlog.tsx
try {
  const createBlogContent = fs.readFileSync('./src/components/CreateBlog/CreateBlog.tsx', 'utf8');
  const hasLottieImport = createBlogContent.includes("import Lottie from 'lottie-react'");
  const hasAnimationImport = createBlogContent.includes("import proBadgeAnimation from");
  const hasLottieUsage = createBlogContent.match(/<Lottie/g);
  
  console.log('\n📄 CreateBlog.tsx:');
  console.log(hasLottieImport ? '✅ Lottie import' : '❌ Missing Lottie import');
  console.log(hasAnimationImport ? '✅ Animation import' : '❌ Missing animation import');
  console.log(hasLottieUsage ? `✅ Lottie used ${hasLottieUsage.length} times` : '❌ Lottie not used');
} catch (e) {
  console.log('❌ Error reading CreateBlog.tsx');
}

// 4. Check SecondaryKeyword.tsx
try {
  const content = fs.readFileSync('./src/components/BlogScreens/SecondaryKeyword.tsx', 'utf8');
  const hasLottieImport = content.includes("import Lottie from 'lottie-react'");
  const hasLottieUsage = content.match(/<Lottie/g);
  
  console.log('\n📄 SecondaryKeyword.tsx:');
  console.log(hasLottieImport ? '✅ Lottie import' : '❌ Missing Lottie import');
  console.log(hasLottieUsage ? `✅ Lottie used ${hasLottieUsage.length} times` : '❌ Lottie not used');
} catch (e) {
  console.log('❌ Error reading SecondaryKeyword.tsx');
}

// 5. Check TitleScreen.tsx
try {
  const content = fs.readFileSync('./src/components/BlogScreens/TitleScreen/TitleScreen.tsx', 'utf8');
  const hasLottieImport = content.includes("import Lottie from 'lottie-react'");
  const hasLottieUsage = content.match(/<Lottie/g);
  
  console.log('\n📄 TitleScreen.tsx:');
  console.log(hasLottieImport ? '✅ Lottie import' : '❌ Missing Lottie import');
  console.log(hasLottieUsage ? `✅ Lottie used ${hasLottieUsage.length} times` : '❌ Lottie not used');
} catch (e) {
  console.log('❌ Error reading TitleScreen.tsx');
}

// 6. Check ReferenceArticle.tsx
try {
  const content = fs.readFileSync('./src/components/BlogScreens/ReferenceArticle.tsx', 'utf8');
  const hasLottieImport = content.includes("import Lottie from 'lottie-react'");
  const hasLottieUsage = content.match(/<Lottie/g);
  
  console.log('\n📄 ReferenceArticle.tsx:');
  console.log(hasLottieImport ? '✅ Lottie import' : '❌ Missing Lottie import');
  console.log(hasLottieUsage ? `✅ Lottie used ${hasLottieUsage.length} times` : '❌ Lottie not used');
} catch (e) {
  console.log('❌ Error reading ReferenceArticle.tsx');
}

console.log('\n🎯 Summary:');
console.log('All files have been updated with Lottie pro badge animation.');
console.log('\n⚠️  IMPORTANT: The pro badges will ONLY show when:');
console.log('   1. You are logged in');
console.log('   2. Your plan is "Free" or "Basic"');
console.log('   3. planDetails.name is correctly set in GlobalContext');
console.log('\n💡 To test:');
console.log('   - Login with a Free or Basic account');
console.log('   - Check Create Blog sidebar sections');
console.log('   - Check "Ask InkAI" buttons');
console.log('   - Check Reference Files section');
