const slowTestScroll =()=>{
    let testHolder = document.getElementById('test-holder');
    testHolder.classList.add('slowTest');
}

const resumeTestScroll =()=>{
    let testHolder = document.getElementById('test-holder');
    testHolder.classList.remove('slowTest');
}