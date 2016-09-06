/*
    Menu with articles. The JS is needed by touch devices only
*/

module.exports = function() {
    var button = document.querySelector('.articles .button-down');
    var section = document.querySelector('.articles');
    button.addEventListener('click', function(e) {
      section.classList.toggle('articles-show');
      e.stopPropagation();
    });
    document.body.addEventListener('click', function() {
      section.classList.remove('articles-show');
    });
};
