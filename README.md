# superParticles
A plugin for Constructor 2, a "Particles" on steroids

1. Open a shell and run a command:
`watchify src_run/main.js -o runtime.js -v`

3. Open another shell and run another command:
`watchify src_edit/main_edit.js -o edittime.js -v`

5. IMPORTANT: don't close those shell windows! From now on it will update "runtime.js" and "edittime" everytime you change anything.

6. If you don't have Watchify/Browserify, you should install it using:

`npm install -g browserify`
`npm install -g watchify`

if you don't have npm, install Node.
