/**
 * Copyright 2017-2019 John Berlin <n0tan3rd@gmail.com>. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @desc Function that disables the setting of window event handlers onbeforeunload and onunload and
 * disables the usage of window.alert, window.confirm, and window.prompt.
 *
 * This is done to ensure that they can not be used crawler traps.
 */
export default function noNaughtyJS() {
  Object.defineProperty(window, "onbeforeunload", {
    configurable: false,
    // @ts-expect-error TS(2345): Argument of type '{ configurable: false; writeable... Remove this comment to see the full error message
    writeable: false,
    value: function () {}
  });
  Object.defineProperty(window, "onunload", {
    configurable: false,
    // @ts-expect-error TS(2345): Argument of type '{ configurable: false; writeable... Remove this comment to see the full error message
    writeable: false,
    value: function () {}
  });
  window.alert = function () {};
  // @ts-expect-error TS(2322): Type '() => void' is not assignable to type '((mes... Remove this comment to see the full error message
  window.confirm = function () {};
  // @ts-expect-error TS(2322): Type '() => void' is not assignable to type '((mes... Remove this comment to see the full error message
  window.prompt = function () {};

  /*
    We no bot I swear! See
    https://github.com/paulirish/headless-cat-n-mouse
    https://antoinevastel.com/bot%20detection/2018/01/17/detect-chrome-headless-v2.html
  */

  /* eslint-disable */

  if (!(window as any).chrome) {
    const installer = { install() {} };
    (window as any).chrome = {
      app: { isInstalled: false },
      webstore: {
        onInstallStageChanged: {},
        onDownloadProgress: {},
        install(url, onSuccess, onFailure) {
          // @ts-expect-error TS(2554): Expected 0 arguments, but got 3.
          installer.install(url, onSuccess, onFailure);
        }
      },
      csi() {},
      loadTimes() {}
    };
  }

  if (!(window as any).chrome.runtime) {
    (window as any).chrome.runtime = {
      PlatformOs: {
        MAC: "mac",
        WIN: "win",
        ANDROID: "android",
        CROS: "cros",
        LINUX: "linux",
        OPENBSD: "openbsd"
      },
      PlatformArch: {
        ARM: "arm",
        X86_32: "x86-32",
        X86_64: "x86-64",
        MIPS: "mips",
        MIPS64: "mips64"
      },
      PlatformNaclArch: {
        ARM: "arm",
        X86_32: "x86-32",
        X86_64: "x86-64",
        MIPS: "mips",
        MIPS64: "mips64"
      },
      RequestUpdateCheckStatus: {
        THROTTLED: "throttled",
        NO_UPDATE: "no_update",
        UPDATE_AVAILABLE: "update_available"
      },
      OnInstalledReason: {
        INSTALL: "install",
        UPDATE: "update",
        CHROME_UPDATE: "chrome_update",
        SHARED_MODULE_UPDATE: "shared_module_update"
      },
      OnRestartRequiredReason: {
        APP_UPDATE: "app_update",
        OS_UPDATE: "os_update",
        PERIODIC: "periodic"
      },
      connect: function () {}.bind(function () {}),
      sendMessage: function () {}.bind(function () {})
    };
  }

  if (
    (HTMLIFrameElement.prototype as any).__lookupGetter__("contentWindow") ==
    null
  ) {
    Object.defineProperty(HTMLIFrameElement.prototype, "contentWindow", {
      get: function () {
        return window;
      }
    });
  }

  if ((navigator.plugins || []).length === 0) {
    Object.defineProperty(navigator, "plugins", {
      get: () => [1, 2, 3, 4, 5]
    });
  }

  if ((navigator.languages || []).length === 0) {
    Object.defineProperty(navigator, "languages", {
      get: () => ["en-US", "en"]
    });
  }
  /* eslint-enable */
}
