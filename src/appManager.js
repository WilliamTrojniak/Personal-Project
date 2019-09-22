const psList = require('ps-list');

let current_filtered_processes;


function getUniqueProcesses(){
    let process_list = getCurrentProcesses();
    process_list.then((defs) => {
        let filtered_processes = filterProcesses(defs);
        current_filtered_processes = filtered_processes;
        console.log(current_filtered_processes);
    });
    
}

async function getCurrentProcesses() {
	return(await psList());
	//=> [{pid: 3213, name: 'node', cmd: 'node test.js', ppid: 1, uid: 501, cpu: 0.1, memory: 1.5}, …]
}

function filterProcesses(processes){
    let unique_processes = new Set();
    for(let i = 0; i < processes.length; i++){
        unique_processes.add(processes[i].name);
    }
    return(unique_processes);
}

getUniqueProcesses();















// const find = require('find-process');
// find('name', "minecraft.exe")
//   .then(function (list) {
//     console.log(list);
//   }, function (err) {
//     console.log(err.stack || err);
//   })

// console.log(process.pid);