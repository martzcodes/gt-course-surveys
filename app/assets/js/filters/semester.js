angular.module('surveyor').filter('semester',
  function () {
    return function (semester,  dflt) {
      var id = '';

      if (semester === 'unknown') {
        return 'Unknown';
      }

      if (typeof semester === 'string') {
        id = semester;
      }
      else if (semester && semester.$id) {
        id = semester.$id;
      }

      if (id.indexOf('-') > 0) {
        var pieces = id.split('-');
        switch (pieces[1]) {
          case '1': return 'Spring ' + pieces[0];
          case '2': return 'Summer ' + pieces[0];
          case '3': return 'Fall '   + pieces[0];
          default:  return '';
        }
      }

      return dflt || semester;
    };
  }
);