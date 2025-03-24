System.register([], function (_export, _context) {
  "use strict";

  var cc, Application;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  return {
    setters: [],
    execute: function () {
      _export("Application", Application = /*#__PURE__*/function () {
        function Application() {
          _classCallCheck(this, Application);

          this.settingsPath = 'src/settings.json'; // settings.json file path, usually passed in by the editor when building, you can also specify your own path

          this.showFPS = false; // Whether or not to open the profiler, usually passed in when the editor is built, but you can also specify the value you want
        }

        _createClass(Application, [{
          key: "init",
          value: function init(engine) {
            cc = engine;
            cc.game.onPostBaseInitDelegate.add(this.onPostInitBase.bind(this)); // Listening for engine start process events onPostBaseInitDelegate

            cc.game.onPostSubsystemInitDelegate.add(this.onPostSystemInit.bind(this)); // Listening for engine start process events onPostSubsystemInitDelegate

            cc.game.onPostProjectInitDelegate.add(this.onProjectDataEvent.bind(this)); //inform the poki sdk that the game is loading.

            PokiSDK.gameLoadingStart();
          }
        }, {
          key: "onPostInitBase",
          value: function onPostInitBase() {
            // cc.settings.overrideSettings('assets', 'server', '');
            //Set the debug value in pokisdk based on the build settings.
            PokiSDK.setDebug(cc.settings.debug);
          }
        }, {
          key: "onPostSystemInit",
          value: function onPostSystemInit() {
            // Implement some custom logic
            console.log("OnPostSystemInit");
          }
        }, {
          key: "onProjectDataEvent",
          value: function onProjectDataEvent() {
            console.log("Project Data Loaded");
          }
        }, {
          key: "start",
          value: function start() {
            return cc.game.init({
              // Run the engine with the required parameters
              debugMode: false ? cc.DebugMode.INFO : cc.DebugMode.ERROR,
              settingsPath: this.settingsPath,
              // Pass in the settings.json path
              overrideSettings: {
                // Override part of the data in the configuration file, this field will be described in detail below
                // assets: {
                //      preloadBundles: [{ bundle: 'main', version: 'xxx' }],
                // }
                profiling: {
                  showFPS: this.showFPS
                }
              }
            }).then(function () {
              cc.game.run(function () {
                var splash = document.getElementById("splash");
                splash.classList.add("fade-out");
              });
            });
          }
        }]);

        return Application;
      }());
    }
  };
});