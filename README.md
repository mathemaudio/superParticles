# superParticles
A plugin for Constructor 2, a "Particles" on steroids

I have noticed that it rather inconvenient to develop and maintain plugins, because we have to put all the data to single "runtime.js" and "edittime.js". Yes, it's possible to list include files for "runtime.js", but I would like to have more consistent and modular dependency referencing, which is great for complex projects.

As an example I decided to develop so called "superParticles" plugin, which is the same as "Particles", but has more features, like rotation randomization, initial scale/fade-in, etc. Something very trivial, best as a starting point for developers.

1. Open a shell and run a command:

``` sh
watchify src_run/main.js -o runtime.js -v
```
3. Open another shell and run another command:

``` sh
watchify src_edit/main_edit.js -o edittime.js -v
```
5. IMPORTANT: don't close those shell windows! From now on it will update "runtime.js" and "edittime" everytime you change anything.

6. If you don't have Watchify/Browserify, you should install it using:

``` sh
npm install -g browserify
`npm install -g watchify
```

if you don't have npm, install Node.
