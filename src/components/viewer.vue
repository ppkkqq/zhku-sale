<template>
  <div ref="viewer" class="viewer">
    <span class="preview">
      <img :src="src" alt="" :width="width" :height="height" @click="show($event)">
    </span>

    <div ref="wrapper" class="wrapper" @click="close($event)" @mousewheel="zoom($event)">
      <img :src="src" alt="">
    </div>
  </div>
</template>

<script>
function hasClass(el, cls) {
  if (!el || !cls) return false;
  if (cls.indexOf(" ") !== -1)
    throw new Error("className should not contain space.");
  if (el.classList) {
    return el.classList.contains(cls);
  } else {
    return (" " + el.className + " ").indexOf(" " + cls + " ") > -1;
  }
}

function addClass(el, cls) {
  if (!el) return;
  let curClass = el.className;
  let classes = (cls || "").split(" ");

  for (let i = 0, j = classes.length; i < j; i++) {
    let clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.add(clsName);
    } else if (!hasClass(el, clsName)) {
      curClass += " " + clsName;
    }
  }
  if (!el.classList) {
    el.className = curClass;
  }
}

function removeClass(el, cls) {
  if (!el || !cls) return;
  var classes = cls.split(" ");
  var curClass = " " + el.className + " ";

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.remove(clsName);
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(" " + clsName + " ", " ");
    }
  }
  if (!el.classList) {
    el.className = trim(curClass);
  }
}

export default {
  name: "viewer",
  data() {
    return {
      isShow: false,
      hasModal: false,
      scale: 1,
      pictureSrc: "",
      pictureWidth: "",
      pictureHeight: "",
      modalDom: {}
    };
  },
  props: {
    src: String,
    width: {
      type: String,
      default: "100px"
    },
    height: {
      type: String,
      default: "100px"
    }
  },
  methods: {
    zoom(event) {
      event = event || window.event;
      event.preventDefault();
      event.stopPropagation();
      if (this.isShow == true) {
        if (event.deltaY > 0) {
          this.scale = this.scale > 0.2 ? this.scale - 0.1 : this.scale;
        } else {
          this.scale += 0.1;
        }
        this.$refs.wrapper.style.transform = `scale(${this.scale},${
          this.scale
        })`;
      }
    },
    /*
     * @func getBoundaryType
     * @params HTMLElement img
     * @ret String 'width'|'height'
     */
    getBoundaryType(img) {
      let clientWidth = document.documentElement.clientWidth;
      let clientHeight = document.documentElement.clientHeight;
      let naturalWidth = img.naturalWidth;
      let naturalHeight = img.naturalHeight;
      let ratio = naturalWidth / naturalHeight;
      let width = clientWidth - 100;
      let height = clientHeight - 100;
      if (clientWidth > clientHeight) {
        if (naturalWidth > naturalHeight) {
          if (width / ratio > clientHeight - 100) {
            return "height";
          }
          return "width";
        } else {
          return "height";
        }
      } else {
        if (naturalWidth > naturalHeight) {
          return "width";
        } else {
          if (height * ratio > clientWidth - 100) {
            return "width";
          }
          return "height";
        }
      }
    },
    getModal() {
      let modalDom;
      if (this.hasModal) {
        modalDom = this.modalDom;
      } else {
        modalDom = document.createElement("div");
        modalDom.addEventListener("click", this.close);
        this.modalDom = modalDom;
        this.hasModal = true;
      }

      return modalDom;
    },
    removeModal() {
      this.modalDom.removeEventListener("click", this.close);
      this.$refs.viewer.removeChild(this.modalDom);
      this.modalDom = {};
      this.hasModal = false;
    },
    setModal(toggle) {
      if (toggle) {
        let modalDom = this.getModal();
        this.modalDom = this.$refs.viewer.appendChild(modalDom);

        addClass(this.modalDom, "viewer-modal-enter");
        setTimeout(() => {
          removeClass(this.modalDom, "viewer-modal-enter");
          addClass(this.modalDom, "viewer-modal");
        }, 200);
      } else {
        removeClass(this.modalDom, "viewer-modal");
        addClass(this.modalDom, "viewer-modal-leave");
        setTimeout(() => {
          removeClass(this.modalDom, "viewer-modal-leave");
          this.removeModal();
        }, 200);
      }
    },
    setPicture(toggle) {
      let img = this.$refs.wrapper.childNodes[0];
      toggle ? addClass(img, "image-show") : removeClass(img, "image-show");
    },
    setWrapper(toggle) {
      let wrapper = this.$refs.wrapper;
      if (toggle) {
        let img = wrapper.childNodes[0];
        let clientWidth = document.documentElement.clientWidth;
        let clientHeight = document.documentElement.clientHeight;
        let naturalWidth = img.naturalWidth;
        let naturalHeight = img.naturalHeight;
        let width, height;
        let ratio = naturalWidth / naturalHeight;
        let boundaryType = this.getBoundaryType(img);
        switch (boundaryType) {
          case "width":
            width = clientWidth - 100;
            height = width / ratio;
            break;
          case "height":
            height = clientHeight - 100;
            width = height * ratio;
            break;
        }

        let left = (clientWidth - width) / 2;
        let top = (clientHeight - height) / 2;
        wrapper.setAttribute(
          "style",
          `position:fixed;display:initial;top:${top}px;left:${left}px;width:${width}px;height:${height}px;z-index:2001;`
        );
      } else {
        wrapper.setAttribute("style", `display:none`);
      }
    },
    show(e) {
      if (this.isShow) return;
      this.setModal(true);
      this.setPicture(true);
      this.setWrapper(true);
      this.isShow = true;
    },
    close() {
      if (!this.isShow) return;
      this.setModal(false);
      this.setPicture(false);
      this.setWrapper(false);
      this.isShow = false;
    }
  }
};
</script>

<style lang="stylus">
.viewer {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;

  .preview {
    width: 100%;
    height: 100%;
    cursor: pointer;
  }

  .wrapper {
    position: fixed;
    display: none;
    top: 0;
    right: 0;
    margin: 0;
    z-index: 2001;
  }

  .image-show {
    position: relative;
    display: initial;
    z-index: 2002;
    width: 100%;
    height: 100%;
  }

  .viewer-modal-enter {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0.5;
    background: #000;
    z-index: 2000;
    animation: viewer-modal-in 0.2s ease;
  }

  .viewer-modal-leave {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: #000;
    z-index: 2000;
    opacity: 0.5;
    animation: viewer-modal-out 0.2s ease forwards;
  }

  @keyframes viewer-modal-in {
    0% {
      opacity: 0;
    }

    100% {
    }
  }

  @keyframes viewer-modal-out {
    0% {
    }

    100% {
      opacity: 0;
    }
  }

  .viewer-modal {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0.5;
    background: #000;
    z-index: 2000;
  }
}
</style>
