const { desktopCapturer } = require('electron');
const psList = require('ps-list');
const find = require('find-process');

const programs_search_bar = document.getElementById('programs-search-bar');
const unadded_programs_table = document.getElementById('unadded-programs');

let processes_are_current = false;
let current_filtered_processes;
let unadded_matched_processes = [];

//Called on init and refresh button
function getUniqueProcesses(){
    //Sets processes to be out of date
    processes_are_current = false;
    //Gets all currently running processes
    let process_list = getCurrentProcesses();
    process_list.then((defs) => {
        //Filter all process to remove duplicates
        current_filtered_processes = filterArray(defs);
        //Sets processes as to date
        processes_are_current = true;
    });
}

//Returns an array without any duplicates
function filterArray(processes){
    let unique_processes = new Set();
    for(let i = 0; i < processes.length; i++){
        unique_processes.add(processes[i].name);
    }
    return Array.from(unique_processes);
}

//Returns all currently running processes
async function getCurrentProcesses() {
	return(await psList());
	//=> [{pid: 3213, name: 'node', cmd: 'node test.js', ppid: 1, uid: 501, cpu: 0.1, memory: 1.5}, …]
}

//Display unadded processes on GUI
function displayMatchingProcesses(processes){
    //TODO Filter out already added processes
    //Clear HTML Code for the table
    unadded_programs_table.innerHTML = "";
    //Create new table row elements for every matching process
    for(let i = 0; i < processes.length; i++){
        let htmlString = (`<tr><td> ${processes[i]} </td> <td>hi</td></tr>`)
        unadded_programs_table.innerHTML += htmlString;
    }

}

function findMatchingPrograms(keyword){
    keyword = keyword.toLowerCase();
    let matching_processes = [];
    for(let i = 0; i < current_filtered_processes.length; i++){
        if(current_filtered_processes[i].toLowerCase().indexOf(keyword) !== -1){
            matching_processes.push(current_filtered_processes[i]);
            displayMatchingProcesses(matching_processes);
        }
    }
}

programs_search_bar.addEventListener('input', () =>{
    let input = programs_search_bar.value;
    findMatchingPrograms(input);
});


//Main
getUniqueProcesses();


find('name', "Code.exe").then(function (list) {
                console.log(list);
            }, function (err) {
                console.log(err.stack || err);
            })

console.log(desktopCapturer.getSources({types: ['window']}))

// desktopCapturer.getSources({
//   types: ['window']
// }, (error, sources) => {
//   if (error) throw error
//   for (let i = 0; i < sources.length; ++i) {
//     console.log(sources[i]);
//   }
// });


// let findProcessOfMatchingName = find('name', input).then(function (list) {
//     console.log(list);
//   }, function (err) {
//     console.log(err.stack || err);
//   })

// tasklist = require('tasklist');

// tasklist({ verbose: true })
// .then(apps => {
//   apps = apps
//   .filter(app => app.sessionName !== 'Services')
//   .filter(app => /^(?!NT AUTHORITY).+\\/.test(app.username));

//   console.log(apps)
// })
// .catch(console.error);
