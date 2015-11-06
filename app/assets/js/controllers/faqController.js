angular.module('surveyor').controller('FaqController',
  function ($scope) {
    $scope.questions = [
      {
        title: 'What is this?',
        answer: [
          'This app was created for OMSCS students to get a feel for course difficulty and workload.',
          'It is not endorsed or sponsored in any way by the official OMSCS program or staff.'
        ]
      },
      {
        title: 'Does this automatically sync with the old Google Doc?',
        answer: [
          'No. There was a one-time import of all data in the Google Doc on November 5, 2015.',
          'While the Google Doc is still accessible, its use is discouraged, because it lacks validation and other useful features.'
        ]
      },
      {
        title: 'Do I have to sign in to post reviews?',
        answer: [
          'Yes, and you can authenticate anonymously, with a gatech.edu email/password, or with Google.',
          'Unfortunately, there is not an easy way to determine the validity of a gatech.edu email, so please enter your email correctly if you choose to authenticate with an email/password!'
        ]
      },
      {
        title: 'How does voting work?',
        answer: [
          'You may upvote or downvote reviews made by others. You may cast at most one vote (ever) per review.'
        ]
      }
    ];
  }
);