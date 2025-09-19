document.addEventListener("DOMContentLoaded", function() {
    var staticContent = document.getElementById('statis-content');
    if (staticContent) {
      document.body.appendChild(staticContent);
      var wrapper = document.getElementById('statis-wrapper');
      if (wrapper) {
        wrapper.remove();
      }
    }
  });
