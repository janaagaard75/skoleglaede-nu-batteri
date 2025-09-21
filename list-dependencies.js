#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const packageJsonPath = path.join(process.cwd(), "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

const bundledNativeModulesPath = path.join(
  process.cwd(),
  "node_modules",
  "expo",
  "bundledNativeModules.json",
);
const bundledModules = JSON.parse(
  fs.readFileSync(bundledNativeModulesPath, "utf8"),
);

const managedDependencies = [];
const nonManagedDependencies = [];

for (const dep of Object.keys(packageJson.dependencies)) {
  if (bundledModules[dep] !== undefined) {
    managedDependencies.push(dep);
  } else {
    nonManagedDependencies.push(dep);
  }
}

console.log(
  "📦 Dependencies managed by Expo SDK. Running `npx expo install --fix` ensures they have the correct version",
);
console.log(managedDependencies.sort().join("\n") || "(none)");

console.log(
  "\n📦 Non-managed dependencies. These dependencies have to be updated manually.",
);
console.log(nonManagedDependencies.sort().join("\n") || "(none)");
