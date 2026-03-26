const fs = require('fs');
const path = require('path');

module.exports = function handler(req, res) {
  const cwd = process.cwd();
  const results = {
    cwd,
    cwdContents: [],
    configExists: fs.existsSync(path.join(cwd, 'docs.config.json')),
    docsContents: [],
    docsProjectsContents: [],
  };
  try { results.cwdContents = fs.readdirSync(cwd); } catch (e) { results.cwdContents = e.message; }
  try { results.docsContents = fs.readdirSync(path.join(cwd, 'docs')); } catch (e) { results.docsContents = e.message; }
  try { results.docsProjectsContents = fs.readdirSync(path.join(cwd, 'docs', 'projects')); } catch (e) { results.docsProjectsContents = e.message; }
  res.status(200).json(results);
};
