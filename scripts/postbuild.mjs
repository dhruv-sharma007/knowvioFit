// scripts/postbuild.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { glob } from 'glob';

async function fixImports() {
  const files = await glob('dist/**/*.js');
  
  for (const file of files) {
    let content = readFileSync(file, 'utf8');
    // Updated regex to handle dots in filenames and preserve quotes
    content = content.replace(
      /from\s+(['"])(\.{1,2}\/[\w-./]+)(?<!\.js)\1/g,
      'from $1$2.js$1'
    );
    writeFileSync(file, content);
  }
}

fixImports().catch(console.error);


// this script will add .js in in dist imports after building ts code 

// example: import { something } from './some-file'
// will be changed to import { something } from './some-file.js'