document.addEventListener('DOMContentLoaded', () => {
    const renderedTable = createTable(); 
    chrome.runtime.sendMessage(renderedTable, (response) => {
        console.log('received response, [status]: ', response); 
    })
})

// a simple stack class
// if only JavaScript arrays had peek()..
class HeaderStack {
    _arr = []; 
    push(item) { 
        this._arr.push(item); 
    }
    pop() { 
        return this._arr.pop(); 
    }
    peek() { 
        if (this._arr.length < 1) { 
            return null; 
        }
        return this._arr[this._arr.length - 1]; 
    }
    isEmpty() { 
        return this._arr.length == 0; 
    }
}

// contains information about each header for generating a MarkDown table of contents. 
class Header { 
    // is a negative number based on the number of hash marks (#) a heading has.
    // e.g., '#' is rank -1 and '##' is rank -2. 
    rank;
    // the literal text component of the heading.  
    text;
    // the number of tabs/spaces that precede the heading in the table of contents. 
    // this is relative to its parent heading and is partially determined by its rank
    indent; 
    // the URL hash pertaining to a heading e.g., #test-heading
    urlHash; 
    constructor(h) { 
        this.rank = -parseInt(h.localName.charAt(1)); 
        this.text = h.innerText; 
        this.urlHash = h.children[0].hash; 
    }
}

function createTable() { 
    // get elements that contain markdown header tokens. 
    // E.g, ##, ### etc.. 
    const articleBody = document.querySelector('article.markdown-body'); 
    const mdHeaders = articleBody.querySelectorAll('h1, h2, h3, h4, h5, h6');  

    // for storing the headers scraped from the page 
    // where each node: rank -> [number], text -> [string]
    const headerList = []; 

    // add the headers and their text to the array 
    mdHeaders.forEach(header => headerList.push(new Header(header))); 

    const stack = new HeaderStack();
    let tableStr = "";  
    for (let current of headerList) { 
        // case for first element  
        let top = stack.peek();
        if (top == null) { 
            current.indent = 0; 
            stack.push(current);
        } else  {
            // pop elements off until stack is empty or a greater than/matching rank is found 
            while (current.rank > top.rank) { 
                stack.pop();  
                if (stack.isEmpty()) {
                    current.indent = 0; 
                    stack.push(current);  
                    break; 
                }
                top = stack.peek(); 
            }
            // if current's rank is less than top's: increase current's indent by 1 
            if (current.rank < top.rank) { 
                current.indent = top.indent + 1;  
            // if current's rank is equal to top's, set current's indent to equal top's 
            } else if (current.rank == top.rank) { 
                current.indent = top.indent;  
            }
            stack.push(current);
        }
        // produces a string e.g., -> "\n\t[Heading 1](#heading-1)<br/>"
        tableStr += `\n${makeTabs(current.indent)} - [${current.text}](${current.urlHash})<br/>`
    }     
    return tableStr; 
}


// creates the proper tab seperated indent 
function makeTabs(numTabs) {
    let str = "";  
    for (let i = 0; i < numTabs; ++i) { 
        str += "\t"; 
    }
    return str; 
}