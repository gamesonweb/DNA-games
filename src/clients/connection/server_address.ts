export var SERVER_LINK = "ws://127.0.0.1:8080";

(window as any).setServerLink = function (link: string) {
  SERVER_LINK = link
}