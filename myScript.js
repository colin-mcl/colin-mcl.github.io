function findOffset(element) {
    var top = 0, left = 0;
    
    do {
        top += element.offsetTop || 0;
        left += element.offsetLeft || 0;
        element = element.offsetParent;
    } while (element);
    
    return {
        top: top,
        left: left
    };
}

window.onload = function(){
    var stickyHeader = document.getElementById('nav-header');
    var headerOffset = findOffset(stickyHeader);
    
    window.onscroll = function() {
        var bodyScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        
        if (bodyScrollTop > headerOffset.top) {
            stickyHeader.classList.add('fixed');
        } else {
            stickyHeader.classList.remove('fixed');
        }
    }
}

