const psList = require('ps-list');
const find = require('find-process');

const programs_search_bar = document.getElementById('programs-search-bar');

let current_filtered_processes = [];

function getUniqueProcesses(){
    let process_list = getCurrentProcesses();
    process_list.then((defs) => {
        let filtered_processes = filterProcesses(defs);
        current_filtered_processes = Array.from(filtered_processes);
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

function findMatchingPrograms(keyword){
    getUniqueProcesses();
    keyword = keyword.toLowerCase();
    console.clear();
    for(let i = 0; i < current_filtered_processes.length; i++){
       

        if(current_filtered_processes[i].toLowerCase().indexOf(keyword) !== -1){
            
            console.log(current_filtered_processes[i]);
            
        }
    }
    
}



programs_search_bar.addEventListener('input', () =>{
    let input = programs_search_bar.value;
    findMatchingPrograms(input);
});





// find('name', input).then(function (list) {
//     console.log(list);
//   }, function (err) {
//     console.log(err.stack || err);
//   })









