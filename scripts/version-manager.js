const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = require(packageJsonPath);

const args = process.argv.slice(2);
const strategyArg = args.find(arg => arg.startsWith('--strategy='));
const bumpArg = args.find(arg => arg.startsWith('--bump='));

const strategy = strategyArg ? strategyArg.split('=')[1] : null;
const bump = bumpArg ? bumpArg.split('=')[1] : null;

if (!strategy) {
  console.error('Error: --strategy argument is required (calver or semver)');
  process.exit(1);
}

function updateVersion(newVersion) {
  packageJson.version = newVersion;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  console.log(`Version updated to ${newVersion}`);
}

if (strategy === 'calver') {
  // Calendar Versioning: YY.MM.DD
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const newVersion = `${day}.${month}.${year}`;
  updateVersion(newVersion);

} else if (strategy === 'semver') {
  // Semantic Versioning: Major.Minor.Patch
  if (!bump) {
    console.error('Error: --bump argument is required for semver strategy (major, minor, or patch)');
    process.exit(1);
  }

  let [major, minor, patch] = packageJson.version.split('.').map(Number);

  if (isNaN(major) || isNaN(minor) || isNaN(patch)) { 
      // Fallback if current version is not semver-compliant (e.g. if it was previously calver)
      console.warn(`Warning: Current version ${packageJson.version} is not valid SemVer. Resetting to 1.0.0 as base.`);
      major = 1; minor = 0; patch = 0;
  }

  switch (bump) {
    case 'major':
      major++;
      minor = 0;
      patch = 0;
      break;
    case 'minor':
      minor++;
      patch = 0;
      break;
    case 'patch':
      patch++;
      break;
    default:
      console.error('Error: Invalid bump type. Use major, minor, or patch.');
      process.exit(1);
  }

  const newVersion = `${major}.${minor}.${patch}`;
  updateVersion(newVersion);

} else {
  console.error('Error: Invalid strategy. Use calver or semver.');
  process.exit(1);
}
