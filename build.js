const s = require('shelljs');
 
s.rm('-rf', 'build');
s.rm('-rf', 'reports');
s.mkdir('build');
s.mkdir('reports');
s.mkdir('-p','logs');
s.cp(`.${s.env.NODE_ENV}.env`, `build/.${s.env.NODE_ENV}.env`);
s.cp('jwtRS256.key', 'build/');
s.cp('jwtRS256.key.pub', 'build/');
s.cp('-R', 'public', 'build/public');
s.mkdir('-p', 'build/server/common/swagger');
s.cp('server/common/swagger/Api.yaml', 'build/server/common/swagger/Api.yaml');
