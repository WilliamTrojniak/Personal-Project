const { desktopCapturer } = require('electron');

const programs_search_bar = document.getElementById('programs-search-bar');
const unadded_programs_table = document.getElementById('unadded-programs');



function getCurrentlyOpenWindows(){
    
}
desktopCapturer.getSources({types: ['window']}).then((defs)=>{
    console.log(defs);
});