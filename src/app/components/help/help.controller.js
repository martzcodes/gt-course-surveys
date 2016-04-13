(function () {
    'use strict';

    angular
        .module('app.components.help')
        .controller('HelpController', HelpController);

    /* @ngInject */
    function HelpController() {
        var vm = this;

        vm.items = [{
            title: 'What is this app?',
            body: [
                'This app was created for OMSCS students to get a feel for course difficulty and workload.',
                'It is not endorsed or sponsered by the official OMSCS program or staff.'
            ]
        }, {
            title: 'Does this sync with the old Google doc?',
            body: [
                'No. There was a one-time import of that data on November 5, 2015.',
                'While the Google doc is still accessible, its use is discouraged as it lacks validation and other useful features.'
            ]
        }, {
            title: 'How do I publish reviews?',
            body: [
                'You will see the floating action button for composing a review after signing in.'
            ]
        }, {
            title: 'How do I publish reviews anonymously?',
            body: [
                'Go to Profile, and activate the Remain anonymous to others? switch.'
            ]
        }, {
            title: 'How can I access the data?',
            body: [
                '<a href="https://gt-surveyor.firebaseio.com/reviews.json" target="_blank">https://gt-surveyor.firebaseio.com/reviews.json</a>',
                '<a href="https://gt-surveyor.firebaseio.com/grades.json" target="_blank">https://gt-surveyor.firebaseio.com/grades.json</a>'
            ]
        }, {
            title: 'Found an issue?',
            body: [
                '<a href="https://github.com/mehmetbajin/gt-course-surveys/issues" target="_blank">GitHub</a>'
            ]
        }, {
            title: 'Have a question not answered here?',
            body: [
                '<a href="mailto:bajin.mehmet@gmail.com&subject=gt-course-surveys" target="_blank">Email Mehmet</a>'
            ]
        }];
    }
})();
