import { readdirSync, existsSync } from 'fs';
import { join } from 'path';

export default function handler(req, res) {
  const cwd = process.cwd();
  const results = {
    cwd,
    cwdContents: [],
    docsExists: existsSync(join(cwd, 'docs')),
    configExists: existsSync(join(cwd, 'docs.config.json')),
    docsContents: [],
    docsProjectsContents: [],
  };

  try { results.cwdContents = readdirSync(cwd); } catch (e) { results.cwdContents = e.message; }
  try { results.docsContents = readdirSync(join(cwd, 'docs')); } catch (e) { results.docsContents = e.message; }
  try { results.docsProjectsContents = readdirSync(join(cwd, 'docs', 'projects')); } catch (e) { results.docsProjectsContents = e.message; }

  res.status(200).json(results);
}
