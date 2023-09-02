export let theString = jasmine.createSpy('theString');

// IMPORTANT:
// Reset after each spec to prevent spy state from leaking to the next spec
afterEach(function() {
    theString = jasmine.createSpy('theString');
});
