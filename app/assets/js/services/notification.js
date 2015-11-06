angular.module('surveyor').factory('Notification',
  function (toastr) {
    return {
      error: function (error) {
        if (typeof error === 'string') {
          toastr.error(error);
        }
        else if (error.message) {
          toastr.error(error.message);
        }
      },
      success: function (success) {
        if (typeof success === 'string') {
          toastr.success(success);
        }
      },
      info: function (info) {
        if (typeof info === 'string') {
          toastr.info(info);
        }
      }
    };
  }
);