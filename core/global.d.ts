declare module "vue" {
  export interface GlobalComponents {
    WeToolbar: typeof import("wangeditor5-for-vue3")["WeToolbar"];
    WeEditable: typeof import("wangeditor5-for-vue3")["WeEditable"];
    WeEditor: typeof import("wangeditor5-for-vue3")["WeEditor"];
  }
}

export {};
