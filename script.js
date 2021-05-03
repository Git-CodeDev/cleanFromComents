// Function to create and download a file
function download(data, filename, type) {
    const file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Other
        let a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}   

// Main function
function commentsStrip(object){
    const RE_BLOCKS = new RegExp([
      /\/(\*)[^*]*\*+(?:[^*\/][^*]*\*+)*\//.source,           // Multiline comment
      /\/(\/)[^\n]*$/.source,                                 // One line comment
      /"(?:[^"\\]*|\\[\S\s])*"|'(?:[^'\\]*|\\[\S\s])*'|`(?:[^`\\]*|\\[\S\s])*`/.source,
      /(?:[$\w\)\]]|\+\+|--)\s*\/(?![*\/])/.source,           // Division operator
      /\/(?=[^*\/])[^[/\\]*(?:(?:\[(?:\\.|[^\]\\]*)*\]|\\.)[^[/\\]*)*?\/[gim]*/.source
      ].join('|'),
      'gm'  
    );

    // Check for browser support FILE API
    if (window.File && window.FileReader && window.Blob) {
        let content = '';  // Variable to write the contents of the file
        const file = object.files[0];  // the first element of the file array
        const reader = new FileReader();
        // If the file is loaded successfully, write the content to the variable
        reader.onload = function(){
            content = reader.result;
            // Delete comments
            let a = content.replace(RE_BLOCKS, function (match, mlc, slc) {
                                                return mlc ? ' ' :         // Multiline comment (space)
                                                slc ? '' :          // Single/multi-line
                                                match;             
            });
            // Return the function to download the finished document
            return(download(a, file.name, file.type));
        }
        // As simple text
        reader.readAsText(file);
    }else{
        alert("The required File APIs are not supported by your browser!");
    }
}

// Work with page elements
const selector = document.getElementById("imgUpload");

selector.addEventListener("change", () => {
    if (selector.files && selector.files[0]) {
        commentsStrip(selector);
}})