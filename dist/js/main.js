// function ready(callback){
//     if (document.readyState!=='loading') callback();
//     else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
//     else document.attachEvent('onreadystatechange', function(){
//             if (document.readyState==='complete') callback();
//         });
// }
//
// ready(function(){
//     console.log('Document ready.');
//     let docViewerLogo = document.querySelector('#docviewer-logo');
//     UIkit.svg(docViewerLogo).svg.then(function(svg) {
//         console.log();
//         // svg.querySelector('path').style.stroke = 'red';
//     });
//
//     let closeSidebar = document.querySelector('#close-sidebar');
//     let openSidebar = document.querySelector('#open-sidebar');
//     openSidebar.addEventListener('click', ()=>{
//         UIkit.offcanvas('#sidebar').toggle();
//     });
//     closeSidebar.addEventListener('click', ()=>{
//         UIkit.offcanvas('#sidebar').hide();
//     });
//
//
//
// });