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
            title: 'I am concerned about privacy. How is my information kept secure?',
            body: [
                'The information tracked by the app includes only your name, email, profile image URL, and OMSCS specialization (if set).',
                'Thanks to Firebase\'s robust security infrastructure, the app guarantees that this information is accessible only to individuals who are registered and authenticated.'
            ]
        }, {
            title: 'How do I publish reviews?',
            body: [
                'After signing in, use the floating action button for composing a review that appears on the course reviews page.'
            ]
        }, {
            title: 'How do I publish reviews anonymously?',
            body: [
                'Go to your Profile and enable "Remain anonymous to others?".'
            ]
        }, {
            title: 'How can I access the data?',
            body: [
                'The following endpoints support HTTP GET:',
                '<a href="https://gt-surveyor.firebaseio.com/reviews.json" target="_blank">https://gt-surveyor.firebaseio.com/reviews.json</a>',
                '<a href="https://gt-surveyor.firebaseio.com/grades.json" target="_blank">https://gt-surveyor.firebaseio.com/grades.json</a>'
            ]
        }, {
            title: 'Found an issue?',
            body: [
                'Please submit on <a href="https://github.com/mehmetbajin/gt-course-surveys/issues" target="_blank">GitHub</a>.',
                'If this is an enhancement request, please raise support from your peers. Requests are prioritized by the amount of support from the OMSCS community.'
            ]
        }, {
            title: 'Have a question not answered here?',
            body: [
                '<a href="mailto:bajin.mehmet@gmail.com&subject=gt-course-surveys" target="_blank">Please ask!</a>'
            ]
        }];
    }
})();
