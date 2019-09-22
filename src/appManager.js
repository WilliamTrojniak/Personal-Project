// var tasklist = require('tasklist');

// tasklist(function(err, tasks) {
//   if (err) throw err; // TODO: proper error handling
//   var appList = tasks.filter(function(task) {
//     return task.imageName.indexOf('ll_') === 0;
//   }).map(function(task) {
//     return {
//       id   : task.pid, // XXX: is that the same as your `id`?
//       name : task.imageName,
//     };
//   });
// });

const exec = require('child_process').exec;

const isRunning = (query, cb) => {
    let platform = process.platform;
    let cmd = '';
    switch (platform) {
        case 'win32' : cmd = `tasklist`; break;
        case 'darwin' : cmd = `ps -ax | grep ${query}`; break;
        case 'linux' : cmd = `ps -A`; break;
        default: break;
    }
    exec(cmd, (err, stdout, stderr) => {
        cb(stdout.toLowerCase().indexOf(query.toLowerCase()) > -1);
    });
}

isRunning('asda.exe', (status) => {
    console.log(status); // true|false
})